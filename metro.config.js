// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// 1. Watch all files in the project
config.watchFolders = [path.resolve(__dirname)];

// 2. Let Metro know where to resolve packages
config.resolver.nodeModulesPaths = [path.resolve(__dirname, 'node_modules')];

// 3. Configure path aliases
config.resolver.extraNodeModules = {
  '@': path.resolve(__dirname, 'src'),
};

// 4. Platform-specific extensions (ensures web uses .web.tsx, native uses .native.tsx)
config.resolver.sourceExts = [...config.resolver.sourceExts, 'css'];
config.resolver.platforms = ['web', 'ios', 'android'];

// 5. Remove CSS transformer (Expo web handles CSS natively via webpack)
// No need for custom transformer; Expo's built-in web support handles CSS

module.exports = config;
