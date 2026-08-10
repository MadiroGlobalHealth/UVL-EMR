window.config = {
  extensions: [],
  modes: [],
  showStudyList: false,
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
  // NO oidc block. It looks like the obvious way to put Keycloak in front of the
  // viewer, but Orthanc's OHIF plugin cannot complete the flow: it serves exactly
  // four paths — /ohif/, index.html, app-config.js and a hardcoded "viewer" — and
  // treats everything else under /ohif/(.*) as a static asset lookup. The OIDC
  // redirect_uri therefore lands on /ohif/callback, which no file backs, and Orthanc
  // answers 404 "Accessing an inexistent item". Reproduced on UAT: login succeeded at
  // Keycloak and the callback then dead-ended, so the viewer could never start.
  //
  // Authentication here is the same token-in-the-URL scheme Stone uses, issued by
  // orthanc-auth-service and carried as ?token=<jwt>, which is what
  // "TokenGetArguments": ["token"] in orthanc.json accepts. That is also why
  // "/ohif/" sits in the Authorization block's UncheckedFolders: the viewer's HTML
  // is public and the token guards the data underneath it.
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
        stowRoot: "${PACS_PUBLIC_URL}/dicom-web",
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
            const token = localStorage.getItem("vue-token");
            return token ? { Authorization: "Bearer " + token } : {};
          }
        }
      }
    }
  ],
  defaultDataSourceName: "dicomweb",
};
