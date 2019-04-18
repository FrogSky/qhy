/**
 *  @module 开通会员页面
 *  by zhangning 2018-10-31
 */
<template>
  <div class="user">
    <section class="user_con">
      <!-- 人物头像 -->
      <div class="user_con_people">
        <p class="user_con_people_img"><img src="~/assets/images/head.png"></p>
        <p class="user_con_people_desc">
          <span class="user_con_people_desc_title">{{userName}}</span>
          <span v-if="lastDate" class="user_con_people_desc_detial">{{lastDate}}到期</span>
        </p>
      </div>
      <!-- 分割线(margin-bottom24) -->
      <div class="user_con_line"></div>

      <h4 class="user_con_title">VIP会员</h4>
      <!-- 订阅购买卡片 -->
      <div class="user_con_card">
        <square-card @change="cardChange" :itemsData="itemsData"></square-card>
      </div>
      <div class="balance">
        余额 &nbsp;<span class="balance-mid">{{balance}}仟仟币</span> <span v-if="notEnougtMoney" class="balance-right">余额不足</span>
      </div>
      <!-- 支付按钮 -->
      <div class="footerpay">
        <button v-if="!notEnougtMoney" @click="submit">确认支付</button>
        <button v-if="notEnougtMoney" @click="charge">立即充值</button>
      </div>
      <!-- 文字描述 -->
      <div class="footerpay_desc">VIP会员不包含“金钱爆”“赢在起跑点”节目，需另行购买</div>
    </section>
    <div class="grayline"></div>
    <div class="user_benefits">
      <h4 class="user_con_title">VIP会员权益</h4>
      <div class="user_benefits_warp">
        <ul class="user_benefits_con">
        <li class="user_benefits_con_item">
          <img src="~/assets/images/openmember1.png" alt="">
          <span>全站名师</span>
        </li>
        <li class="user_benefits_con_item">
          <img src="~/assets/images/openmember2.png" alt="">
          <span>全站节目</span>
        </li>
        <li class="user_benefits_con_item">
          <img src="~/assets/images/openmember3.png" alt="">
          <span>跳过广告</span>
        </li>
      </ul>
      <ul class="user_benefits_con">
        <li class="user_benefits_con_item">
          <img src="~/assets/images/openmember4.png" alt="">
          <span>高清画质</span>
        </li>
        <li class="user_benefits_con_item">
          <img src="~/assets/images/openmember5.png" alt="">
          <span>预约优先</span>
        </li>
        <li class="user_benefits_con_item">
          <img src="~/assets/images/openmember6.png" alt="">
          <span>续费9.5折</span>
        </li>
      </ul>
      </div>
    </div>
  </div>
</template>

<script>
// 具体store的写法和用法，请参考 ~/pages/detail/video.vue 或者 ~/pages/todo.vue
import store from '~/store/pay'
import squareCard from "~/components/square-card.vue";
import qhyheader from "~/components/qhyheader.vue";
export default {
  layout: 'sub',
  store,
  head () {
    return {
      title: '会员收银台'
    }
  },
  data() {
    return {
      mobile:'',
      notEnougtMoney: false,
      balance:'0',//余额
      paymentPrice:'',
      plan:'',
      name:'',
      lastDate:'',
      userName:'',

      amount:'',
      itemsData:[],
      expiredAt: null,
    }
  },
  computed: {
    foo () { return this.$store.state.foo }
  },
  methods:{
    cardChange(val){
      console.log(val)
      this.paymentPrice = val.amount;
      this.plan = val.plan;
      if (parseInt(val.amount) > parseInt(this.balance)) {
        this.notEnougtMoney = true;
      }else{
        this.notEnougtMoney = false;
      }
    },
    //获取用户信息
    // async getUserInfo() {
    //   let { data } = await this.$axios.$get('/v1/user/info', {});
    //   if(data) {
    //     this.balance = data.balance;
    //     this.userName = data.name ? data.name : '昵称';
    //     this.mobile = data.account;
    //     this.lastDate = data.vip ? (new Date(data.vip).getFullYear() + '-' + (new Date(data.vip).getMonth() + 1) + '-' + new Date(data.vip).getDate()) : null;
    //     // this.getUserDate();
    //   }
    // },
    //获取用户信息
    async getUserInfo(){
      let that = this;
      await this.$axios.$get('/v1/user/info', {}).then((data) => {
        // alert(data)
        // alert(data.data.name)
          if(data) {
            that.balance = data.data.balance;
            that.userName = data.data.name ? data.data.name : (data.data.account ? data.data.account.toString().replace(/(\d{3})\d*(\d{4})/,'$1****$2') : '匿名用户');
            that.mobile = data.data.account;
            that.lastDate = data.data.vip ? (new Date(data.data.vip*1000).getFullYear() + '-' + (new Date(data.data.vip*1000).getMonth() + 1) + '-' + new Date(data.data.vip*1000).getDate()) : null;
          }
       }).catch(function (result) {
        //处理401
        if (result.response.data.error == "unauthorized") {
          that.$router.push('/login')
        }
      });
    },
    
    //获取老师详情
    async openMem() {
      let { data } = await this.$axios.$get('/v1/vip/subscribe', {});
      if(data) {
        this.expiredAt = data.expiredAt ? data.expiredAt : null
        this.itemsData=[{
            amount:data.price.month,
            plan:'month',
            title:'1个月',
            active: false,
            unit:'仟仟币'
          },{
            amount:data.price.quarter,
            plan:'quarter',
            title:'3个月',
            active: false,
            unit:'仟仟币'
          },{
            amount:data.price.year,
            plan:'year',
            title:'12个月',
            active: false,
            unit:'仟仟币'
          }]
      }
    },
    async submit(){
      let { data } = await this.$axios.$post('/v1/vip/subscribe', {
        "expiredAt": this.expiredAt,
        "plan": this.plan,
        "price": this.paymentPrice,
      });
      if(data) {
        this.$toast("支付成功！")
        setTimeout(()=>{
          window.history.go(-1)
        },600)
      }
    },
    charge(){
      this.$router.push({path: '/pay/charge?balance='+ this.balance})
    },
  },
  mounted () {
    console.log(this.foo);
    this.openMem();
    this.getUserInfo();
  },
  components: {
    squareCard,
    qhyheader
  }
}
</script>

