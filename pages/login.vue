<template>
  <div class="login">
    <div class="login_header">
      <img src="~/assets/images/login_logo.png" alt="">
    </div>
    <div class="login_box">
      <ul class="login_list">
        <li class="login_list_item">
          <div class="login_list_control">
            <input
              v-model="mobile"
              ref="mobile"
              type="tel"
              placeholder="请输入手机号码"
              class="login_input_require login_input_mobile"
              @input="showMobileClearIcon = !!mobile"
              @focus="showMobileClearIcon = !!mobile"
              @blur="showMobileClearIcon = false"
            >
            <i
              class="login_icon_clear"
              @click="clearMobile"
              :class="{hidden: !showMobileClearIcon}"
            ></i>
          </div>
        </li>
        <li class="login_list_item">
          <div class="login_list_control">
            <input
              v-model="code"
              ref="code"
              type="tel"
              placeholder="请输入手机验证码"
              class="login_input_require login_input_code"
              @input="showCodeClearIcon = !!code"
              @focus="showCodeClearIcon = !!code"
              @blur="showCodeClearIcon = false"
            >
            <i
              class="login_icon_clear"
              @click="clearCode"
              :class="{hidden: !showCodeClearIcon}"
            ></i>
          </div>
          <div class="veri_code">
            <button
              key="isSending"
              disabled
              v-if="isSendingVeriCode"
            >{{ curSec }}秒后重新发送</button>
            <button
              key="getCode"
              :disabled="!veriCodeAble"
              @click="getVeriCode"
              v-else
            >获取验证码</button>
          </div>
        </li>
      </ul>
      <div class="login_box_button">
        <button
          :disabled="!isAvailable"
          @click="login"
        >登录</button>
      </div>
    </div>
    <div id="captcha"></div>
  </div>
</template>

