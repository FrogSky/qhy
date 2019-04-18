const pkg = require('./package')

const Test = process.env.ENV == 'test';

const Debug = process.env.ENV == 'dev' || Test;

const Config = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, minimal-ui' },
      { hid: 'description', name: 'description', content: pkg.description },
      { name:'screen-orientation', content:'portrait'},
      { name:'apple-mobile-web-app-capable', content:'yes'},
      { name:'format-detection', content:'telephone=no'},
      { name:'x5-fullscreen', content:'true'},
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#2C2C2C' },

  /*
  ** Global CSS
  */
  css: [
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios'
  ],

  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    proxy: true, // Can be also an object with default options
  },

  // See https://zh.nuxtjs.org/api/configuration-env
  env: {
    API: Debug ? 'http://qhy.cp59.ott.cibntv.net/test' : 'http://qhy.cp59.ott.cibntv.net',
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    publicPath: 'http://file.iguxuan.com/h5/static/',
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },
  },

  router: {
    base: Debug ? Test ? '/test/h5/' : '/' : '/h5/',
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      } else {
        let position = {}
        // 目标页面子组件少于两个
        if (to.matched.length < 2) {
          // 滚动至页面顶部
          position = { x: 0, y: 0 }
        } else if (to.matched.some(r => r.components.default.options.scrollToTop)) {
          // 如果目标页面子组件中存在配置了scrollToTop为true
          position = { x: 0, y: 0 }
        }
        if (to.hash) {
          // 如果目标页面的url有锚点，则滚动至锚点所在的位置
          position = { selector: to.hash }
        }
        return position
      }
    },
  },

}

const TestExtend = {
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    proxy: true, // Can be also an object with default options
    prefix: Test ? '/test' : '',
  },
  proxy: {
    '/v1/': { target: 'http://54.223.240.66:8081', pathRewrite: {'^/v1/': '/v1/'} },
    '/test/v1/': { target: 'http://54.223.240.66:8081', pathRewrite: {'^/test/v1/': '/v1/'} }
  },
};

module.exports = Object.assign(Config, Debug ? TestExtend : {});
