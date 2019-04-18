<template>
  <v-refresh class="container" :onRefresh="refresh">
  <v-reload :on-infinite-load="onInfiniteLoad" :parent-pull-up-state="infiniteLoadData.pullUpState">
    <program :list="list" :title="listTitle" :list-type="listType" />
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
  layout: 'sub',
  // scrollToTop: true,
  data() {
    return {
      title: '精品-节目列表页',
      listTitle: '',
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
    async getHot() {
      let { id } = this.$route.query;
      let { data, next } = await this.$axios.$get(`/v1/serials/${id}/videos`, {
        params: { size: 10 }
      });
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
    init() {
      let title = this.$route.query.title;
      this.listTitle = title ? title : '精彩推荐';
      this.getHot();
    },
    refresh(done) {
      this.init();
      done();
    },
    onInfiniteLoad (done) {
      if (this.infiniteLoadData.pullUpState === 1) {
        console.log(this.infiniteLoadData.pullUpState)
        this.getPullUpMoreData(done)
      }
    },
    async getPullUpMoreData(done) {
      let { id } = this.$route.query;
      let { data, next } = await this.$axios.$get(`/v1/serials/${id}/videos`, {
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
          item.url = `recommend/detail?id=${item.id}`
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