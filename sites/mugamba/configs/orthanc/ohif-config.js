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
      authority: "http://localhost/auth/realms/ozone",
      client_id: "orthanc",
      redirect_uri: "http://localhost:8889/ohif/callback",
      response_type: "code",
      scope: "openid profile email roles",
      post_logout_redirect_uri: "http://localhost:8889/ohif/",
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
        wadoUriRoot: "http://localhost:8889/wado",
        qidoRoot: "http://localhost:8889/dicom-web",
        wadoRoot: "http://localhost:8889/dicom-web",
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
