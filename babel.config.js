module.exports = function (api) {
  api.cache(true)
  return {
    presets: [
      '@babel/preset-env'
    ],
    plugins: [
      [
        '@babel/plugin-proposal-decorators',
        { decoratorsBeforeExport: true }
      ],
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-proposal-class-properties'
    ]
  }
}