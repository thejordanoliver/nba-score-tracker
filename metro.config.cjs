// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Exclude .web.js overrides
config.resolver.resolverMainFields = ["react-native", "browser", "main"];

module.exports = config;


