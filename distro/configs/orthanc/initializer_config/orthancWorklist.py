import orthanc
import json
import urllib.request
import urllib.error
import base64

def make_request(url, method='GET', data=None, username=None, password=None):
    req = urllib.request.Request(url, method=method)
    if username and password:
        credentials = base64.b64encode(f'{username}:{password}'.encode()).decode()
        req.add_header('Authorization', f'Basic {credentials}')
    if data:
        req.add_header('Content-Type', 'application/json')
        req.data = json.dumps(data).encode()
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            result = response.read().decode()
            orthanc.LogWarning(f'HTTP {method} {url} -> {response.status}: {result[:200]}')
            return json.loads(result)
    except urllib.error.HTTPError as e:
        orthanc.LogError(f'HTTP error {e.code} on {url}: {e.reason}')
        raise
    except Exception as e:
        orthanc.LogError(f'Request error on {url}: {str(e)}')
        raise

    try:
        responseJson = make_request(getWorklistURL, username=worklistUsername, password=worklistPassword)
        orthanc.LogWarning('Worklist response count: %d' % len(responseJson))

        for dicomJson in responseJson:
            responseDicom = orthanc.CreateDicom(json.dumps(dicomJson), None, orthanc.CreateDicomFlags.NONE)
            if query.WorklistIsMatch(responseDicom):
                answers.WorklistAddAnswer(query, responseDicom)
    except Exception as e:
        orthanc.LogError('Failed to get worklist: ' + str(e))

def delete_worklist_by_accession(accession_number):
    """Delete Orthanc worklist entry matching the accession number."""
    try:
        response = orthanc.RestApiGet('/worklists')
        worklist_ids = json.loads(response)
        for wl_id in worklist_ids:
            try:
                wl_data = json.loads(orthanc.RestApiGet('/worklists/' + wl_id))
                tags = wl_data.get('Tags', {})
                if tags.get('AccessionNumber') == accession_number:
                    orthanc.RestApiDelete('/worklists/' + wl_id)
                    orthanc.LogWarning('Deleted worklist entry {} for accession {}'.format(
                        wl_id, accession_number))
                    return True
            except Exception as e:
                orthanc.LogWarning('Error checking worklist {}: {}'.format(wl_id, str(e)))
    except Exception as e:
        orthanc.LogWarning('Error deleting worklist: {}'.format(str(e)))
    return False


