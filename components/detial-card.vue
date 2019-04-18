/**
 *  @module detial-card卡片选择金额
 *  @event  提供change-card事件回调
 *  @param  itemsData是props的渲染数据
 *  @description  用于页面中展示详情列表，参照member/member.vue
 *  @example  items: [{
                imgsrc:'srccccc',
                title:'3个月',
                update: '2018-9-10',
              }],
 *  by zhangning 2018-10-21
 */
<template>
  <div class="detialcard">
    <ul class="detialcard_list">
      <li v-for="(value, key, index) in items" :key='key' class="detialcard_list_item" @click="currentChange(value, key, index)">
        <p class="detialcard_list_item_img"><img src= '~/assets/images/pic.jpg' alt=""></p>
        <div>
          <h4 class="detialcard_list_item_title">{{value.title}}</h4>
          <p class="detialcard_list_item_update">{{value.update}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import store from '~/store/detail/video'
import Vue from 'vue';
export default {
  store,
  props: ['itemsData'],
  data() {
    return {
      items: [],
    }
  },
  mounted () {
    this.items = this.itemsData;
  },
  methods: {
    currentChange(value, key, index){
      //返回当前选中card的信息
      this.$emit('change', this.items[key], this.items)
    },
  },
  watch:{
    itemsData:{
        handler:function(val,oldval){  
            this.items = this.itemsData;
        },  
        deep:true
    },
  }
}
</script>
<style lang="less" scoped>
@var: PingFangSC-Regular, 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
.rem(@name, @px) {
  @{name}: unit(@px / 16, rem);
}
@ffd: 'Helvetica Neue', Arial, sans-serif;
@medff: 'PingFangSC-Medium',@ffd;

/*card组件样式*/
.detialcard{
  padding: 0 unit(20 / 16, rem);
  &_list{
    list-style: none;
    overflow: hidden;
    padding: 0;
    font-family: @medff;
    &_item{
      width: calc((100% - 10px) / 2);
      float: left;
      .rem(margin-bottom, 22);
      &:nth-child(2n) {
        margin-left: 10px;
      }
      &_img img {
        display: block;
        width: 100%;
        .rem(height, 101);
        border-radius: 4px;
      }
      &_title {
        font-family: @medff;
        .rem(font-size, 14);
        .rem(margin-top, 10);
        color: #1E1E1E;
        .rem(height, 40);
        overflow:hidden;
      }
      &_update {
        .rem(font-size, 12);
        .rem(margin-top, 6);
        color: #8E8E8E;
      }
    }
  }
}
</style>
