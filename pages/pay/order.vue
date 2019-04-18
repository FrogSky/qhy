/**
 *  @module 节目详情、购买、订阅页面
 *  by zhangning 2018-10-16
 */
<template>
  <div class="buy">
    <section class="buy_con">
      <!-- 人物头像 -->
      <div class="buy_con_people">
        <p v-if="pageType == 'teacher'" class="buy_con_people_img"><img :src="datas.cover"></p>
        <p v-if="pageType == 'teacVideo'" class="buy_con_people_img"><img :src="datas.cover"></p>
        <p v-if="pageType == 'videos'" class="buy_con_people_img1"><img :src="datas.banner"></p>

        <p class="buy_con_people_desc">
          <span class="buy_con_people_desc_title">{{datas.name}}</span>
          <span class="buy_con_people_desc_detial">{{datas.desc}}</span>
        </p>
      </div>

      <!-- 分割线(margin-bottom24) -->
      <div v-if="pageType == 'teacVideo' || pageType == 'videos'" class="buy_con_line"></div>
      <!-- 点播本集 -->
      <div v-if="pageType == 'teacVideo' || pageType == 'videos'" class="buy_con_card">
        <square-card @change="cardChangea" :itemsData="itemsData1" primary></square-card>
      </div>
      <!-- 文字描述 -->
      <div v-if="pageType == 'teacVideo' || pageType == 'videos'" class="buy_con_desc">选择以下更多时长，可在服务期间内畅看此名师的所有课程内容</div>

      <!-- 分割线(正常上下16) -->
      <div v-if="pageType == 'teacher'" class="buy_con_line16"></div>
      <!-- 订阅购买卡片 -->
      <div class="buy_con_card">
        <square-card @change="cardChangeb" :itemsData="itemsData2"></square-card>
      </div>
    </section>

    <div class="balance">
      余额 &nbsp;<span class="balance-mid">{{balance}}仟仟币</span> <span v-if="notEnougtMoney" class="balance-right">余额不足</span>
    </div>
    <footer>
      <button v-if="!notEnougtMoney" @click="submit">确认支付</button>
      <button v-if="notEnougtMoney" @click="charge">立即充值</button>
    </footer>
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
      title: '订阅名师收银台'
    }
  },
  data() {
    return {
      pageType:'',
      //没有足够的钱
      notEnougtMoney: false,
      balance:'0',//余额
      paymentPrice:'',
      plan:'',
      expiredAt:'',
      datas:{
        banner: '',
        cover: '',
        desc: '',
        iapPrice: '',
        id: '',
        name: '',
        price: '',
      },
      itemsData1:[],
      itemsData2:[],
      teacherId:'',
      vedioId:'',
    }
  },
  computed: {
    foo () { return this.$store.state.foo }
  },
  mounted () {
    this.pageType = this.$route.query.pageType ;
    if (this.pageType == 'teacher') {
      this.getTeacher();
      this.getTeacher1();
    }
    if (this.pageType == 'teacVideo') {
      this.getTeacVideo();
      this.getTeacVideo1();
    }
    if (this.pageType == 'videos') {
      this.videos();
      this.videos1();
    }
    this.getUserInfo();
    
  },
  methods:{
    //获取老师详情
    async getTeacher() {
      let { data } = await this.$axios.$get('/v1/lecturer/'+this.$route.query.id, {});
      if(data) {
        this.datas = {
          banner: data.banner,
          cover: data.cover,
          desc: data.desc,
          iapPrice: data.iapPrice,
          id: data.id,
          name: data.name,
          price: data.price,
        }
      }
    },
    //获取名师价格
    async getTeacher1() {
      // teacher 27
      let { data } = await this.$axios.$get('/v1/lecturer/'+this.$route.query.id+'/subscribe', {});
      if(data) {
        this.expiredAt = data.expiredAt;
        this.itemsData2=[{
          amount:data.price.month,
          plan:'month',
          title:'1个月',
          active: false,
          unit:'仟仟币',
        },{
          amount:data.price.quarter,
          plan:'quarter',
          title:'3个月',
          active: false,
          unit:'仟仟币',
        },{
          amount:data.price.year,
          plan:'year',
          title:'12个月',
          active: false,
          unit:'仟仟币',
        },]
      }
    },
    //点播名师视频

    //获取课程信息
    async getTeacVideo() {
      //teacVideo 5412
      let { data } = await this.$axios.$get('/v1/video/'+this.$route.query.id, {});
      if(data) {
        this.teacherId = data.lecturer.id; //订阅的是老师
        this.datas = {
          cover: data.lecturer.cover,
          desc: data.lecturer.desc,
          iapPrice: data.lecturer.iapPrice,
          id: data.lecturer.id,
          name: data.lecturer.name,
          price: data.lecturer.price,
        }
      }
    },
    //获取名师课程价格
    async getTeacVideo1() {
      //teacVideo 5412
      let { data } = await this.$axios.$get('/v1/video/'+this.$route.query.id+'/purchase', {});
      // let { data } = await this.$axios.$get('/v1/serials/'+this.$route.query.id+'/subscribe', {});
      if(data) {
        console.log('getTeacVideo1:')
        console.log(data)
        this.expiredAt = data.expiredAt;

        this.itemsData1=[{
          amount:data.price.single,
          plan:'single',
          title:'点播本集',
          active: false,
          unit:'仟仟币'
        }]
        this.itemsData2=[{
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
        }];
        if (data.price.year) {
          this.itemsData2.push({
            amount:data.price.year,
            plan:'year',
            title:'12个月',
            active: false,
            unit:'仟仟币'
          });
        }
      }
    },

    //获取视频的链接
    async videos() {
      //videos 5566
      let { data } = await this.$axios.$get('/v1/video/'+this.$route.query.id, {});
      if(data) {
        this.vedioId = data.serials ? data.serials.id : data.lecturer.id;
        this.datas = {
          banner: data.cover,
          name: data.title,
          // iapPrice: data.iapPrice,
          id: data.id,
          // name: data.name,
          price: data.price,
        }
      }
    },
    //获取频的链接价格
    async videos1() {
      //videos 5566
      // http://qhy.cp59.ott.cibntv.net/v1/video/5587/purchase?id=5587
      let { data } = await this.$axios.$get('/v1/video/'+this.$route.query.id+'/purchase', {});
      if(data) {
        this.expiredAt = data.expiredAt;
        this.itemsData1=[{
          amount:data.price.single,
          plan:'single',
          title:'点播本集',
          active: false,
          unit:'仟仟币'
        }]
        this.itemsData2=[{
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
        }]
        if (data.price.year) {
          this.itemsData2.push({
            amount:data.price.year,
            plan:'year',
            title:'12个月',
            active: false,
            unit:'仟仟币'
          })
        }
      }
    },
    //选择卡片
    cardChangea(val){
      console.log(val)
      this.paymentPrice = val.amount;
      this.plan = val.plan;
      if (parseInt(val.amount) > parseInt(this.balance)) {
        this.notEnougtMoney = true;
      }else{
        this.notEnougtMoney = false;
      }
      this.itemsData2.map((item,index)=>{
        item.active = false;
      })
    },
    //选择卡片
    cardChangeb(val){
      console.log(val)
      this.paymentPrice = val.amount;
      this.plan = val.plan;
      if (parseInt(val.amount) > parseInt(this.balance)) {
        this.notEnougtMoney = true;
      }else{
        this.notEnougtMoney = false;
      }
      this.itemsData1.map((item,index)=>{
        item.active = false;
      })
    },
    //提交支付页面流程
    async submit() {
      let that = this;
      //teacVideo 5412

      if (this.pageType == 'teacher') {
          await this.$axios.$post('/v1/lecturer/'+this.$route.query.id+'/subscribe', {
            "expiredAt": this.expiredAt?this.expiredAt:null,
            "plan": this.plan,
            "price": this.paymentPrice,
          }).then((response) => {
            console.log('请求成功')
             // this.$toast(response)
             this.$toast("支付成功！")
             if (response.error == 'duplicate-purchased') {
              this.$toast("您已订阅此服务")
            }else{
              setTimeout(()=>{
                // window.history.go(-1)
                that.$router.go(-1)
                // this.$router.push('/pay/payment?amoun?'+that.$route.query.id)
              },500)
            }
         }).catch(function (result) { //捕捉错误处理 
            if (result.response.status == 401) {}
          }); 
      }
      if (this.pageType == 'teacVideo') {
        //单点时候传视频id
        if (this.plan == 'single') {
            await this.$axios.$post('/v1/video/'+this.$route.query.id+'/purchase', {
              "expiredAt": this.expiredAt?this.expiredAt:null,
              "plan": this.plan,
              "price": this.paymentPrice,
            }).then((response) => {
              console.log('请求成功')
              this.$toast("支付成功！")
              if (response.error == 'duplicate-purchased') {
                this.$toast("您已订阅此服务")
              }else{
                setTimeout(()=>{
                  // window.history.go(-1)
                  that.$router.go(-1)
                  // this.$router.push('/pay/payment?amoun?'+that.$route.query.id)
                },500)
              }
            }).catch(function (result) { //捕捉错误处理  
              // console.log(result); 
              if (result.response.status == 401) {
                // that.loginWx()
              }
            }); 
        }else{
        //非单点时候传老师id
          await this.$axios.$post('/v1/lecturer/'+this.teacherId+'/subscribe', {
            "expiredAt": this.expiredAt?this.expiredAt:null,
            "plan": this.plan,
            "price": this.paymentPrice,
          }).then((response) => {
            console.log('请求成功')
            this.$toast("支付成功！")
            if (response.error == 'duplicate-purchased') {
              this.$toast("您已订阅此服务")
            }else{
              setTimeout(()=>{
                // window.history.go(-1)
                that.$router.go(-1)
                // this.$router.push('/pay/payment?amoun?'+that.$route.query.id)
              },500)
            }
          }).catch(function (result) { //捕捉错误处理  
            // console.log(result); 
            if (result.response.status == 401) {
              // that.loginWx()
            }
          }); 
        }
      }
      if (this.pageType == 'videos') {

        //单点时候传视频id
        if (this.plan == 'single') {
            await this.$axios.$post('/v1/video/'+this.$route.query.id+'/purchase', {
              "expiredAt": this.expiredAt?this.expiredAt:null,
              "plan": this.plan,
              "price": this.paymentPrice,
            }).then((response) => {
              console.log('请求成功')
              this.$toast("支付成功！")
              if (response.error == 'duplicate-purchased') {
                this.$toast("您已订阅此服务")
              }else{
                setTimeout(()=>{
                  // window.history.go(-1)
                  that.$router.go(-1)
                  // this.$router.push('/pay/payment?amoun?'+that.$route.query.id)
                },500)
              }
            }).catch(function (result) { //捕捉错误处理  
              // console.log(result); 
              if (result.response.status == 401) {
                // that.loginWx()
              }
            }); 
        }else{
        //非单点时候传老师id
          await this.$axios.$post('/v1/serials/'+this.vedioId+'/subscribe', {
            "expiredAt": this.expiredAt?this.expiredAt:null,
            "plan": this.plan,
            "price": this.paymentPrice,
          }).then((response) => {
            console.log('请求成功')
            this.$toast("支付成功！")
            if (response.error == 'duplicate-purchased') {
              this.$toast("您已订阅此服务")
            }else{
              setTimeout(()=>{
                // window.history.go(-1)
                that.$router.go(-1)
                // this.$router.push('/pay/payment?amoun?'+that.$route.query.id)
              },500)
            }
          }).catch(function (result) { //捕捉错误处理  
            // console.log(result); 
            // if (result.response.status == 401) {
            //   // that.loginWx()
            // }
          }); 
        };
      }
    },
    charge(){
      this.$router.push({path: '/pay/charge?balance='+ this.balance})
    },
    //获取用户信息
    async getUserInfo(){
      let that = this;
      await this.$axios.$get('/v1/user/info', {}).then((data) => {
          if(data) {
            this.balance = data.data.balance;
          }
       }).catch(function (result) {
        //处理401
        if (result.response.data.error == "unauthorized") {
          that.$router.push('/login')
        }
      });
    },
  },
  components: {
    squareCard,
    qhyheader
  }
}
</script>

