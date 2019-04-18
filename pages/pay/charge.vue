<template>
  <div class="charge">
    <div class="charge_top">
      <p class="charge_top_amount">当前余额</p>
      <p class="charge_top_num">{{balance}}<span>&nbsp;仟仟币</span></p>
    </div>
    <div class="charge_mid">
      <p class="charge_mid_title">充值金额</p>
      <div class="buy_con_card">
        <square-cards @change="cardChange" :itemsData="itemsData"></square-cards>
      </div>
    </div>
    <div class="charge_btm">
      <button @click="submit">确认支付</button>
    </div>
  </div>
</template>
<script>
// 具体store的写法和用法，请参考 ~/pages/detail/video.vue 或者 ~/pages/todo.vue
import store from '~/store/pay'
import squareCards from "~/components/square-cards.vue";
let pingpp = require('pingpp-js');
export default {
  layout: 'sub',
  store,
  head() {
    return {
      title: '充值仟仟币'
    }
  },
  data() {
    return {
      rmb:'',
      ids:'',
      itemsData:[],
      balance:'0'
    }
  },
  computed: {
    foo() { return this.$store.state.foo }
  },
  components: {
    squareCards
  },
  methods: {
    // 确认支付
    async submit() {
      if (this.rmb == '') {
        this.$toast('请先选择充值金额');
        return false;
      }
      this.$router.push('/pay/payment?amount='+this.rmb+'&id='+this.ids)
    },
    async getCharge() {
      let that = this;
      let { data } = await this.$axios.$get('/v1/deposit/packs', {});
      if(data) {
        console.log('获取当前的付款金额')
        let p = [];
        data.map((item, index)=>{
          p.push({
            amount: item.amount,
            id: item.id,
            title: item.volume,
            active: false,
          })
        });
        that.itemsData = p;
      }
    },
    cardChange(val){
      console.log(val.amount)
      this.rmb = val.amount.split('元')[0];
      this.ids = val.id;
    },
    //获取用户信息
    async getUserInfo() {
      let { data } = await this.$axios.$get('/v1/user/info', {});
      if(data) {
        this.balance = data.balance;
      }
    },
  },
  mounted() {
    this.getCharge();
    this.getUserInfo();
  }
}

</script>
<style lang="less" scoped>
.rem(@name, @px) {
  @{name}: unit(@px / 16, rem);
}

@ffd: 'Helvetica Neue', Arial, sans-serif;
@medff: 'PingFangSC-Medium', @ffd;

.charge {
  width: 100%;
  height: 100%;
  padding: 0 unit(20 / 16, rem);
  &_top {
    background: #FFFFFF;
    padding: unit(24 / 16, rem) 0 unit(14 / 16, rem);
    border-bottom: 1px solid #F5F2F3;
    .rem(margin-bottom, 15);
    color: #2D2E2F;
    vertical-align: bottom;
    &_amount {
      text-align: left;
      .rem(margin-bottom, 6);
      font-size: unit(16 / 16, rem);
    }
    &_num {
      font-family: @medff;
      font-size: unit(24 / 16, rem);
      font-weight: 700;
      span{
        font-size: unit(13 / 16, rem);
      }
    }
  }

  &_mid {
    background: #FFFFFF;
    &_title {
      font-family: @medff;
      font-size: unit(16 / 16, rem);
      .rem(margin-bottom, 16);
    }
  }

  &_btm {
    width: 90%;
    margin: unit(24 / 16, rem) auto;
    & button {
      display: block;
      width: 100%;
      color: #6E531D;
      .rem(font-size, 16);
      .rem(padding, 13);
      opacity: .9;
      background: #D4B577;
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
