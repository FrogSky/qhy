<template>
  <div class="teach">
    <div class="teach_photo">
      <img :src="data.cover" alt="">
    </div>
    <div class="teach_detail">
      <h4 class="teach_detail_name">{{ data.name }}</h4>
      <div class="teach_detail_desc">{{ data.desc }}</div>
      <div class="teach_detail_number">{{ data.stat && data.stat.subscribe | toW }}人已订阅</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default() {
        return {
          cover: require('~/assets/images/photo.png'),
          name: '廖英强',
          desc: '开创波浪理论的先河者，开创波浪理的先河的先河者开创波浪理论的先河者，开创波浪理的先河的先河者',
          stat: { subscribe: '1182' },
        }
      }
    }
  },
  filters: {
    toW(num) {
      if(typeof num === 'number') {
        return num > 10000 ? (num/10000).toFixed(1) + 'W' : num;
      }
    }
  },
}
</script>
<style lang="less" scoped>
@import "~assets/styles/index.less";

.teach {
  .rem(margin-top, 19);
  display: flex;
  &_photo {
    .rem(margin-right, 16);
    & img {
      display: block;
      .rem(width, 85);
      .rem(height, 112);
      border-radius: 4px;
    }
  }
  &_detail {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: 10/16rem 0;
    &_name {
      font-family: @medff;
      .rem(font-size, 14);
      color: #1E1E1E;
    }
    &_desc {
      font-family: @redff;
      .rem(font-size, 14);
      color: #4E4E4E;
      .ellipsis(2);
    }
    &_number {
      font-family: @redff;
      .rem(font-size, 12);
      .rem(margin-top, 8);
      color: #8E8E8E;
    }
  }
}

</style>
