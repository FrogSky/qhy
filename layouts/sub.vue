<template>
  <div id="sub">
    <div class="header">
      <a href="javascript:;" class="header_goback" @click="goBack">
        <img src="~/assets/images/goback.png" alt="">
      </a>
    </div>
    <nuxt/>
  </div>
</template>
<script>
  
export default {
  methods: {
    goBack(){
      // alert(this.$router);
      // debugger;
      console.log(this.$router);
      // this.$router.go(-1)
      this.$router.back(-1)
      // '../'
      // window.history.back();
    },
  },
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
<style lang="less" scoped>
@import "~assets/styles/index.less";

#sub {
  margin: 0 auto;
  .rem(padding-top, 48);
  max-width: 768px;
}

.header {
  width: 100%;
  max-width: 768px;
  position: fixed;
  top: 0;
  z-index: 100;
  background: url('~assets/images/logo2x.png') center / auto .torem(24) no-repeat #2C2C2C;
  .rem(height, 48);
  &_goback {
    display: block;
    .rem(width, 50);
    height: 100%;
    img{
      margin: .torem(14) .torem(20) 0;
      .rem(width, 10);
    }
  }
}
</style>

