<template>
  <section class="video_container">
    <video class="video_body" controls="controls" webkit-playsinline="true" playsinline :src="url" :poster="data.cover" autoplay>
      您的浏览器不支持 video 标签。
    </video>
    <div class="purchase" v-if="data.price">
      <button @click="handleClick">{{ data.buttonText }}</button>
    </div>
    <section class="video">
      <h1 class="video_title">{{ data.title }}</h1>
      <section class="state">
        <span class="state_update" v-if="data.updatedAt">{{ data.updatedAt | formatDate }}更新</span>
        <span class="state_people">{{ data.stat && data.stat.play }}人已观看</span>
        <a href="javascript:;" @click="handleTeacherClick" class="state_price" v-if="!!+subscribe">{{ subscribe }}仟仟币/月 订阅</a>
      </section>
    </section>
  </section>
</template>

<script>
import { formatDate } from '~/assets/js/formatDate'

export default {
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    url: {
      type: String,
    }
  },
  filters: {
    formatDate
  },
  computed: {
    subscribe() {
      return (this.data.lecturer && this.data.lecturer.price) || (this.data.serials && this.data.serials.price);
    }
  },
  methods: {
    handleClick() {
      this.$router.push({path: '/pay/order', query: {
        pageType: this.data.type === 'serials' ? 'videos' : 'teacVideo',
        id: this.data.id
      }})
    },
    handleTeacherClick() {
      console.log(this.data)
      this.$router.push({path: '/pay/order', query: {
        pageType: this.data.type === 'serials' ? 'videos' : 'teacher',
        id: this.data.type === 'serials' ? this.data.id : this.data.lecturer.id
      }})
    }
  }
}
</script>

<style lang="less" scoped>
@import "~assets/styles/index.less";

.video_body {
  width: 100%;
}

.video {
  margin: 0 20/16rem;
  border-bottom: 1px solid #EAEAEA;
  .rem(padding-bottom, 24);
}

.purchase {
  margin: 20/16rem 20/16rem 0;
  & button {
    width: 100%;
    padding: 15/16rem 0;
    .rem(font-size, 16);
    color: #6E531D;
    border: 0;
    background: #D4B577;
    border-radius: 4px;
    text-align: center;
  }
}

.video_title {
  .rem(margin-top, 25);
  font-family: @medff;
  .rem(font-size, 20);
  color: #1E1E1E;
  .ellipsis(3);
}

.state {
  display: flex;
  align-items: center;
  .rem(margin-top, 19);
  &_update {
    .rem(margin-right, 16);
  }
  &_people {
    flex: 1;
  }
  &_update, &_people, &_price {
    .rem(font-size, 12);
    color: #8E8E8E;
  }
  &_price {
    .rem(margin-left, 10);
    color: #D5B673;
  }
}

i {
  font-style: normal;
}
button:focus {
  outline: none;
}
a {
  text-decoration: none;
}
</style>
