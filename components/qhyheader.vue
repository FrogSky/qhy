/**
 *  @module qhy-header卡片选择金额
 *  @event  提供goBack事件回调
 *  @param  itemsData是props的渲染数据
 *  @description  用于页面中表头展示 参照member/member
 *  @example  
 *  by zhangning 2018-10-21
 */
<template>
  <div class="qhy-header">
    <p class="qhy-header_goback" @click="goBack"><img src='~/assets/images/goback.png'></p>
    <p class="qhy-header_logo"><img src="~/assets/images/logo2x.png"></p>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import store from '~/store/detail/video'
import Vue from 'vue';
export default {
  store,
  props: ['goBackUrl'],
  data() {
    return {
      url:'',
    }
  },
  mounted () {
    if (this.goBackUrl) {
      this.url = this.goBackUrl;
    }else{
      this.url = ''
    }
  },
  methods: {
    goBack(){
      //返回链接地址（待修订）
      console.log(this.url)
    },
  },
  watch:{
    goBackUrl:{
        handler:function(val){  
          this.url = val;
        },  
        deep:true
    },
  }
}
</script>
<style lang="less" scoped>
@var: PingFangSC-Regular, 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
.rem(@name, @px) {
  @{name}: unit(@px / 16, rem);
}
@ffd: 'Helvetica Neue', Arial, sans-serif;
@medff: 'PingFangSC-Medium',@ffd;

/*card组件样式*/
.qhy-header{
  padding: unit(12 / 16, rem) unit(20 / 16, rem);
  overflow: hidden;
  background: #2C2C2C;
  .rem(height, 48);
  &_goback{
    float: left;
    img{
      .rem(margin-top, 2);
      .rem(width, 10);
      .rem(height, 20);
      float: left;
    }
  }
  &_logo{
    img{
      display: block;
      margin: 0 auto;
      .rem(width, 93);
      .rem(height, 24);
    }
  }
}
</style>
