<template>
  <div class="refreshMoudle" @touchstart="touchStart($event)" @touchmove="touchMove($event)" @touchend="touchEnd($event)" :style="{transform: 'translate3d(0,' + top + 'px, 0)'}">
    <header class="pull-refresh">
      <slot name="pull-refresh">
        <div class="down-tip" v-if="dropDownState == 1">
          <img class="down-tip-img" src="~/assets/images/head.png">
          <span class="down-tip-text">{{ dropDownStateText.downTxt }}</span>
        </div>
        <div class="up-tip" v-if="dropDownState == 2">
          <img class="up-tip-img" src="~/assets/images/head.png">
          <span class="up-tip-text">{{ dropDownStateText.upTxt }}</span>
        </div>
        <div class="refresh-tip" v-if="dropDownState == 3">
          <img class="refresh-tip-img" src="~/assets/images/head.png">
          <span class="refresh-tip-text">{{ dropDownStateText.refreshTxt }}</span>
        </div>
      </slot>
    </header>
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
    onRefresh: {
      type: Function,
      required: false,
      default() {
        return function (done) {
          done();
        };
      }
    }
  },
  data () {
    return {
      defaultOffset: 70, // 默认高度, 相应的修改.refreshMoudle的margin-top和.down-tip, .up-tip, .refresh-tip的height
      top: 0,
      scrollIsToTop: 0,
      startY: 0,
      isDropDown: false, // 是否下拉
      isRefreshing: false, // 是否正在刷新
      dropDownState: 1, // 显示1:下拉刷新, 2:松开刷新, 3:刷新中……
      dropDownStateText: {
        downTxt: '下拉刷新',
        // downImg: '。。',
        upTxt: '松开刷新',
        // upImg: 'release.png',
        refreshTxt: '刷新中...',
        // refreshImg: 'refresh.gif'
      }
    }
  },
  mounted () {
    if (document.querySelector('.down-tip')) {
      // 获取不同手机的物理像素（dpr）,以便适配rem
      this.defaultOffset = document.querySelector('.down-tip').clientHeight || this.defaultOffset
    }
  },
  methods: {
    touchStart (e) {
      this.startY = e.targetTouches[0].pageY
    },
    touchMove (e) {
      this.scrollIsToTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop // safari 获取scrollTop用window.pageYOffset
      if (e.targetTouches[0].pageY > this.startY) { // 下拉
        this.isDropDown = true
        if (this.scrollIsToTop === 0 && !this.isRefreshing) {
          // 拉动的距离
          let diff = e.targetTouches[0].pageY - this.startY - this.scrollIsToTop
          this.top = Math.pow(diff, .9) + (this.dropDownState === 3 ? this.defaultOffset : 0)
          if (this.top >= this.defaultOffset) {
            this.dropDownState = 2
            e.preventDefault()
          } else {
            this.dropDownState = 1
            e.preventDefault()
          }
        }
      } else {
        this.isDropDown = false
        this.dropDownState = 1
      }
    },
    touchEnd (e) {
      if (this.isDropDown && !this.isRefreshing) {
        if (this.top >= this.defaultOffset) { // do refresh
          this.refresh()
          this.isRefreshing = true
          console.log(`do refresh`)
        } else { // cancel refresh
          this.isRefreshing = false
          this.isDropDown = false
          this.dropDownState = 1
          this.top = 0
        }
      }
    },
    refresh () {
      this.dropDownState = 3
      this.top = this.defaultOffset
      setTimeout(() => {
        this.onRefresh(this.refreshDone)
      }, 1200)
    },
    refreshDone () {
      this.isRefreshing = false
      this.isDropDown = false
      this.dropDownState = 1
      this.top = 0
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.refreshMoudle {
  width: 100%;
  margin-top: -70px;
  -webkit-overflow-scrolling: touch; /* ios5+ */
  transition-duration: 200ms;
  font-size: 14px;
}
.pull-refresh {
  width: 100%;
  color: #999;
}
.refreshMoudle .down-tip,
.up-tip,
.refresh-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 70px;
}
.refreshMoudle .down-tip-img,
.up-tip-img,
.refresh-tip-img {
  width: 16px;
  height: 16px;
  margin-right: 5px;
}
.refreshMoudle .refresh-tip-img {
  animation: rotating 1s linear infinite;
}
@keyframes rotating {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(1turn);
  }
}
</style>