def OnChange(changeType, level, resource):
    if changeType != orthanc.ChangeType.STABLE_STUDY:
        return
    try:
        studyJson = json.loads(orthanc.RestApiGet('/studies/' + resource))
        studyTags = studyJson.get('MainDicomTags', {})
        studyInfo = {
            'accessionNumber': studyTags.get('AccessionNumber'),
            'studyInstanceUID': studyTags.get('StudyInstanceUID'),
            'referringPhysicianName': studyTags.get('ReferringPhysicianName'),
            'studyDescription': studyTags.get('StudyDescription'),
            'studyID': studyTags.get('StudyID')
        }

        allSeries = []
        for seriesID in studyJson.get('Series', []):
            seriesJson = json.loads(orthanc.RestApiGet('/series/' + seriesID))
            seriesTags = seriesJson.get('MainDicomTags', {})
            stepID = None
            instanceInfo = {}

            if 'Instances' in seriesJson and seriesJson['Instances']:
                instID = seriesJson['Instances'][0]
                instanceJson = json.loads(orthanc.RestApiGet(f'/instances/{instID}/tags?simplify'))
                instSeq = instanceJson.get('RequestAttributesSequence', [])
                if isinstance(instSeq, list):
                    for item in instSeq:
                        if 'ScheduledProcedureStepID' in item:
                            stepID = item['ScheduledProcedureStepID']
                            break

                instanceInfo = {
                    'patientBirthDate': instanceJson.get('PatientBirthDate'),
                    'patientID': instanceJson.get('PatientID'),
                    'patientName': instanceJson.get('PatientName'),
                    'scheduledProcedureStepID': stepID,
                    'studyInstanceUID': instanceJson.get('StudyInstanceUID'),
                    'numberOfSlices': instanceJson.get('NumberOfSlices'),
                    'scheduledPerformingPhysician': instanceJson.get('PerformingPhysicianName'),
                    'performedProcedureStepDescription': instanceJson.get('PerformedProcedureStepDescription'),
                    'performedProcedureStepStartDate': instanceJson.get('PerformedProcedureStepStartDate'),
                    'performedProcedureStepStartTime': instanceJson.get('PerformedProcedureStepStartTime'),
                    'requestedProcedureDescription': instanceJson.get('RequestedProcedureDescription'),
                }

            seriesInfo = {
                'seriesID': seriesID,
                'modality': seriesTags.get('Modality'),
                'seriesDescription': seriesTags.get('SeriesDescription'),
                'seriesInstanceUID': seriesTags.get('SeriesInstanceUID'),
                'stationName': seriesTags.get('StationName'),
                'parentStudy': studyJson.get('ParentStudy')
            }

            allSeries.append({
                'seriesInfo': seriesInfo,
                'instanceInfo': instanceInfo,
                'scheduledProcedureStepID': stepID
            })

        if any(s['scheduledProcedureStepID'] for s in allSeries):
            payload = {
                'studyInfo': studyInfo,
                'seriesList': allSeries
            }
            orthanc.LogWarning('Payload sent: ' + json.dumps(payload, indent=2))
            result = make_request(updateRequestStatusURL, method='POST', data=payload,
                        username=worklistUsername, password=worklistPassword)
            orthanc.LogWarning('Update result: ' + json.dumps(result)[:200])
        else:
            orthanc.LogWarning('No scheduledProcedureStepID found in study, skipping update')

    except Exception as e:
        orthanc.LogError('Failed to process stable study: ' + str(e))

def getConfigItem(configItemName):
    config = orthanc.GetConfiguration()
    configJson = json.loads(config)
    return configJson[configItemName]

# Registration moved to the bottom of this file, where OnChangeDispatch wraps this
# handler together with the worklist conversion. The Python plugin permits exactly
# one on-changes callback and raises RuntimeError on a second, so both have to be
# reached through a single registration.

getWorklistURL = getConfigItem('ImagingWorklistURL')
updateRequestStatusURL = getConfigItem('ImagingUpdateRequestStatus')
worklistUsername = getConfigItem('ImagingWorklistUsername')
worklistPassword = getConfigItem('ImagingWorklistPassword')


# ---------------------------------------------------------------------------
# Order -> modality worklist
#
# Orthanc's worklists plugin serves MODALITY WORKLIST C-FIND out of a folder of
# *.wl files and exposes no REST API to put anything in that folder — verified
# against the running instance: with the authorization check bypassed,
# GET /worklists returns a genuine 404 while GET /system returns 200. So the EIP
# bridge had nothing to call, and an OpenMRS radiology order could never reach a
# modality.
#
# Adding a REST route here does not fix it either, because the route would then need
# authorising, and the authorization plugin cannot express it:
#
#   * UncheckedFolders and UncheckedResources exempt reads only — a POST still 403s;
#   * its "Permissions" key REPLACES the 48 patterns StandardConfigurations installs
#     for orthanc-explorer-2 / stone-webviewer / ohif rather than adding to them
#     (measured: 48 -> 4), and it cannot reproduce them: elements must have at least
#     three members, so the two PUBLIC routes in that set (post /auth/tokens/decode,
#     post /tools/lookup) are inexpressible. Declaring the set without them breaks the
#     viewers; declaring them with two members makes Orthanc exit on startup.
#
# So the bridge posts its worklist item to /tools/create-dicom instead, which the
# standard configuration already authorises (post ^/tools/create-dicom$ - all|upload)
# and which takes the same {"Tags": {...}} body the bridge was already sending. That
# lands the item in Orthanc as an ordinary instance; this callback recognises it,
# writes it into the worklists folder where the modality can C-FIND it, and deletes the
# instance so it does not show up as a study.
#
# Recognised by the presence of ScheduledProcedureStepSequence, which is what makes a
# dataset a worklist item rather than an image.
# ---------------------------------------------------------------------------

