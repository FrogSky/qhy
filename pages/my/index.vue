/**
 *  @module 会员 ＋ 非会员页面
 *  by zhangning 2018-10-19
 */
<template>
  <div class="user">
    <!-- <qhyheader goBackUrl="www.baidu.com"></qhyheader> -->
    <section class="user_con">
      <!-- 会员名称 -->
      <div class="user_con_people">
        <p class="user_con_people_img"><img src="~/assets/images/viphead.png"></p>
        <p class="user_con_people_desc">
          <span class="user_con_people_desc_title">{{userName}}</span>
          <span class="user_con_people_desc_detial">
            <img v-if="isVip && !isOverTime" src="~/assets/images/member1.png" alt="">
            <img v-if="!isVip || (isVip && isOverTime)" src="~/assets/images/member2.png" alt="">
          </span>
        </p>
        <p class="user_con_people_open">
          <span v-if="isVip" @click="xufei">续费</span>
          <span v-if="!isVip && isLogin" @click="openmember">开通会员</span>
          <span v-if="!isVip && !isLogin" @click="loginon">登录</span>
        </p>
      </div>
    </section>
    <div class="grayline"></div>
    <ul class="user_options">
      <li class="user_options_item">我的账户<span class="balance-span">{{balance}}仟仟币</span></li>
      <li class="user_options_line"></li>
      <li class="user_options_item" @click="myAcount">我的会员<img src="~/assets/images/rightarrow.png" alt="">
        <span v-if="!isVip && !isOverTime" @click="openmember">{{lastDate}}</span>
        <span v-if="isVip && !isOverTime">{{lastDate}}</span>
        <span v-if="isVip && isOverTime" class="user_options_item_overtime">{{lastDate}}</span>
      </li>
      <!-- <li class="user_options_item">我的二维码<img src="~/assets/images/rightarrow.png" alt=""></li>
      <li class="user_options_line"></li>
      <li class="user_options_item">优惠券兑换（学习终端激活）<img src="~/assets/images/rightarrow.png" alt=""></li>
      <div class="grayline"></div>
      <li class="user_options_item">观看记录<img src="~/assets/images/rightarrow.png" alt=""></li>
      <li class="user_options_line"></li>
      <li class="user_options_item">购买记录<img src="~/assets/images/rightarrow.png" alt=""></li> -->
    </ul>
    <div class="grayline"></div>
  </div>
</template>

<script>
// 具体store的写法和用法，请参考 ~/pages/detail/video.vue 或者 ~/pages/todo.vue
import store from '~/store/pay'
import squareCard from "~/components/square-card.vue";
import qhyheader from "~/components/qhyheader.vue";
export default {
  layout: 'first',
  store,
  head () {
    return {
      title: '我的'
    }
  },
  data() {
    return {
      isLogin:false,
      isVip: false,
      isOverTime: false, 
      lastDate:'立即开通',
      mobile:'',
      userName:'未登录',
      balance:'0',
      
      itemsData1:[{
        title:'点播本集',
        amount: '8.00',
        active: false,
      }],
      itemsData2:[{
        title:'3个月',
        amount: '238.00',
        active: false,
      },{
        title:'2个月',
        amount: '78.00',
        active: false,
      },{
        title:'1个月',
        amount: '28.00',
        active: false,
      }],

    }
  },
  computed: {
    foo () { return this.$store.state.foo }
  },
  methods:{
    myAcount(){
      this.$router.push({path: '/my/openmember'})
    },
    cardChange(val){
      console.log(val)
    },
    async getUserInfo(){
      let that = this;
      await this.$axios.$get('/v1/user/info', {}).then((data) => {
          if(data) {
            that.isLogin = true;
            that.userName = data.data.name ? data.data.name : (data.data.account ? data.data.account.toString().replace(/(\d{3})\d*(\d{4})/,'$1****$2') : '匿名用户');
            that.mobile = data.data.account;
            that.balance = data.data.balance;
            // that.lastDate = data.data.vip ? (new Date(data.data.vip*1000).getFullYear() + '-' + (new Date(data.data.vip*1000).getMonth() + 1) + '-' + new Date(data.data.vip*1000).getDate()) : null;
            if (data.data.vip) {
              that.isVip = true;
              if ((data.data.vip*1000 - Date.now()) < 0) {
                that.lastDate = 'VIP会员已过期'
                that.isOverTime = true;
              }else{
                let ls = Math.ceil((data.data.vip*1000 - Date.now())/1000/60/60/24)
                if (ls <= 30) {
                  that.lastDate = '已开通，还有' + ls + '天到期'
                }else{
                  that.lastDate = data.data.vip ? ('已开通，'+ (new Date(data.data.vip*1000).getFullYear() + '-' + (new Date(data.data.vip*1000).getMonth() + 1) + '-' + new Date(data.data.vip*1000).getDate()) + '到期') : '立即开通';
                }
              }
            }else{
              that.isVip = false;
            }

          }
       }).catch(function (result) {
        //处理401
        if (result.response.data.error == "unauthorized") {
          // that.$router.push('/login')
        }
       });
    },
    
    openmember(){
      this.$router.push({path: '/my/openmember'})
    },
    xufei(){
      this.$router.push({path: '/pay/charge?balance='+ this.balance})
    },
    loginon(){
      this.$router.push({path: '/login'})
    },
  },
  mounted () {
    this.getUserInfo();
    // this.getUserDate();
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
          .rem(margin-bottom, 4);
          font-size: unit(18/ 16, rem);
          font-family: @medff;
          /*font-weight: 700;*/
          color: #262425;
        }
        &_detial{
          img{
            display: block;
            margin: 0;
            .rem(width, 68);
            .rem(height, 20);
          }
        }
      }
      &_open{
        .rem(padding-top, 14);
        span{
          display: block;
          .rem(width, 76);
          text-align: center;
          padding: unit(6/ 16, rem) 0;
          font-family: @medff;
          font-size: unit(14/ 16, rem);
          color: #D4B577;
          line-height: unit(14/ 16, rem);
          border: 1px solid #D4B577;
          border-radius: 4px;
        }
      }
    }
  }
  &_options{
    list-style: none;
    padding: unit(5 / 16, rem) 0 0 0;
    &_item{
      padding: unit(15 / 16, rem) unit(20 / 16, rem);
      background: #FFFFFF;
      font-size: 1rem;
      color: #2D2E2F;
      /*background: url('~/member/pages/assets/images/rightarrow.png') right center no-repeat;*/
      img{
        .rem(width, 8);
        .rem(height, 16);
        float: right;
        .rem(margin-top, 3);
        .rem(margin-left, 10);
      }
      span{
        float: right;
        .rem(font-size, 16);
        color: #D4B577;
      }
      .balance-span{
        .rem(margin-right, 18);
      }
      &_overtime{
        color: #8E8E8E!important;
      }
    }
    &_line{
      margin: 0 unit(20 / 16, rem);
      border-top: 1px solid #EAEAEA;
      height: 0;
    }
  }
}
</style>
