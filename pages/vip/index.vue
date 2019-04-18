<template>
  <v-refresh class="container" :onRefresh="refresh">
  <v-reload :on-infinite-load="onInfiniteLoad" :parent-pull-up-state="infiniteLoadData.pullUpState">
    <div class="vip">
      <div class="vip_people">
        <p class="vip_people_img"><img src="~/assets/images/viphead.png"></p>
        <p class="vip_people_desc">
          <span v-if="isLogin" class="vip_people_desc_name">{{userName}}</span>
          <span v-if="!isLogin" class="vip_people_desc_name" @click="loginPage">{{userName}}</span>
          <span v-if="!isVip" class="vip_people_desc_detial">{{lastDate}}</span>
          <span v-if="isVip && !isOverTime" class="vip_people_desc_vip">{{lastDate}}</span>
          <span v-if="isVip && isOverTime" class="vip_people_desc_overtime">{{lastDate}}</span>
        </p>
        <p class="vip_people_open">
          <span v-if="isVip" @click="xufei">续费</span>
          <span v-if="!isVip" @click="openmember">开通</span>
        </p>
      </div>
    </div>
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
    <div class="line"></div>
    <program :title="listTitle" :list="list" :list-type="listType" />
  </v-reload>
  </v-refresh>
</template>
<script>
import DropDownRefresh from '~/components/dropDownRefresh'
import PullUpReload from '~/components/pullUpLoad'
import program from '~/components/program'
import slides from '~/components/slides'
import { mapState, mapActions } from 'vuex'

export default {
  layout: 'first',
  // scrollToTop: true,
  data() {
    return {
      isLogin:false,  //判断是否登陆
      isVip: false,   //判断是否会员
      isOverTime: false,  //判断是否过期
      userName:'请点击登录',
      lastDate:'可享受更多优惠权益',
      balance:'',
      title: '会员页',
      listTitle: 'VIP解盘',
      listType: 'list2',
      list: [],
      infiniteLoadData: {
        pullUpState: 1,
        next: '',
      },
    }
  },
  head () {
    return {
      title: this.title
    }
  },
  components: {
    vRefresh: DropDownRefresh,
    vReload: PullUpReload,
    program,
  },
  methods: {
    async getVideos() {
      let { data, next } = await this.$axios.$get('/v1/vip/lecturer/videos', {
        params: { size: 10 }
      });
      if(data) {
        console.log(data);
        data.forEach((item) => {
          if(item.type === 'serials') {
            item.url = `recommend/detail?id=${item.id}`;
          } else {
            item.url = `detail/video/${item.id}`;
          }
        })
        this.list = data;
      }
      if(next) {
        this.infiniteLoadData.next = next;
      } else {
        this.infiniteLoadData.pullUpState = 3
      }
    },
    init() {
      this.getVideos();
    },
    refresh(done) {
      this.init();
      done();
    },
    onInfiniteLoad (done) {
      if (this.infiniteLoadData.pullUpState === 1) {
        this.getPullUpMoreData(done)
      }
    },
    loginPage(){
      this.$router.push('/login');
    },
    openmember(){
      this.$router.push({path: '/my/openmember'})
    },
    xufei(){
      this.$router.push({path: '/pay/charge?balance='+ this.balance})
    },
    async getPullUpMoreData(done) {
      let { data, next } = await this.$axios.$get('/v1/vip/lecturer/videos', {
        params: { size: 10, next: this.infiniteLoadData.next }
      });
      if(!next || next === this.infiniteLoadData.next) {
        this.infiniteLoadData.pullUpState = 3;
        return done();
      } else {
        this.infiniteLoadData.next = next;
      }
      if(data) {
        console.log(data);
        data.forEach((item) => {
          if(item.type === 'serials') {
            item.url = `recommend/detail?id=${item.id}`;
          } else {
            item.url = `detail/video/${item.id}`;
          }
        })
        this.list = this.list.concat(data);
      }
      done();
    },
    //获取用户信息
    async getUserInfo(){
      // 已开通，{{lastDate}}到期
      let that = this;
      await this.$axios.$get('/v1/user/info', {}).then((data) => {
          if(data) {
            that.isLogin = true;
            that.balance = data.data.balance;
            // that.userName = data.data.name ? data.data.name : (data.data.account ? data.data.account.toString().replace(/(\d{3})\d*(\d{4})/,'$1****$2') : '匿名用户');
            that.userName = 'VIP会员'
            if (data.data.vip) {
              that.isVip = true;
              if ((data.data.vip*1000 - Date.now()) < 0) {
                that.lastDate = '已过期'
                that.isOverTime = true;
              }else{
                let ls = Math.ceil((data.data.vip*1000 - Date.now())/1000/60/60/24)
                if (ls <= 30) {
                  that.lastDate = '已开通，还有' + ls + '天到期'
                }else{
                  that.lastDate = data.data.vip ? ('已开通，'+ (new Date(data.data.vip*1000).getFullYear() + '-' + (new Date(data.data.vip*1000).getMonth() + 1) + '-' + new Date(data.data.vip*1000).getDate()) + '到期') : '开通VIP名师视频抢先看';
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
          that.isLogin = false;
        }
      });
    },
  },
  created() {
    this.init();
  },
  mounted(){
    //获取当前登陆信息
    this.getUserInfo();
  },
}
</script>
<style lang="less" scoped>
@import '~assets/styles/index.less';
/*.rem(@name, @px) {
  @{name}: unit(@px / 16, rem);
}

@ffd: 'Helvetica Neue', Arial, sans-serif;
@medff: 'PingFangSC-Medium', @ffd;*/
.vip{
  padding: unit(25 / 16, rem) unit(24 / 16, rem) unit(35 / 16, rem);
  margin: unit(16 / 16, rem) unit(19 / 16, rem) unit(12 / 16, rem);
  background: url('~assets/images/vipbg.png') 0 0 no-repeat;
  background-size: 100% 100%;
  &_people{
    overflow: hidden;
    display: flex;
    &_img{
      .rem(width, 50);
      .rem(height, 50);
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
      &_name{
        display: block;
        .rem(margin-bottom, 5);
        font-size: unit(18/ 16, rem);
        font-family: @medff;
        color: #D4B577;
      }
      &_detial{
        font-size: unit(12 / 16, rem);
        color: #8E8E8E;
        letter-spacing: 0;  
      }
      &_vip{
        color: #D4B577;
      }
      &_overtime{
        color: #8E8E8E;
      }
    }
    &_open{
      .rem(padding-top, 14);
      span{
        display: block;
        .rem(width, 76);
        background: #D4B577;
        text-align: center;
        padding: unit(6/ 16, rem) 0;
        font-family: @medff;
        font-size: unit(14/ 16, rem);
        color: #6E531D;
        line-height: unit(14/ 16, rem);
        border: 1px solid #D4B577;
        border-radius: 4px;
      }
    }
  }
}
.user_benefits{
  padding: .torem(12) .torem(20);
  .rem(font-size, 16);
  font-family: @medff;
  color: #262425;
  &_warp{
    .rem(margin-top, 24);
  }
  &_con{
    display: flex;
    justify-content: space-between;
    list-style: none;
    padding: 0 .torem(20) .torem(16);
    &_item{
      img{
        display: block;
        margin: 0 auto .torem(8);
        .rem(width, 48);
        .rem(width, 48);
      }
      span{
        font-family: @redff;
        .rem(font-size, 14);
        color: #262425;
      }
    }
  }
}
.line {
  .rem(height, 16);
  background: #F7F7F7;
}
</style>