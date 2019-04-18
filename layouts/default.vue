<template>
  <div id="app">
    <nuxt/>
  </div>
</template>
<script>
import Vue from 'vue';
import { Toast } from 'wc-messagebox'
import 'wc-messagebox/style.css'
import wcSwiper from 'wc-swiper'
import 'wc-swiper/style.css'

Vue.use(wcSwiper);
Vue.use(Toast)//添加全局toast，暂时放这里

export default {
  mounted () {
    //根据设备宽度计算html的font-size，等同于@media的设置值 （meta的scle等参数值待定，默认为1）
    (function(){
      var deviceWidth = document.documentElement.clientWidth;
      if(deviceWidth > 768) deviceWidth = 768;
      document.documentElement.style.fontSize = deviceWidth*16 / 414 + 'px';
    }())
  }
}
</script>
<style>
html {
  font-family: 'PingFangSC-Regular', Helvetica, Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

#app {
  margin: 0 auto;
  max-width: 768px;
}
</style>