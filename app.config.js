// Completa o app.json: liga o Firebase (push no Android) quando o google-services.json existir
// e usa o projectId do EAS para gerar o token de notificação.
const fs = require('fs');

module.exports = ({ config }) => {
  const projectId = process.env.EAS_PROJECT_ID || config.extra?.eas?.projectId;
  return {
    ...config,
    android: {
      ...config.android,
      ...(fs.existsSync('./google-services.json') ? { googleServicesFile: './google-services.json' } : {}),
    },
    extra: { ...config.extra, ...(projectId ? { eas: { projectId } } : {}) },
  };
};
