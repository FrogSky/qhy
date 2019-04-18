<template>
  <main class="container">
  </main>
</template>

<script>
export default {
  head () {
    return {
      title: '仟和亿',
    }
  },
  beforeCreate () {
    this.$router.push('home');
  }
}
</script>