<style lang="less" scoped>
@import '~assets/styles/index.less';

.buy{
  header{
    text-align: center;
    background: #2C2C2C;
    color: #FFFFFF;
    .rem(height, 48);
  }
  &_con{
    padding: unit(24 / 16, rem) unit(20 / 16, rem);
    /*人物头像*/
    &_people{
      overflow: hidden;
      display: flex;
      &_img{
        .rem(width, 64);
        .rem(height, 84);
        /*float: left;*/
        img{
          float: left;
          outline: none;
          width: 100%;
          height: 100%;
        }
      }
      &_img1{
        .rem(width, 115);
        .rem(height, 64);
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
        &_title{
          display: block;
          .rem(margin-bottom, 10);
          font-size: unit(18 / 16, rem);
          font-family: @medff;
          font-weight: 700;
          color: #262425;
        }
        &_detial{
          font-size: unit(14 / 16, rem);
          color: #262425;
          letter-spacing: 0; 
          .ellipsis(3);
        }
      }
    }
    /*分割线*/
    &_line{
      margin: unit(16 / 16, rem) 0 unit(24 / 16, rem);
      border-top: 1px solid #EAEAEA;
    }
    /*分割线*/
    &_line16{
      margin: unit(16 / 16, rem) 0;
      border-top: 1px solid #EAEAEA;
    }
    /*订阅购买card*/
    &_desc{
      margin: unit(16 / 16, rem) 0;
      font-size: unit(14 / 16, rem);
      color: #262425;
    }
    
  }
  footer{
    width: 90%;
    margin: unit(30 / 16, rem) auto unit(358 / 16, rem);
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
.balance{
  padding: unit(13 / 16, rem) unit(20 / 16, rem);
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
</style>
