<template>
  <v-refresh class="container" :onRefresh="refresh">
  <v-reload :on-infinite-load="onInfiniteLoad" :parent-pull-up-state="infiniteLoadData.pullUpState">
    <slides :slides="slides"/>
    <section class="teach_container">
      <div class="teach_title">
        <h1 class="teach_head">英强解盘</h1>
        <a href="detail/teacher?id=27" class="teach_more">查看更多</a>
      </div>
      <a href="detail/teacher?id=27">
        <teacher-item :data="teacherData" />
      </a>
      <ul class="teach_list">
        <li class="teach_list_item" v-for="(item, index) in videoList" :key="index">
          <a :href="item.type | detailUrl(item.id)">{{ item.title }}</a>
        </li>
      </ul>
    </section>
    <program :list="list1" :title="title1" :list-type="listType1" />
    <div class="line"></div><!-- 分割线 -->
    <program :list="list2" :title="title2" :list-type="listType2" />
  </v-reload>
  </v-refresh>
</template>

<script>
import DropDownRefresh from '~/components/dropDownRefresh'
import PullUpReload from '~/components/pullUpLoad'
import slides from '~/components/slides'
import teacherItem from '~/components/teacher-item'
import program from '~/components/program'
import { mapState, mapActions } from 'vuex'
// import axios from 'axios'

export default {
  // async asyncData({ app }) {
  //   let dataLecturer = await app.$axios.$get('/v1/lecturer/27');
  //   let dataVideos = await app.$axios.$get('/v1/lecturer/27/videos', {
  //     params: { size: 5 }
  //   });
  //   let dataHot = await app.$axios.$get('/v1/serials/hot', {
  //     params: { size: 4 }
  //   });
  //   let dataLecturers = await app.$axios.$get('/v1/lecturers', {
  //     params: { size: 9 }
  //   });
  //   if(dataHot.data) {
  //     dataHot.data.forEach((item) => {
  //       item.url = `recommend/serials?id=${item.id}&title=${item.name}`
  //     })
  //   }
  //   if(dataLecturers.data) {
  //     dataLecturers.data.forEach((item) => {
  //       item.url = `detail/teacher/?id=${item.id}`
  //     })
  //   }
  //   return {
  //     teacherData: dataLecturer.data,
  //     videoList: dataVideos.data,
  //     list1: dataHot.data,
  //     list2: dataLecturers.data,
  //     infiniteLoadData: {
  //       pullUpState: dataLecturers.next ? 1 : 3,
  //       next: dataLecturers.next ? dataLecturers.next : '',
  //     }
  //   };
  // },
  // async fetch({ store, app }){
  //   let { data } = await app.$axios.$get('/v1/config/banner', {
  //     params: { type: 'ios' }
  //   });
  //   if(data) {
  //     store.commit('setSlides', data)
  //   }
  // },
  head () {
    return {
      title: '仟和亿'
    }
  },
  layout: 'home',
  components: {
    vRefresh: DropDownRefresh,
    vReload: PullUpReload,
    slides,
    teacherItem,
    program,
  },
  data() {
    return {
      // slides: [],
      teacherData: {},
      videoList: [],
      title1: '精彩推荐',
      listType1: 'list1',
      list1: [],
      title2: '每日解盘',
      listType2: 'list4',
      list2: [],
      infiniteLoadData: {
        pullUpState: 1,
        next: '',
      }
    }
  },
  filters: {
    detailUrl(type, id) {
      if(type === 'serials') {
        return `recommend/detail?id=${id}`;
      } else {
        return `detail/video/${id}`;
      }
    }
  },
  computed: mapState([
    // 映射 this.count 为 store.state.count
    'slides'
  ]),
  methods: {
    ...mapActions([
      // 将 `this.getBanner()` 映射为 `this.$store.dispatch('getBanner')`
      'getBanner'
    ]),
    async getLecturer() {
      let { data } = await this.$axios.$get('/v1/lecturer/27');
      if(data) {
        this.teacherData = data;
      }
    },
    async getVideos() {
      let { data } = await this.$axios.$get('/v1/lecturer/27/videos', {
        params: { size: 4 }
      });
      if(data) {
        console.log(data)
        this.videoList = data;
      }
    },
    async getLecturers() {
      let { data, next } = await this.$axios.$get('/v1/lecturers', {
        params: { size: 9 }
      });
      if(data) {
        data.forEach((item) => {
          item.url = `detail/teacher/?id=${item.id}`
        })
        this.list2 = data;
      }
      if(next) {
        this.infiniteLoadData.next = next;
      } else {
        this.infiniteLoadData.pullUpState = 3
      }
    },
    async getHot() {
      let { data } = await this.$axios.$get('/v1/serials/hot', {
        params: { size: 4 }
      });
      if(data) {
        data.forEach((item) => {
          item.url = `recommend/serials?id=${item.id}&title=${item.name}`
        })
        this.list1 = data;
      }
    },
    init() {
      this.getBanner();
      this.getLecturer();
      this.getVideos();
      this.getLecturers();
      this.getHot();
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
      let { data, next } = await this.$axios.$get('/v1/lecturers', {
        params: { size: 9, next: this.infiniteLoadData.next }
      });
      console.log(next)
      if(data) {
        data.forEach((item) => {
          item.url = `detail/teacher/?id=${item.id}`
        })
        this.list2 = this.list2.concat(data);
      }
      if(next) {
        this.infiniteLoadData.next = next;
      } else {
        this.infiniteLoadData.pullUpState = 3;
      }
      done();
    }
  },
  mounted() {
    this.init();
  }
}
</script>
<style lang="less" scoped>
@import "~assets/styles/index.less";

.teach_container, .line {
  margin: 0 20/16rem;
  border-bottom: 1px solid #EAEAEA;
}

.teach_container {
  .rem(margin-top, 25);
  .rem(padding-bottom, 9);
  & .teach_title {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  & .teach_head {
    font-family: @medff;
    .rem(font-size, 20);
    color: #1E1E1E;
  }
  & .teach_more {
    font-family: PingFangSC-Semibold, @dff;
    .rem(font-size, 14);
    .rem(width, 73);
    text-align: center;
    color: #fff;
    background: #D4B577;
    border-radius: 100px;
  }
}

.teach_list {
  .rem(margin-top, 20);
  .rem(margin-left, 3);
  overflow: hidden;
  &_item {
    float: left;
    font-family: @redff;
    width: calc((100% - 20px) / 2);
    .rem(margin-bottom, 12);
    .rem(padding-left, 30);
    .rem(font-size, 14);
    background: url('~assets/images/video_list_icon@3x.png') no-repeat left/.torem(20) auto;
    &:nth-child(2n + 1) {
      margin-right: 20px;
    }
    & a {
      color: #4E4E4E;
      .ellipsis(1);
    }
  }
}

ul {
  list-style: none;
  padding: 0;
}
a {
  text-decoration: none;
  color: #000;
}
button:focus {
  outline: none;
}
</style>
