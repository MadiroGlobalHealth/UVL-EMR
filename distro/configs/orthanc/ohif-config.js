window.config = {
  extensions: [],
  modes: [],
  showStudyList: true,
  maxNumberOfWebWorkers: 3,
  omitQuotationForMultipartRequest: true,
  showWarningMessageForCrossOrigin: true,
  showCPUFallbackMessage: true,
  showLoadingIndicator: true,
  strictZSpacingForVolumeViewport: true,
  maxNumRequests: {
    interaction: 100,
    thumbnail: 75,
    prefetch: 25,
  },
  oidc: [
    {
      authority: "${KEYCLOAK_URL}/realms/ozone",
      client_id: "orthanc",
      redirect_uri: "${PACS_PUBLIC_URL}/ohif/callback",
      response_type: "code",
      scope: "openid profile email roles",
      post_logout_redirect_uri: "${PACS_PUBLIC_URL}/ohif/",
      automaticSilentRenew: true,
      revokeAccessTokenOnSignout: true,
    }
  ],
  dataSources: [
    {
      namespace: "@ohif/extension-default.dataSourcesModule.dicomweb",
      sourceName: "dicomweb",
      configuration: {
        friendlyName: "Orthanc DICOMweb",
        name: "orthanc",
        wadoUriRoot: "${PACS_PUBLIC_URL}/wado",
        qidoRoot: "${PACS_PUBLIC_URL}/dicom-web",
        wadoRoot: "${PACS_PUBLIC_URL}/dicom-web",
        qidoSupportsIncludeField: true,
        supportsReject: false,
        imageRendering: "wadors",
        thumbnailRendering: "wadors",
        enableStudyLazyLoad: true,
        supportsFuzzyMatching: false,
        supportsWildcard: true,
        staticWado: false,
        singlepart: "bulkdata,video",
        requestOptions: {
          requestFromBrowser: true,
          getAuthorizationHeader: function() {
            const token = window.ohifToken;
            return token ? { Authorization: "Bearer " + token } : {};
          }
        }
      }
    }
  ],
  defaultDataSourceName: "dicomweb",
};
