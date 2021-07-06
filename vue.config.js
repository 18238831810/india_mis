module.exports = {
    publicPath:process.env.VUE_APP_TITLE,
    outputDir: 'user-mis',
    lintOnSave: false,
    productionSourceMap:true,
    configureWebpack: {
        //关闭 webpack 的性能提示
        performance: {
            hints:false
        },
        //警告 webpack 的性能提示
        /*  performance: {
              hints:'warning',
              //入口起点的最大体积
              maxEntrypointSize: 50000000,
              //生成文件的最大体积
              maxAssetSize: 30000000,
              //只给出 js 文件的性能提示
              assetFilter: function(assetFilename) {
                  return assetFilename.endsWith('.js');
              }
          }*/
    },
    devServer: {
        overlay: {
            warnings: false,
            errors: false
        },
        proxy: {
            '/mis': {
                target: 'http://192.168.35.84:8086',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/mis': '/mis'
                }
            },
        }
    },

};
