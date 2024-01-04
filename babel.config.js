module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript'
  ],
  plugins: [
    ['module-resolver', {
      alias: {
        "@models": "./src/models",
        "@shared": "./src/shared",
        "@services": "./src/services",
        "@middlewares": "./src/middlewares",
        "@controllers": "./src/controllers",
        "@utils": "./src/utils",
        "@enums": "./src/enums",
        "@interfaces": "./src/interfaces",
        "@configs": "./src/configs"
      }
    }],
    "babel-plugin-transform-typescript-metadata",
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties", { "loose": true }],
  ],
}
