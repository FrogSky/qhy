<template>
  <section class="program_container">
    <h1 class="program_head">{{ title }}</h1>
    <!-- 精彩推荐类：标题只占一行，左右两列布局的列表 -->
    <ul class="program_list program_list1" v-if="listType == 'list1'">
      <li class="program_list_item" v-for="(item, key) in list" :key="key">
        <a :href="item.url ? item.url : 'javascript:;'" class="program">
          <div class="program_img">
            <img :src="item.cover" alt="">
          </div>
          <div class="program_detail">
            <!-- 这里的title字段可能会换 -->
            <h4 class="program_detail_title">{{ item.name }}</h4>
            <div class="program_detail_update">{{item.updatedAt | formatDate('MM-dd hh:mm:ss')}}</div>
          </div>
        </a>
      </li>
    </ul>
    <!-- VIP解盘类：标题占两行，左右两列布局的列表 -->
    <ul class="program_list program_list2" v-if="listType == 'list2'">
      <li class="program_list_item" v-for="(item, key) in list" :key="key">
        <a :href="item.url ? item.url : 'javascript:;'" class="program">
          <div class="program_img">
            <img :src="item.cover" alt="">
          </div>
          <div class="program_detail">
            <!-- 这里的title字段可能会换 -->
            <h4 class="program_detail_title">{{ item.title }}</h4>
            <div class="program_detail_update">{{item.updatedAt | formatDate('MM-dd hh:mm:ss')}}</div>
          </div>
        </a>
      </li>
    </ul>
    <!-- 相关节目类：标题占两行，单列布局的列表 -->
    <ul class="program_list3" v-if="listType == 'list3'">
      <li class="program_list_item" v-for="(item, key) in list" :key="key">
        <a :href="item.url ? item.url : 'javascript:;'" class="program">
          <div class="program_img">
            <img :src="item.cover" alt="">
          </div>
          <div class="program_detail">
            <!-- 这里的title字段可能会换 -->
            <h4 class="program_detail_title">{{ item.title }}</h4>
            <div class="program_detail_update">{{item.updatedAt | formatDate('MM-dd hh:mm:ss')}}</div>
            <div class="program_detail_people">{{ 2046 }}人已观看</div>
          </div>
        </a>
      </li>
    </ul>
    <!-- 名师列表类：标题只占一行，竖图，三列布局的列表 -->
    <ul class="program_list4" v-if="listType == 'list4'">
      <li class="program_list_item" v-for="(item, key) in list" :key="key">
        <a :href="item.url ? item.url : 'javascript:;'" class="program">
          <div class="program_img">
            <img :src="item.cover" alt="">
          </div>
          <div class="program_detail">
            <!-- 这里的title字段可能会换 -->
            <h4 class="program_detail_title">{{ item.name }}老师</h4>
          </div>
        </a>
      </li>
    </ul>
  </section>
</template>
<script>
import { formatDate } from '~/assets/js/formatDate'

export default {
  props: {
    title: {
      type: String,
      required: true
    },
    list: {
      type: Array,
      default() {
        return [];
      }
    },
    listType: {
      validator(value) {
        // 这个值必须匹配下列字符串中的一个
        return ['list1', 'list2', 'list3', 'list4'].indexOf(value) !== -1;
      }
    }
  },
  data() {
    return {
      //
    }
  },
  filters: {
    formatDate,
  }
}
</script>
<style lang="less" scoped>
@import "~assets/styles/index.less";

.program_container {
  margin: 0 20/16rem;
  .rem(margin-top, 25);
}

.program_head {
  font-family: @medff;
  .rem(margin-bottom, 19);
  .rem(font-size, 20);
  color: #1E1E1E;
}

// list1和list2的样式
.program_list {
  overflow: hidden;
  & .program_list_item {
    width: calc((100% - 10px) / 2);
    float: left;
    &:nth-child(2n) {
      margin-left: 10px;
    }
  }
  & .program {
    display: flex;
    flex-direction: column;
    .rem(margin-bottom, 22);
    &_img img {
      display: block;
      .rem(width, 182);
      .rem(height, 101);
      border-radius: 4px;
    }
    &_detail {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      &_title {
        font-family: @medff;
        .rem(font-size, 14);
        .rem(margin-top, 10);
        color: #1E1E1E;
      }
      &_update {
        .rem(font-size, 12);
        .rem(margin-top, 6);
        color: #8E8E8E;
      }
    }
  }
}
// list2的特殊样式
.program_list2 {
  & .program_detail_title {
    .rem(height, 40);
    .rem(line-height, 20);
    .ellipsis(2);
  }
  & .program_detail_update {
    .rem(margin-top, 4);
  }
}
// list3的样式
.program_list3 {
  .program {
    display: flex;
    .rem(margin-bottom, 24);
    &_img {
      .rem(margin-right, 16);
      & img {
        display: block;
        .rem(width, 145);
        .rem(height, 81);
        border-radius: 4px;
      }
    }
    &_detail {
      display: flex;
      flex-direction: column;
      justify-content: space-between;//flex-end保留方案
      &_title {
        font-family: @medff;
        .rem(font-size, 14);
        .rem(height, 40);
        .rem(line-height, 20);
        color: #1E1E1E;
        .ellipsis(2);
      }
      &_update, &_people {
        .rem(font-size, 12);
        color: #8E8E8E;
      }
      // &_update {
      //   margin: 4/16rem 0;
      // }
    }
  }
}
//list4的特殊样式
.program_list4 {
  overflow: hidden;
  & .program_list_item {
    width: calc((100% - 45px) / 3);
    float: left;
    margin-right: 22px;
    &:nth-child(3n) {
      margin-right: 0;
    }
  }
  & .program {
    display: flex;
    flex-direction: column;
    .rem(margin-bottom, 20);
    &_img img {
      display: block;
      .rem(width, 110);
      .rem(height, 145);
      border-radius: 4px;
    }
    &_detail {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      &_title {
        font-family: @medff;
        .rem(font-size, 14);
        .rem(margin-top, 10);
        color: #1E1E1E;
      }
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

</style>