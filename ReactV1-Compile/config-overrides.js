// const { override } = require("customize-cra");

// module.exports = function override(config, env) {
//   // antd按需加载
//   config = injectBabelPlugin(
//     ["import", { libraryName: "antd", libraryDirectory: "es", style: "css" }],
//     config
//   );

//   // 添加装饰器能力
//   config = injectBabelPlugin(
//     ["@babel/plugin-proposal-decorators", { legacy: true }],
//     config
//   );

//   return config;
// };
const {
  override,
  disableEsLint,
  overrideDevServer,
  watchAll
} = require("customize-cra");

module.exports = {
  webpack: override(
    // usual webpack plugin
    disableEsLint()
  ),
  devServer: overrideDevServer(
    // dev server plugin
    watchAll()
  )
};