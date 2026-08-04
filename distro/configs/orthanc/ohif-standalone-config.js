window.config = {
  extensions: [],
  modes: [],
  showStudyList: true,
  maxNumberOfWebWorkers: 3,
  omitQuotationForMultipartRequest: true,
  showWarningMessageForCrossOrigin: false,
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
      redirect_uri: "http://localhost:3000/callback",
      response_type: "code",
      scope: "openid profile email roles",
      post_logout_redirect_uri: "http://localhost:3000/",
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
        wadoUriRoot: "${OPENMRS_PUBLIC_URL}/orthanc-cors/wado",
        qidoRoot: "${OPENMRS_PUBLIC_URL}/orthanc-cors/dicom-web",
        wadoRoot: "${OPENMRS_PUBLIC_URL}/orthanc-cors/dicom-web",
        qidoSupportsIncludeField: true,
        supportsReject: false,
        imageRendering: "wadors",
        thumbnailRendering: "wadors",
        enableStudyLazyLoad: true,
        supportsFuzzyMatching: false,
        supportsWildcard: true,
        staticWado: false,
        singlepart: "bulkdata,video",
      }
    }
  ],
  defaultDataSourceName: "dicomweb",
};
