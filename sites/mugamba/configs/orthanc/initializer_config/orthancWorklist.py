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

orthanc.RegisterOnChangeCallback(OnChange)

getWorklistURL = getConfigItem('ImagingWorklistURL')
updateRequestStatusURL = getConfigItem('ImagingUpdateRequestStatus')
worklistUsername = getConfigItem('ImagingWorklistUsername')
worklistPassword = getConfigItem('ImagingWorklistPassword')
