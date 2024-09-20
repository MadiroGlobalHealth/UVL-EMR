import {
  getAsyncLifecycle,
  getSyncLifecycle,
  defineConfigSchema,
} from "@openmrs/esm-framework";
import { configSchema } from "./config-schema";
import { createDashboardLink } from "./create-dashboard-link.component";
import appMenu from "./components/visualizer-menu-app/visualizer-menu-app-item.component";

const moduleName = "@ugandaemr/esm-data-visualizer-app";
const options = {
  featureName: "data-visualizer",
  moduleName,
};

export const importTranslation = require.context(
  "../translations",
  false,
  /.json$/,
  "lazy"
);

export const root = getAsyncLifecycle(
  () => import("./root.component"),
  options
);

export const dataVisualizerAppMenuItem = getSyncLifecycle(appMenu, options);

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}

export const dataVisualizerDashboardLink = getSyncLifecycle(
  createDashboardLink({
    name: "data-visualizer",
    slot: "data-visualizer-dashboard-slot",
    title: "Data visualizer",
  }),
  options
);

export const confirmModal = getAsyncLifecycle(
  () => import("./components/model/confirm.component"),
  options
);