import os

WORKLIST_MARKER_TAG = 'ScheduledProcedureStepSequence'


def _worklistDir():
    # "Directory" is the key of the current worklists plugin; "Database" was the legacy
    # ModalityWorklists one's name for the same folder. Both are read so this script does
    # not depend on which plugin the image happens to ship — reading only "Database"
    # against the current plugin would silently fall through to the default below, which
    # is right today only because the config happens to use that same path.
    try:
        worklists = getConfigItem('Worklists')
        return worklists.get('Directory') or worklists['Database']
    except Exception:
        return '/var/lib/orthanc/worklists'


def _safeName(value, fallback):
    keep = [c for c in str(value or '') if c.isalnum() or c in '._-']
    name = ''.join(keep).strip('.')
    return name if name else fallback


def convertInstanceToWorklist(instanceId):
    """Move a worklist item posted via /tools/create-dicom into the worklists folder."""
    try:
        tags = json.loads(orthanc.RestApiGet('/instances/%s/tags?simplify' % instanceId))
    except Exception as e:
        orthanc.LogError('Worklist check failed for instance %s: %s' % (instanceId, str(e)))
        return False

    if WORKLIST_MARKER_TAG not in tags:
        return False  # an ordinary image, leave it alone

    accession = tags.get('AccessionNumber')
    # Named after the accession so re-sending an order overwrites its entry instead of
    # leaving the modality two to choose between.
    name = _safeName(accession, instanceId)
    directory = _worklistDir()
    path = os.path.join(directory, name + '.wl')

    try:
        dicom = orthanc.RestApiGet('/instances/%s/file' % instanceId)
        os.makedirs(directory, exist_ok=True)
        # Write-then-rename: the worklists plugin scans this folder continuously and a
        # half-written file would be read as a corrupt entry.
        tmp = path + '.part'
        with open(tmp, 'wb') as handle:
            handle.write(dicom)
        os.replace(tmp, path)
        orthanc.LogWarning('Worklist entry written: %s (accession %s, patient %s)' % (
            path, accession or '<none>', tags.get('PatientID')))
    except Exception as e:
        orthanc.LogError('Could not write worklist entry for %s: %s' % (instanceId, str(e)))
        return False

    # Delete only after the file is safely in place, so a failure above leaves the
    # instance in Orthanc to retry rather than losing the order silently.
    try:
        orthanc.RestApiDelete('/instances/%s' % instanceId)
    except Exception as e:
        orthanc.LogWarning('Worklist entry written but instance %s could not be deleted: %s'
                           % (instanceId, str(e)))
    return True


# One registration for both handlers. The Python plugin allows exactly one on-changes
# callback and raises "Can only register one Python on-changes callback" on a second,
# which aborts plugin initialisation and stops Orthanc outright — so OnChange's original
# registration above was replaced by this dispatcher rather than added to. Worklist
# conversion is wrapped in its own try/except so a failure there cannot stop the
# STABLE_STUDY handling that reports finished studies back to OpenMRS.
_previousOnChange = OnChange


def OnChangeDispatch(changeType, level, resource):
    try:
        if changeType == orthanc.ChangeType.NEW_INSTANCE:
            convertInstanceToWorklist(resource)
    except Exception as e:
        orthanc.LogError('Worklist conversion failed for %s: %s' % (resource, str(e)))
    _previousOnChange(changeType, level, resource)


orthanc.RegisterOnChangeCallback(OnChangeDispatch)
