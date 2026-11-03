// Requests to the PACS carry the signed-in user's own Keycloak token (UVL-EMR#429).
//
// Orthanc Explorer 2 opens OHIF with ?token=<viewer instant link>: study-scoped and
// carrying no user. OHIF sends that token on every request, including the report save
// (STOW). The authorization plugin can tie that save to no one, so it applied the
// anonymous profile, and the save only worked while anonymous users could upload.
//
// OE2 keeps the user's Keycloak access and refresh tokens in localStorage
// ("vue-token", "vue-refresh-token", same origin as this page) and refreshes them while
// its tab is open. This shim, which runs before OHIF starts, replaces the Authorization
// header of every request to the PACS with that user token, refreshing it itself
// (Keycloak's iss and azp claims give the endpoint and client) so the viewer keeps
// working if the OE2 tab is closed. The plugin then applies the user's PACS role:
// a radiologist can save a report, an X-ray technician cannot. Without a usable user
// token the instant link is left in place, so viewing still works.
//
// OHIF's own oidc block is not an option: see the note in window.config below.
(function () {
  var PACS = "${PACS_PUBLIC_URL}";

  function claims(token) {
    try {
      var part = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(atob(part));
    } catch (e) {
      return null;
    }
  }

  function userToken(minSeconds) {
    var token = localStorage.getItem("vue-token");
    var c = token && claims(token);
    if (!c || !c.exp || !c.iss) return null;
    return c.exp * 1000 > Date.now() + (minSeconds || 15) * 1000 ? token : null;
  }

  var refreshing = null;
  function refresh() {
    if (refreshing) return refreshing;
    var refreshToken = localStorage.getItem("vue-refresh-token");
    var c = claims(localStorage.getItem("vue-token") || "");
    if (!refreshToken || !c || !c.iss || !c.azp) return Promise.resolve();
    var body = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: c.azp,
      refresh_token: refreshToken,
    });
    refreshing = fetchOriginal(c.iss + "/protocol/openid-connect/token", { method: "POST", body: body })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (t) {
        if (t && t.access_token) {
          localStorage.setItem("vue-token", t.access_token);
          if (t.refresh_token) localStorage.setItem("vue-refresh-token", t.refresh_token);
        }
      })
      .catch(function () {})
      .then(function () { refreshing = null; });
    return refreshing;
  }
  setInterval(function () { if (!userToken(70)) refresh(); }, 20000);

  function isPacs(url) {
    try {
      return new URL(url, location.href).href.indexOf(PACS + "/") === 0;
    } catch (e) {
      return false;
    }
  }

  function isStow(url) {
    try {
      return /\/dicom-web\/studies(\/[^/?]+)?\/?(\?.*)?$/.test(new URL(url, location.href).href);
    } catch (e) {
      return false;
    }
  }

  // OHIF only says "request failed" when the PACS refuses a report save, which an
  // X-ray technician would read as a fault. Say what happened, in French and English.
  function refusedSave() {
    var id = "uvl-refused-save";
    if (document.getElementById(id)) return;
    var box = document.createElement("div");
    box.id = id;
    box.setAttribute("role", "alert");
    box.style.cssText = "position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:100000;" +
      "max-width:520px;padding:14px 40px 14px 16px;border-radius:6px;background:#b42318;color:#fff;" +
      "font:14px/1.4 sans-serif;box-shadow:0 4px 16px rgba(0,0,0,.4)";
    box.innerHTML = "<strong>Rapport non enregistré.</strong> Seul un radiologue peut enregistrer un rapport. " +
      "Si vous êtes radiologue, reconnectez-vous ou contactez l'administrateur.<br>" +
      "<em>Report not saved: only a radiologist can save reports.</em>";
    var close = document.createElement("button");
    close.textContent = "×";
    close.setAttribute("aria-label", "Fermer");
    close.style.cssText = "position:absolute;top:6px;right:10px;background:none;border:0;color:#fff;" +
      "font-size:20px;cursor:pointer";
    close.onclick = function () { box.remove(); };
    box.appendChild(close);
    // Stays until closed: a technician who looks away must still see why nothing was saved.
    document.body.appendChild(box);
  }

  var open = XMLHttpRequest.prototype.open;
  var setHeader = XMLHttpRequest.prototype.setRequestHeader;
  var send = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (method, url) {
    this.__uvlPacs = isPacs(url);
    this.__uvlStow = this.__uvlPacs && String(method).toUpperCase() === "POST" && isStow(url);
    this.__uvlAuthSet = false;
    return open.apply(this, arguments);
  };
  XMLHttpRequest.prototype.setRequestHeader = function (name, value) {
    if (this.__uvlPacs && String(name).toLowerCase() === "authorization") {
      var token = userToken();
      if (token) value = "Bearer " + token;
      this.__uvlAuthSet = true;
    }
    return setHeader.call(this, name, value);
  };
  XMLHttpRequest.prototype.send = function () {
    if (this.__uvlPacs && !this.__uvlAuthSet) {
      var token = userToken();
      if (token) setHeader.call(this, "Authorization", "Bearer " + token);
    }
    if (this.__uvlStow) {
      this.addEventListener("load", function () {
        if (this.status === 401 || this.status === 403) refusedSave();
      });
    }
    return send.apply(this, arguments);
  };

  var fetchOriginal = window.fetch.bind(window);
  window.fetch = function (input, init) {
    var url = typeof input === "string" ? input : input && input.url;
    var token = isPacs(url) && userToken();
    if (token) {
      init = Object.assign({}, init);
      var headers = new Headers(init.headers || (typeof input !== "string" && input.headers) || {});
      headers.set("Authorization", "Bearer " + token);
      init.headers = headers;
    }
    var stow = isPacs(url) && isStow(url) &&
      String((init && init.method) || (typeof input !== "string" && input.method) || "GET").toUpperCase() === "POST";
    var result = fetchOriginal(input, init);
    if (stow) {
      result.then(function (r) { if (r.status === 401 || r.status === 403) refusedSave(); }, function () {});
    }
    return result;
  };
})();

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
  // Authentication here starts from the same token-in-the-URL scheme Stone uses,
  // issued by orthanc-auth-service and carried as ?token=<jwt>, which is what
  // "TokenGetArguments": ["token"] in orthanc.json accepts; the shim above then swaps
  // in the signed-in user's own token. That is also why "/ohif/" sits in the
  // Authorization block's UncheckedFolders: the viewer's HTML is public and the token
  // guards the data underneath it.
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
        // No getAuthorizationHeader here: this OHIF build takes every auth header from
        // its userAuthenticationService and never calls the data source's one.
        requestOptions: {
          requestFromBrowser: true,
        }
      }
    }
  ],
  defaultDataSourceName: "dicomweb",
};
