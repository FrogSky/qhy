<template>
  <wc-swiper v-if="slides.length" :pagination="false">
     <wc-slide v-for="(slide, key) in slides" :key="key">
      <a :href="slide.link">
        <div class="swiper_item">
          <img :src="slide.image" alt="">
        </div>
      </a>
     </wc-slide>
  </wc-swiper>  
</template>
<script>
export default {
  props: {
    slides: {
      type: Array,
      default() {
        return []
      }
    }
  },
}
</script>
<style lang="less" scoped>

.swiper_item {
  width: 100%;
  & img {
    display: block;
    width: 100%;
    height: auto;
  }
}

</style>