<script>
export default {
  head () {
    return {
      title: '登录'
    }
  },
  data() {
    return {
      mobile: '', //'13800138000'
      code: '', // 'debug'
      showMobileClearIcon: false,
      showCodeClearIcon:false,
      isSendingVeriCode: false,
      curSec: 60,
      // isAvailable: false,
    }
  },
  computed: {
    isAvailable() {
      return !!(this.mobile && this.code);
    },
    veriCodeAble() {
      return !!this.mobile;
    }
  },
  methods: {
    async login() {
      if(this.checkMobile(this.mobile)) {
        let result = await this.$axios.$post('/v1/passport/sms/login', {
          code: this.code,//'debug'为测试用！！！
          mobile: this.mobile
        });
        if(result.success) {
          this.$toast('登录成功，准备跳转...');
          //继续其他操作，如
          setTimeout(() => { this.$router.go(-1) }, 1000);
        } else if(result.error === 'sms-code-invalid'){
          this.$toast('验证码错误，请重新输入');
        } else {
          this.$toast('噢哦，好像出错了，请重新试一下吧');
        }
      } else {
        this.$toast('请输入正确的手机号');
      }
    },
    clearMobile() {
      this.mobile = '';
      this.showMobileClearIcon = false;
      this.$refs.mobile.focus();
    },
    clearCode() {
      this.code = '';
      this.showCodeClearIcon = false;
      this.$refs.code.focus();
    },
    getVeriCode() {
      if(this.checkMobile(this.mobile)){
        //发送验证码并倒计时
        this.sendVeriCode(getNVCVal());
      } else {
        this.$toast('请输入正确的手机号');
      }
    },
    checkMobile(num) {
      let mobileReg = /^1\d{10}$/;
      return mobileReg.test(num);
    },
    async checkManMachine(data) {
      // return this.yourRegisterRequest('http://cf.aliyun.com/nvc/nvcAnalyze.jsonp', 'a=' + getNVCVal());//测试专用！！！
      // var result = await this.$axios.$get(`/v1/passport/sms/check/afs?a=${data}`);
      // console.log(result);
      // if(result.success) {//验证通过
      //   this.$toast('正在发送验证码...');
      //   this.sendVeriCode(this.startTimer);
      //   // 储存result.data到store
      // } else if(result.code == 400) {//唤醒滑动验证
      //   this.$toast('请进行滑动验证');
      //   getNC().then(function(){
      //     NoCaptcha.upLang('cn', {
      //       'LOADING':'加载中...',//加载
      //       'SLIDER_LABEL': '请向右滑动验证',//等待滑动
      //       'CHECK_Y':'验证通过',//通过
      //       'ERROR_TITLE':'非常抱歉，这出错了...',//拦截
      //       'CHECK_N':'验证未通过', //准备唤醒二次验证
      //       'OVERLAY_INFORM':'经检测你当前操作环境存在风险，请输入验证码',//二次验证
      //       'TIPS_TITLE':'验证码错误，请重新输入'//验证码输错时的提示
      //     });
      //     _nvc_nc.reset();
      //   })
      // } else if (result.code == 600) {//唤醒刮刮卡
      //   this.$toast('请通过刮刮卡进行验证');
      //   getSC().then(function(){});
      // } else if (result.code == 800 || result.code == 900) {//直接拦截
      //   this.$toast('不好意思，你被直接拦截了');
      // } else {// 发生未知错误
      //   console.log('验证发生未知错误');
      // }
    },
    async sendVeriCode(data) {
      let result = await this.$axios.$post('/v1/passport/sms/send', {
        afs: { data: data },
        mobile: this.mobile
      })
      if(result.success) {//验证通过
        this.$toast('正在发送验证码...');
        this.startTimer();
        // 储存result.data到store
      } else if(result.code == 400) {//唤醒滑动验证
        this.$toast('请进行滑动验证');
        getNC().then(function(){
          NoCaptcha.upLang('cn', {
            'LOADING':'加载中...',//加载
            'SLIDER_LABEL': '请向右滑动验证',//等待滑动
            'CHECK_Y':'验证通过',//通过
            'ERROR_TITLE':'非常抱歉，这出错了...',//拦截
            'CHECK_N':'验证未通过', //准备唤醒二次验证
            'OVERLAY_INFORM':'经检测你当前操作环境存在风险，请输入验证码',//二次验证
            'TIPS_TITLE':'验证码错误，请重新输入'//验证码输错时的提示
          });
          _nvc_nc.reset();
        })
      } else if (result.code == 600) {//唤醒刮刮卡
        this.$toast('请通过刮刮卡进行验证');
        getSC().then(function(){});
      } else if (result.code == 800 || result.code == 900) {//直接拦截
        this.$toast('不好意思，你被直接拦截了');
      } else {// 发生未知错误
        console.log('验证发生未知错误');
      }
    },
    startTimer() {
      this.isSendingVeriCode = true;
      let self = this;
      setTimeout(function countSec(){
        if(self.curSec <= 0 ) {
          self.isSendingVeriCode = false;
          self.curSec = 60;
        } else {
          self.curSec--;
          setTimeout(countSec, 1000);
        }
      }, 1000);
    },
    setUrl() {
      return '//g.alicdn.com/sd/nvc/1.1.112/guide.js?t=' + new Date().toLocaleDateString().replace(/-|\//g,'') + new Date().toTimeString().split(':')[0];//阿里云无痕验证文档建议js后边增加时间戳
    },
  },
  mounted() {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = this.setUrl();
    document.body.appendChild(script);

    let self = this;
    window.NVC_Opt = {
      //无痕配置 && 滑动验证、刮刮卡通用配置
      appkey: 'FFFF00000000017AF223',//TODO：'FFFF00000000017AF223'为正式用，'CF_APP_1'为测试用
      scene: 'nvc_register',
      isH5: true,
      popUp: false,
      renderTo: '#captcha',
      trans: {'key1': 'code0', 'nvcCode': 600},
      nvcCallback(data) {
        self.sendVeriCode(data);
        // data为getNVCVal()的值，此函数为二次验证滑动或者刮刮卡通过后的回调函数
        // data跟业务请求一起上传，由后端请求AnalyzeNvc接口，接口会返回100或者900
      },
      language: 'cn',
      //滑动验证长度配置
      customWidth: 300,
      //刮刮卡配置项
      width: 300,
      height: 100,
      elements: [
        '//img.alicdn.com/tfs/TB17cwllsLJ8KJjy0FnXXcFDpXa-50-74.png',
        '//img.alicdn.com/tfs/TB17cwllsLJ8KJjy0FnXXcFDpXa-50-74.png'
      ], 
      bg_back_prepared: '//img.alicdn.com/tps/TB1skE5SFXXXXb3XXXXXXXXXXXX-100-80.png',
      bg_front: 'data: image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABQCAMAAADY1yDdAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAADUExURefk5w+ruswAAAAfSURBVFjD7cExAQAAAMKg9U9tCU+gAAAAAAAAAIC3AR+QAAFPlUGoAAAAAElFTkSuQmCC',
      obj_ok: '//img.alicdn.com/tfs/TB1rmyTltfJ8KJjy0FeXXXKEXXa-50-74.png',
      bg_back_pass: '//img.alicdn.com/tfs/TB1KDxCSVXXXXasXFXXXXXXXXXX-100-80.png',
      obj_error: '//img.alicdn.com/tfs/TB1q9yTltfJ8KJjy0FeXXXKEXXa-50-74.png',
      bg_back_fail: '//img.alicdn.com/tfs/TB1w2oOSFXXXXb4XpXXXXXXXXXX-100-80.png',
      upLang: {'cn': {
        _ggk_guide: '请在屏幕上滑动，刮出两面盾牌',
        _ggk_success: '恭喜您成功刮出盾牌<br/>继续下一步操作吧',
        _ggk_loading: '加载中',
        _ggk_fail: ['呀，盾牌不见了<br/>请', 'javascript: NoCaptcha.reset()', '再来一次', '或', 'http: //survey.taobao.com/survey/QgzQDdDd?token=%TOKEN', '反馈问题'],
        _ggk_action_timeout: ['我等得太久啦<br/>请', 'javascript: NoCaptcha.reset()', '再来一次', '或', 'http: //survey.taobao.com/survey/QgzQDdDd?token=%TOKEN', '反馈问题'],
        _ggk_net_err: ['网络实在不给力<br/>请', 'javascript: NoCaptcha.reset()', '再来一次', '或', 'http: //survey.taobao.com/survey/QgzQDdDd?token=%TOKEN', '反馈问题'],
        _ggk_too_fast: ['您刮得太快啦<br/>请', 'javascript: NoCaptcha.reset()', '再来一次', '或', 'http: //survey.taobao.com/survey/QgzQDdDd?token=%TOKEN', '反馈问题']
        }
      }
    };
  }
}
</script>

<style lang="less" scoped>
@import "~assets/styles/index.less";

.login {
  width: 100%;
  height: 100vh;
  background-color: #fff;
  &_header {
    .rem(padding-top, 60);
    img {
      display: block;
      margin: 0 auto;
      .rem(width, 200);
      height: auto;
    }
  }
  &_box {
    .rem(padding-top,44);
    &_button {
      width: 82%;
      margin: 70/16rem auto 0;
      button {
        display: block;
        width: 100%;
        color: #fff;
        font-family: @redff;
        .rem(font-size, 16);
        .rem(padding, 13);
        opacity: .9;
        background: #FF3C54;
        border-radius: 4px;
        text-align: center;
        border: 0;
        &:disabled {
          opacity: .5;
        }
      }
    }
  }
  &_list {
    padding: 0;
    margin: 0 auto;
    list-style: none;
    width: 82%;
    &_item {
      display: flex;
      align-items: flex-start;
      .rem(height, 35);
      border-bottom: .5px solid #D6D4D4;
      .rem(margin-top, 28);
    }
    &_control {
      flex: 1;
      display: flex;
      align-items: center;
    }
  }
  &_input_require {
    flex: 1;
    margin: 0;
    padding: 0;
    border: 0;
    outline: 0;
    .rem(font-size, 16);
    width: 74%;
    font-family: @redff;
    color: #A19D9E;
    &::-webkit-input-placeholder, /* WebKit, Blink, Edge */
    &:-moz-placeholder, /* Mozilla Firefox 4 to 18 */
    &::-moz-placeholder, /* Mozilla Firefox 19+ */
    &:-ms-input-placeholder { /* Internet Explorer 10-11 */
      color: #A19D9E;
    }
  }
  &_icon_clear {
    display: block;
    margin: 0 13/16rem;
    .rem(width, 18);
    .rem(height, 18);
    float: right;
    background: url(~assets/images/login_delete.png) no-repeat;
    background-size: 100%;
  }
}

.veri_code button {
  font-family: MicrosoftYaHei, @dff;
  font-size: 14px;
  color: #FF3C54;
  border: 0;
  background: transparent;
  &:disabled {
    color: #989898;
  }
}

#captcha {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
}

.hidden {
  visibility: hidden;
}
button:focus {
  outline: none;
}
</style>
