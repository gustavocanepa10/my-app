const { withInfoPlist, withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withVectorIcons(config) {
  // Configuração para iOS
  config = withInfoPlist(config, (config) => {
    config.modResults.UIAppFonts = config.modResults.UIAppFonts || [];
    config.modResults.UIAppFonts.push(
      "MaterialIcons.ttf",
      "MaterialCommunityIcons.ttf"
    );
    return config;
  });

  // Configuração para Android (opcional para Expo 49+)
  config = withAndroidManifest(config, (config) => {
    return config;
  });

  return config;
};