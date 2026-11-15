import { getAsyncLifecycle } from '@openmrs/esm-framework';

const moduleName = '@madiro/esm-uvl-imaging-app';

const options = {
  featureName: 'uvl-imaging-studies',
  moduleName,
};

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

export function startupApp() {}

export const imagingStudies = getAsyncLifecycle(
  () => import('./imaging-studies/imaging-studies.component'),
  options,
);
