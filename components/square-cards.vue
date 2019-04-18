/**
 *  @module square-card卡片选择金额
 *  @event  提供change-card事件回调
 *  @param  itemsData是props的渲染数据
 *  @description  用于页面中购买不同金额选择，点播等方块卡片,使用方法参照pay/buy.vue
 *  @example  items: [{
                title:'点播本集',
                amount: '8.00',
                active: false,
              }],
 *  by zhangning 2018-10-16
 */

<template>
  <div class="squarecard">
    <ul class="squarecard_list">
      <li v-for="(value, key, index) in items" :key='key' class="squarecard_list_item" :class="{'is_active':value.active,'is_primary': (primary != null ? 'is_primary' : '')}" @click="currentChange(value, key, index)">
        <p class="squarecard_list_item_title">{{value.title}}<span>仟仟币</span></p>
        <p class="squarecard_list_item_amount"><strong>￥</strong>{{value.amount}}</p>
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
  props: ['itemsData','primary'],
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
      // 重新渲染card的active值
      this.items.map((it,index)=>{
        it.active = false
      })
      // card的active赋值
      this.items[key].active = true;
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
.squarecard{
  &_list{
    list-style: none;
    overflow: hidden;
    padding: 0;
    font-family: @medff;
    /*display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;*/
    &_item{
      float: left;
      .rem(width, 110);
      .rem(height, 98);
      .rem(margin-left, 22);
      .rem(margin-bottom, 16);
      padding: unit(16 / 16, rem) 0 unit(14 / 16, rem);
      border: 1px solid #C4C4C4;
      text-align: center;
      border-radius: 4px;
      &_title{
        color: #666363;
        .rem(font-size, 16);
        .rem(margin-bottom, 9);
        span{
          .rem(font-size, 12);
        }
      }
      &_amount{
        .rem(font-size, 24);
        .rem(height, 33);
        .rem(line-height, 33);
        vertical-align: bottom;
        color: #1E1E1E;
        font-weight: 700;
        strong{
          .rem(font-size, 13);
          font-weight: 500;
        }
      }
    }
    &_item:nth-child(3n+1){
      margin-left: 0;
    }
    /*primary全部黑色的样式*/
    .is_primary{
      border: 1px solid #D6D4D4;
      .squarecard_list_item_title{
        font-weight: 700;
        color: #1E1E1E;
      }
      .squarecard_list_item_amount{
        color: #1E1E1E;
      }
    }
    /*激活的样式*/
    .is_active{
      border: 1px solid #D4B577;
      .squarecard_list_item_title{
        color: #1E1E1E;
      }
      .squarecard_list_item_amount{
        color: #D4B577;
      }
    }
    
  }
}
</style>
