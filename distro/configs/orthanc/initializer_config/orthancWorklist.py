import orthanc
import json
import os
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
    """Remove the scheduled worklist entry for an accession once its study has arrived.

    Goes through the worklists plugin's own REST API. An earlier version of this file
    deleted the .wl file directly, on the belief (recorded in the note further down) that
    GET /worklists did not exist. It does: measured against the running instance,
    GET /worklists -> 200, GET /worklists/<bogus> -> 404 and POST /worklists/create -> 400
    with a precise validation message. The original 404 was measured while the worklists
    plugin was not being loaded at all, because "Plugins" was absent from the effective
    configuration - so the premise was wrong, not the API.

    Deleting the file is actively wrong now that entries are created through the plugin
    (see convertInstanceToWorklist): the plugin owns that folder and its Housekeeper
    prunes anything it does not know about, so file-level edits and its store drift apart.
    """
    if not accession_number:
        orthanc.LogWarning('Worklist cleanup skipped: study has no AccessionNumber')
        return False
    try:
        # AfterPlugins: orthanc.RestApiGet reaches only Orthanc CORE routes, so a route
        # registered by another plugin - which /worklists is - comes back as
        # (17, 'Unknown resource') even while an external GET /worklists returns 200. That
        # asymmetry is almost certainly what the note below records as "GET /worklists
        # returns a genuine 404": measured from Python, it looks absent.
        entries = json.loads(orthanc.RestApiGetAfterPlugins('/worklists'))
    except Exception as e:
        orthanc.LogError('Could not list worklists: %s' % str(e))
        return False

    for entry in entries:
        entryId = entry.get('ID')
        if entry.get('Tags', {}).get('AccessionNumber') != accession_number:
            continue
        try:
            orthanc.RestApiDeleteAfterPlugins('/worklists/' + entryId)
            orthanc.LogWarning('Worklist entry removed: %s (accession %s, study arrived)' % (
                entryId, accession_number))
            return True
        except Exception as e:
            orthanc.LogError('Could not remove worklist entry %s: %s' % (entryId, str(e)))
            return False

    orthanc.LogWarning('No worklist entry matched accession %s' % accession_number)
    return False


def OnChange(changeType, level, resource):
    if changeType != orthanc.ChangeType.STABLE_STUDY:
        return
    acquiredAccession = None
    try:
        studyJson = json.loads(orthanc.RestApiGet('/studies/' + resource))
        studyTags = studyJson.get('MainDicomTags', {})
        acquiredAccession = studyTags.get('AccessionNumber')
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

    # The order has been acquired, so its worklist entry must stop being offered to the
    # modality. Deliberately outside the try above: the status report to OpenMRS and this
    # cleanup are independent, and a failure to report must not leave a stale entry
    # queued forever (nor the reverse).
    try:
        if acquiredAccession:
            delete_worklist_by_accession(acquiredAccession)
    except Exception as e:
        orthanc.LogError('Worklist cleanup failed after stable study: ' + str(e))

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
    """Hand a worklist item posted via /tools/create-dicom to the worklists plugin.

    The bridge cannot POST /worklists/create itself for the reason in the note above, so it
    posts the same {"Tags": {...}} body to /tools/create-dicom, which lands the item in
    Orthanc as an ordinary instance. This callback recognises it, re-submits it through the
    plugin's own API, and deletes the instance so it does not show up as a study.

    It used to write the DICOM straight into the worklists folder instead. That looked like
    it worked - the modality could C-FIND the entry - but the folder belongs to the
    worklists plugin, and its Housekeeper thread prunes entries that are not in its store.
    Every Orthanc restart therefore silently wiped every entry written that way, while the
    bridge's eip_processed_radiology_order rows survived and stopped it from ever
    recreating them. Measured on UAT: 25 rows, 6 surviving entries, 3 studies. Creating
    through the plugin also makes the entries visible to GET /worklists, which is what the
    bridge's own duplicate check reads - that check could never match before.
    """
    try:
        tags = json.loads(orthanc.RestApiGet('/instances/%s/tags?simplify' % instanceId))
    except Exception as e:
        orthanc.LogError('Worklist check failed for instance %s: %s' % (instanceId, str(e)))
        return False

    if WORKLIST_MARKER_TAG not in tags:
        return False  # an ordinary image, leave it alone

    accession = tags.get('AccessionNumber')
    try:
        created = json.loads(orthanc.RestApiPostAfterPlugins('/worklists/create',
                                                             json.dumps({'Tags': tags})))
        orthanc.LogWarning('Worklist entry created: %s (accession %s, patient %s)' % (
            created.get('ID'), accession or '<none>', tags.get('PatientID')))
    except Exception as e:
        # Leave the instance in place so the item is not lost silently; the next poll can
        # retry it.
        orthanc.LogError('Could not create worklist entry for %s: %s' % (instanceId, str(e)))
        return False

    try:
        orthanc.RestApiDelete('/instances/%s' % instanceId)
    except Exception as e:
        orthanc.LogWarning('Worklist entry created but instance %s could not be deleted: %s'
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
