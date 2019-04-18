<template>
  <div id="first">
    <div class="header">
      <a href="javascript:;" class="header_goback" @click="goBack">
        <img src="~/assets/images/goback.png" alt="">
      </a>
      <a href="tel:400-920-7676" class="header_link service">
        <img src="~/assets/images/service.png" alt="">
      </a>
    </div>
    <nuxt/>
    <div class="footer">
      <router-link to="/home" active-class="active" class="footer_index footer_item">首页</router-link>
      <router-link to="/recommend" active-class="active" class="footer_reco footer_item">精品</router-link>
      <router-link to="/vip" active-class="active" class="footer_vip footer_item">会员</router-link>
      <router-link to="/my" active-class="active" class="footer_my footer_item">我的</router-link>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goBack(){
      this.$router.go(-1);
      return false;
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

#first {
  margin: 0 auto .torem(50);
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
    float: left;
    img {
      margin: .torem(14) .torem(20) 0;
      .rem(width, 10);
    }
  }
  &_link {
    float: right;
    &.service img {
      .rem(width, 22);
      margin: .torem(14) .torem(20) 0;
    }
  }
}

.footer {
  width: 100%;
  max-width: 768px;
  position: fixed;
  bottom: 0;
  border-top: 1px solid #F5F2F3;
  background-color: white;
  .rem(height, 50);
  display: flex;
  justify-content: space-around;
  &_item {
    display: block;
    .rem(font-size, 12);
    font-family: PingFangSC-Regular;
    color: #666363;
    text-align: center;
    .rem(width, 50);
    .rem(margin-top, 5);
    .rem(padding-top, 26);
    &:hover, &.active {
      color: #D4B577;
    }
  }
  &_index {
    background: url('~assets/images/index@2x.png') no-repeat top center/.torem(24);
    &:hover, &.active {
      background: url('~assets/images/index_hover@2x.png') no-repeat top center/.torem(24);
    }
  }
  &_reco {
    background: url('~assets/images/reco@2x.png') no-repeat top center/.torem(24);
    &:hover, &.active {
      background: url('~assets/images/reco_hover@2x.png') no-repeat top center/.torem(24);
    }
  }
  &_vip {
    background: url('~assets/images/vip@2x.png') no-repeat top center/.torem(24);
    &:hover, &.active {
      background: url('~assets/images/vip_hover@2x.png') no-repeat top center/.torem(24);
    }
  }
  &_my {
    background: url('~assets/images/my@2x.png') no-repeat top center/.torem(24);
    &:hover, &.active {
      background: url('~assets/images/my_hover@2x.png') no-repeat top center/.torem(24);
    }
  }
}
ul {
  list-style: none;
  padding: 0;
}
a {
  text-decoration: none;
  color: #000;
}
</style>