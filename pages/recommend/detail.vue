<!-- 节目视频详情页，没有讲师信息 -->
<template>
  <main class="container">
  <v-reload :on-infinite-load="onInfiniteLoad" :parent-pull-up-state="infiniteLoadData.pullUpState">
    <video-com :data="videoData" :url="videoUrl" />
    <!-- 缺一个关注按钮 -->
    <program :title="listTitle" :list="list" :list-type="listType" />
  </v-reload>
  </main>
</template>

<script>
import DropDownRefresh from '~/components/dropDownRefresh'
import PullUpReload from '~/components/pullUpLoad'
import video from '~/components/video'
import program from '~/components/program'
import { formatDate } from '~/assets/js/formatDate'

export default {
  layout: 'sub',
  // scrollToTop: true,
  data() {
    return {
      // 可以动态获取并修改网页title
      title: '精品-节目',
      videoData: {},
      videoUrl: '',
      listTitle: '节目列表',
      listType: 'list3',
      list: [],
      listId: '',
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
    videoCom: video,
    program,
  },
  methods: {
    // 获取节目列表
    async getVideos() {
      let { data, next } = await this.$axios.$get(`/v1/serials/${this.listId}/videos`);
      if(data) {
        console.log(data);
        data.forEach((item) => {
          item.url = `recommend/detail?id=${item.id}`
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
      let { id } = this.$route.query;
      let { data } = await this.$axios.$get(`/v1/video/${id}`);
      if(data) {
        let buttonText;
        if(data.link && data.link.subscribe) {
          let now = Date.now()/1000;
          let expireTime = data.link.subscribe;
          let leftDays = Math.floor((expireTime - now)/60/60/24);
          console.log(expireTime);
          if(leftDays > 30) {
            buttonText = `订阅的节目 ${this.formatDate(expireTime)}到期，去续费`;
          } else if(leftDays > 0) {
            buttonText = `订阅的节目 还有${leftDays}天到期，去续费`;
          } else {
            buttonText = `订阅的节目 已过期，去续费`;
          }
        } else {
          buttonText = `${data.price}仟仟币购买观看完整节目`;
        }
        data.buttonText = buttonText;
        console.log(data);
        this.videoData = data;
        if(data.serials && data.serials.id) {
          this.listId = data.serials.id;
          this.getVideos();
        } else {
          this.infiniteLoadData.pullUpState = 3
        }
      }
    },
    // 获取播放信息
    async getPlay() {
      let { id } = this.$route.query;
      let { data } = await this.$axios.$post(`/v1/video/${id}/play`);
      if(data) {
        console.log(data);
        this.videoUrl = data.url;
      }
    },
    formatDate,
    init() {
      // this.getVideos();
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
      let { data, next } = await this.$axios.$get(`/v1/serials/${this.listId}/videos`, {
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
          item.url = `recommend/detail?id=${item.id}&listId=${this.listId}`
        })
        this.list = this.list.concat(data);
      }
      done();
    },
  },
  created() {
    this.init();
  }
}
</script>

<style lang="less" scoped>

</style>
