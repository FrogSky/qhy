<template>
  <section class="lecturer_container">
    <div class="lecturer">
      <div class="lecturer_photo">
        <img :src="data.cover" alt="">
      </div>
      <div class="lecturer_detail">
        <div class="follow">
          <div class="follow_wrap">
            <div class="follow_name">{{ data.name }}</div>
            <!-- todo：此处需要添加关注功能 -->
            <!-- <button class="follow_button">关注</button> -->
          </div>
          <div class="follow_number">{{ data.stat && data.stat.follow | toW }}人已关注</div>
        </div>
        <section class="number_wrap">
          <div class="video_number number">
            <em>{{ data.stat && data.stat.videoCount}}</em>
            <span>视频内容</span>
          </div>
          <!-- <div class="watch_number number">
            <em>5.1W</em>
            <span>观看人数</span>
          </div> -->
          <div class="subscribe_number number">
            <em>{{ (data.stat && data.stat.subscribe) | toW }}</em>
            <span>订阅人数</span>
          </div>
        </section>
      </div>
    </div>
    <div class="introduce">
      <div class="content_wrap">
        <p class="content">{{ data.desc }}</p>
        <!-- <p class="hidden_content" ref="content"> {{ data.desc }}</p> -->
      </div>
      <div class="fold_wrap">
        <!-- <button><img src="~/assets/images/downarrow.png" alt=""></button> -->
      </div>
    </div>
  </section>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      // required: true,
      default() {
        return {};
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
  methods: {
    init() {
      // let originHeight = this.$refs.content.clientHeight;
    }
  },
  mounted() {
    this.init();
  }
}
</script>
<style lang="less" scoped>
@import "~assets/styles/index.less";

.lecturer_container {
  margin: 24/16rem 20/16rem 0;
}

.lecturer {
  display: flex;
  border-bottom: 1px solid #EAEAEA;
  .rem(padding-bottom, 16);
  &_photo {
    .rem(margin-right, 20);
    & img {
      display: block;
      .rem(width, 85);
      .rem(height, 112);
      border-radius: 4px;
    }
  }
  &_detail {
    flex: 1;
  }
}

.follow {
  .rem(margin-top, 10);
  &_wrap {
    display: flex;
    justify-content: space-between;
  }
  &_name {
    font-family: @medff;
    .rem(font-size, 16);
    color: #262425;
  }
  &_button {
    width: 52px;
    .rem(padding, 3.5);
    border: 0.5px solid #1E1E1E;
    border-radius: 4px;
    background: transparent;
  }
  &_number {
    .rem(font-size, 12);
    color: #8E8E8E;
  }
}

.number_wrap {
  display: flex;
  flex-direction: row;
  // justify-content: space-between;
  align-items: center;
  .rem(margin-top, 8);
  .number {
    & em, & span {
      display: block;
    }
    & em {
      font-family: @medff;
      .rem(font-size, 20);
      color: #262425;
      text-align: center;
    }
    & span {
      .rem(font-size, 12);
      color: #262425;
      text-align: center;
    }
  }
  & .video_number {
    margin-right: 2rem
  }
}

.introduce {
  .rem(margin-top, 16);
}

.content, .hidden_content {
  font-family: PingFangSC-Light, @dff;
  .rem(font-size, 14);
  color: #262425;
}

.content {
  // .ellipsis(2);
}

.fold_wrap{
  .rem(padding-top, 8); 
  & button {
    width: 100%;
    padding: 0;
    .rem(padding-top, 8);
    border: 0;
    background: transparent;
    & img {
      .rem(width, 22);
    }
  }
}

.hidden {
  visibility: hidden;
}

i, em {
  font-style: normal;
}
button:focus {
  outline: none;
}
</style>