<style lang="less" scoped>
.rem(@name, @px) {
  @{name}: unit(@px / 16, rem);
}
@ffd: 'Helvetica Neue', Arial, sans-serif;
@medff: 'PingFangSC-Medium',@ffd;
.user{
  header{
    text-align: center;
    background: #2C2C2C;
    color: #FFFFFF;
    .rem(height, 48);
  }
  .grayline{
    .rem(height, 16);
    background: #F7F7F7;
  }
  &_con{
    padding: unit(24 / 16, rem) unit(20 / 16, rem);
    /*人物头像*/
    &_people{
      overflow: hidden;
      display: flex;
      &_img{
        .rem(width, 50);
        .rem(height, 50);
        /*float: left;*/
        img{
          float: left;
          outline: none;
          width: 100%;
          height: 100%;
        }
      }
      &_desc{
        flex: 1;
        .rem(margin-left, 15);
        .rem(padding-top, 2);
        &_title{
          display: block;
          .rem(margin-bottom, 6);
          font-size: unit(18/ 16, rem);
          font-family: @medff;
          /*font-weight: 700;*/
          color: #262425;
        }
        &_detial{
          font-size: unit(12 / 16, rem);
          color: #666363;
          letter-spacing: 0;  
        }
      }
    }
    /*分割线*/
    &_line{
      margin: unit(24 / 16, rem) 0 unit(24 / 16, rem);
      border-top: 1px solid #EAEAEA;
    }
    /*分割线*/
    &_line16{
      margin: unit(16 / 16, rem) 0;
      border-top: 1px solid #EAEAEA;
    }
    
    &_card{
      .rem(margin-top, 20);
      .rem(margin-bottom, 40);
    }
  }
  .footerpay{
    width: 90%;
    margin: 0 auto unit(14 / 16, rem);
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
  /*订阅购买card*/
  .footerpay_desc{
    margin: unit(16 / 16, rem) 0 0;
    font-size: unit(12 / 16, rem);
    color: #262425;
    text-align: center;
  }
  .user_con_title{
    font-size: unit(16/ 16, rem);
  }
  .user_benefits{
    padding: unit(12 / 16, rem) unit(20 / 16, rem);
    &_warp{
      .rem(margin-top, 24);
    }
    &_con{
      display: flex;
      justify-content:space-between;
      list-style: none;
      padding: 0 unit(20 / 16, rem) unit(16 / 16, rem);
      &_item{
        img{
          display: block;
          margin: 0 auto unit(8 / 16, rem);
          .rem(width, 48);
          .rem(width, 48);
        }
        span{
          font-size: unit(14/ 16, rem);
        }
      }
    }
  }
}
.balance{
  padding: unit(16 / 16, rem) 0;
  margin: unit(23 / 16, rem) 0 unit(30 / 16, rem);
  border-top: 1px solid #EAEAEA;
  border-bottom: 1px solid #EAEAEA;
  .rem(font-size, 14);
  color: #262425;
}
.balance-right{
  float: right;
  color: #FF3C54;
}
.balance-mid{
  color: #666363;
}
button:focus {
  outline: none;
}
</style>
