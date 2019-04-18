<template>
  <div class="pay">
    
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
  computed: {
    foo() { return this.$store.state.foo }
  },
  methods: {

  },
  mounted() {
    let that = this;
    setTimeout(()=>{
      // alert('5秒后跳到'+'/pay/payment?amount='+ this.$route.query.amount+'&payChange=1&id='+this.$route.query.id)
      that.$router.push({path: '/pay/payment?amount='+ that.$route.query.amount+'&payChange=1&id='+that.$route.query.id})
    },10)
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
