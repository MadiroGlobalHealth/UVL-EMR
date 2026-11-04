import { defineConfigSchema, getAsyncLifecycle } from '@openmrs/esm-framework';
import { configNamespace, configSchema } from './config-schema';

const moduleName = '@madiro/esm-uvl-partograph-app';

const options = {
  featureName: 'uvl-partograph-chart',
  moduleName,
};

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

export function startupApp() {
  defineConfigSchema(configNamespace, configSchema);
}

export const partographChart = getAsyncLifecycle(() => import('./partograph/partograph-chart.component'), options);
