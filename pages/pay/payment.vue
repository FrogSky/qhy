<template>
  <div class="pay">
    <div class="pay_top">
      <p class="pay_top_amount">应支付金额</p>
      <p class="pay_top_num">{{this.$route.query.amount}}</p>
    </div>
    <div class="pay_mid">
      <p>收款方</p>
      <p class="pay_mid_company">国广东方网络（北京）有限公司</p>
    </div>
    <div class="pay_btm">
      <button @click="submit">确认支付</button>
    </div>
  </div>
</template>
<script>
// 具体store的写法和用法，请参考 ~/pages/detail/video.vue 或者 ~/pages/todo.vue
import store from '~/store/pay'
let pingpp = require('pingpp-js');

export default {
  store,
  head() {
    return {
      title: '充值支付'
    }
  },
  data () {
    return {
      apiUrl: 'http://qhy.cp59.ott.cibntv.net'
    }
  },
  asyncData({ env }) {
    return {
      apiUrl: env.API
    }
  },
  methods: {
    // 确认支付
    async submit() {
      let that = this;
      await this.$axios.$post('/v1/deposit/pay', {
        amount: that.$route.query.amount,
        channel: "wx_pub",
        packId: that.$route.query.id,
      }).then((response) => {
          //判断openid后跳转
          if (response.error == "openid-required") {
            // that.forError();
            that.forOpenid();
            return false;
          }
          pingpp.createPayment(response.data, function(result, err) {
              window.history.go(-2)
          });
       }).catch(function (result) {
        //判断401后跳转
        if (result.response && result.response.data.error == "unauthorized") {
          that.forError();
        }
       })
    },
    //401处理
    forError(){
      var param = location.pathname + location.search + '&payChange=1';
          param = encodeURIComponent(param);
      window.location.href = '../v1/weixin/authorize?redirect='+param;
      // window.location.href = 'http://qhy.cp59.ott.cibntv.net/v1/weixin/authorize?redirect=' + encodeURIComponent('/h5/pay/payment?payChange=1%26amount=' + this.$route.query.amount + '%26id=' + this.$route.query.id);
    },
    //401处理
    forOpenid(){
      var param = location.pathname + location.search + '&payChange=1';
          param = encodeURIComponent(param);
      window.location.href = '../v1/weixin/authorize?redirect='+param;
    }
  },
  mounted() {
    //如果forError返回授权成功，直接执行付款操作
    if (this.$route.query.payChange == 1) {
      // alert('支付')
      this.submit();
    }
  }
}
</script>
<style lang="less" scoped>
.rem(@name, @px) {
  @{name}: unit(@px / 16, rem);
}

@ffd: 'Helvetica Neue', Arial, sans-serif;
@medff: 'PingFangSC-Medium', @ffd;

.pay {
  width: 100%;
  height: 100%;
  background: #F7F7F7;

  &_top {
    background: #FFFFFF;
    .rem(padding, 40);
    .rem(margin-bottom, 16);

    &_amount {
      text-align: center;
      .rem(margin-bottom, 10);
    }

    &_num {
      text-align: center;
      font-family: @medff;
      font-size: unit(36 / 16, rem);
      font-weight: 500;
    }
  }

  &_mid {
    display: flex;
    justify-content: space-between;
    .rem(padding, 20);
    background: #FFFFFF;

    &_company {
      font-family: @medff;
    }
  }

  &_btm {
    width: 90%;
    margin: unit(30 / 16, rem) auto unit(358 / 16, rem);

    & button {
      display: block;
      width: 100%;
      color: #FFFFFF;
      .rem(font-size, 16);
      .rem(padding, 13);
      opacity: .9;
      background: #19AD19;
      border-radius: 4px;
      text-align: center;
      border: 0;

      &:disabled {
        opacity: .5;
      }
    }
  }
}

button:focus {
  outline: none;
}

</style>
