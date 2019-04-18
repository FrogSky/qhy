<!-- 讲师详情页，不带视频 -->
<template>
  <v-refresh class="container" :onRefresh="refresh">
  <v-reload :on-infinite-load="onInfiniteLoad" :parent-pull-up-state="infiniteLoadData.pullUpState">
    <lecturer class="lecturer_wrap" :data="teacherData"/>
    <div class="purchase_container" v-if="buttonText">
      <!-- todo:此处需要增加跳转至支付页 -->
      <button @click="handleClick" :class="{ blur: this.buttonText == '免费' }">{{ buttonText }}</button>
    </div>
    <program :title="listTitle" :list="list" :list-type="listType" class="program_wrap" />
  </v-reload>
  </v-refresh>
</template>
<script>
import DropDownRefresh from '~/components/dropDownRefresh'
import PullUpReload from '~/components/pullUpLoad'
import program from '~/components/program'
import lecturer from '~/components/lecturer'
import { formatDate } from '~/assets/js/formatDate'

export default {
  layout: 'sub',
  data() {
    return {
      title: '老师详情页',
      teacherData: {},
      buttonText: '',
      listTitle: '最新解盘',
      listType: 'list2',
      list: [],
      id: 27, // teacherId
      infiniteLoadData: {
        pullUpState: 1,
        next: '',
      },
    }
  },
  methods: {
    async getLecturer() {
      let { data } = await this.$axios.$get(`/v1/lecturer/${this.id}`);
      if(data) {
        console.log(data);
        this.teacherData = data;
        if(data.link && data.link.subscribe) {
          let now = Date.now()/1000;
          let expireTime = data.link.subscribe;
          let leftDays = Math.floor((expireTime - now)/60/60/24);
          console.log(this.formatDate(expireTime));
          if(leftDays > 30) {
            this.buttonText = `订阅的服务 ${this.formatDate(expireTime)}到期，去续费`;
          } else if(leftDays > 0) {
            this.buttonText = `订阅的服务 还有${leftDays}天到期，去续费`;
          } else {
            this.buttonText = `订阅的服务 ${this.formatDate(expireTime)}到期，立即续费`;
          }
        } else {
          this.buttonText = data.price == 0 ? '免费' : `${data.price}仟仟币/月订阅名师`;
        }
      }
    },
    async getVideos() {
      let { data, next } = await this.$axios.$get(`/v1/lecturer/${this.id}/videos`);
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
    handleClick() {
      if(this.buttonText === '免费') return;
      this.$router.push({path: '/pay/order', query: {
        pageType: 'teacher',
        id: this.id
      }})
    },
    formatDate,
    init() {
      let { id } = this.$route.query;
      this.id = id ? id : 27;
      this.getLecturer();
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
    async getPullUpMoreData(done) {
      let { data, next } = await this.$axios.$get(`/v1/lecturer/${this.id}/videos`, {
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
  },
  head () {
    return {
      title: this.title
    }
  },
  components: {
    vRefresh: DropDownRefresh,
    vReload: PullUpReload,
    lecturer,
    program
  },
  created() {
    this.init();
  }
}
</script>
<style lang="less" scoped>
@import "~assets/styles/index.less";

.lecturer_wrap {
  .rem(padding, 16);
  .rem(padding-bottom, 16);
  background: #FFFFFF;
  border: 1px solid #EAEAEA;
  border-radius: 4px;
  box-shadow: 0px 0px 10px 0px rgba(0,0,0,.1);
}

.program_wrap {
  .rem(margin-top, 41);
}

.purchase_container {
  margin: 24/16rem 20/16rem 0;
  & button {
    width: 100%;
    padding: 17/16rem 0;
    .rem(font-size, 16);
    color: #6E531D;
    border: 0;
    background: #D4B577;
    border-radius: 4px;
    text-align: center;
  }
  & .blur {
    background-color: rgba(0,0,0,.3);
    color: rgba(0,0,0,.7);
    opacity: .6;
  }
}

button:focus {
  outline: none;
}
</style>
