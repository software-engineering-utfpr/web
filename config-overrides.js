const {
  override,
  fixBabelImports,
  addLessLoader,
  useEslintRc
} = require('customize-cra');
  
module.exports = override(
  useEslintRc(),
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      '@primary-color': '#00AD45',
      '@font-family': '"Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      '@code-family': '"Open Sans", "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace',
      '@text-color': '#2D2E2E',
      '@error-color': '#FF5154',
      '@warning-color': '#FFF460',
      '@success-color': '#5ECC62',
      '@link-color': '#2F80ED'
    }
  }),
);