<!-- 视频详情页，带老师详情信息 -->
<template>
  <main class="container" :onRefresh="refresh">
  <v-reload :on-infinite-load="onInfiniteLoad" :parent-pull-up-state="infiniteLoadData.pullUpState">
    <video-com :data="videoData" :url="videoUrl" />
    <lecturer class="lecturer_wrap" :data="teacherData" />
    <div class="line"></div>
    <program :title="listTitle" :list="list" :list-type="listType" />
  </v-reload>
  </main>
</template>

<script>
import DropDownRefresh from '~/components/dropDownRefresh'
import PullUpReload from '~/components/pullUpLoad'
import lecturer from '~/components/lecturer'
import video from '~/components/video'
import program from '~/components/program'
import { formatDate } from '~/assets/js/formatDate'

export default {
  validate ({ params }) {
    // 必须是number类型
    return /^\d+$/.test(params.vid)
  },
  layout: 'sub',
  scrollToTop: true,
  data() {
    return {
      title: '视频详情页',
      videoData: {},
      videoUrl: '',
      teacherData: {},
      listTitle: '相关视频',
      listType: 'list3',
      list: [],
      id: 27, //teacherId
      infiniteLoadData: {
        pullUpState: 1,
        next: '',
      },
    }
  }, 
  methods: {
    async getLecturer(id) {
      let { data } = await this.$axios.$get(`/v1/lecturer/${id}`);
      if(data) {
        console.log(data);
        this.teacherData = data;
      }
    },
    // 获取节目列表
    async getVideos(id) {
      let { data, next } = await this.$axios.$get(`/v1/lecturer/${id}/videos`);
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
    // 获取视频信息
    async getVideo() {
      let { vid } = this.$route.params;
      let { data } = await this.$axios.$get(`/v1/video/${vid}`);
      if(data) {
        let buttonText, now, expireTime, leftDays;
        if(data.link && data.link.subscribe) {
          now = Date.now()/1000;
          expireTime = data.link.subscribe;
          leftDays = Math.floor((expireTime - now)/60/60/24);
          // console.log(this.formatDate(expireTime));
          if(leftDays > 30) {
            buttonText = `订阅的服务 ${this.formatDate(expireTime)}到期，去续费`;
          } else if(leftDays > 0) {
            buttonText = `订阅的服务 还有${leftDays}天到期，去续费`;
          } else {
            buttonText = `订阅的服务 ${this.formatDate(expireTime)}到期，去续费`;
          }
        } else if(data.link && data.link.purchase) {
          now = Date.now()/1000;
          expireTime = data.link.purchase;
          leftDays = Math.floor((expireTime - now)/60/60/24);
          // console.log(this.formatDate(expireTime));
          if(leftDays > 30) {
            buttonText = `订阅的服务 ${this.formatDate(expireTime)}到期，去续费`;
          } else if(leftDays > 0) {
            buttonText = `订阅的服务 还有${leftDays}天到期，去续费`;
          } else {
            buttonText = `订阅的服务 ${this.formatDate(expireTime)}到期，去续费`;
          }
        } else {
          buttonText = `${data.price}仟仟币购买观看完整版`;
        }
        data.buttonText = buttonText;
        console.log(data);
        this.videoData = data;
        // if(this.$route.query.id) {
        //   this.id = this.$route.query.id;
        //   this.getLecturer(this.id);
        //   this.getVideos(this.id);
        // } else {
          this.id = data.lecturer.id;
          this.getLecturer(this.id);
          this.getVideos(this.id);
        // }
      }
    },
    // 获取播放信息
    async getPlay() {
      let { vid } = this.$route.params;
      let { data } = await this.$axios.$post(`/v1/video/${vid}/play`);
      if(data) {
        console.log(data);
        this.videoUrl = data.url;
      }
    },
    formatDate,
    init() {
      this.getVideo();
      this.getPlay();
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
    videoCom: video,
    lecturer,
    program,
  },
  created () {
    this.init();
  },
}
</script>

<style lang="less" scoped>
@import "~assets/styles/index.less";

.line {
  margin: 0 20/16rem;
  border-bottom: 1px solid #EAEAEA;
  .rem(padding-bottom, 24);
}

.lecturer_wrap /deep/ .number_wrap {
  .rem(margin-right, 28);
}

i, em {
  font-style: normal;
}
button:focus {
  outline: none;
}
</style>
