module.exports = {
  lintOnSave: false,
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            'primary-color': '#3D50FF',
            'border-radius-base': '4px',
          },
          javascriptEnabled: true,
        },
      },
    },
  },
  devServer: {
    proxy: {
      '/api': {
          // target: 'http://192.168.150.60:38080/api/',
          // target: 'https://stage.ibc.iobscan.io/api/',
          // target: 'http://10.1.4.118:3000/',
          // target: 'https://ibc.iobscan.io/api',
          // target: 'http://10.1.4.118:3000/',
          target: 'http://192.168.150.60:38080/api/',
        secure: false,
        pathRewrite: { '^/api': '' },
      },
    },
  },
};
