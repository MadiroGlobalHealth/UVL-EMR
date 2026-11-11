const config = require('openmrs/default-rspack-config');

// @openmrs/esm-patient-common-lib (the side-panel button's launch helper) is published as TypeScript
// source, as in the patient chart monorepo it comes from, so compile it like this module's own code.
config.scriptRuleConfig.exclude = /node_modules(?![\/\\]@openmrs[\/\\]esm-patient-common-lib[\/\\])/;

module.exports = config;
