const { override, fixBabelImports } = require('customize-cra');

module.exports = override(
 // 针对antd实现 按需打包：根据import来打包（使用babel-plugin-import）
 fixBabelImports('import', {
  libraryName: 'antd',
  libraryDirectory: 'es',
  style: 'css', //自动打包相关样式
 }),
);