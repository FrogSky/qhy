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
  layout: 'first',
  // scrollToTop: true,
  data() {
    return {
      title: '精品页',
      listTitle: '精彩推荐',
      listType: 'list1',
      list: [],
      infiniteLoadData: {
        pullUpState: 1,
        next: '',
      }
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
      let { data, next } = await this.$axios.$get('/v1/serials/hot', {
        params: { size: 10 }
      });
      if(data) {
        data.forEach((item) => {
          item.url = `recommend/serials?id=${item.id}&title=${item.name}`
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
      let { data, next } = await this.$axios.$get('/v1/serials/hot', {
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
  created() {
    this.init();
  }
}
</script>
<style lang="less" scoped>

</style>