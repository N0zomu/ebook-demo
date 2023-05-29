<template>
    <div class="ebook">
      <div class="read-wrapper">
        <div id="read"></div>
      </div>
    </div>
</template>
<script>
import Epub from 'epubjs'
const DOWNLOAD_URL = '/static/bookTest.epub'
global.ePub = Epub
export default {
  data() {
    return {
    }
  },
  methods: {
    // 电子书的解析和渲染
    showEpub() {
      // 生成Book
      this.book = new Epub(DOWNLOAD_URL)
      // 生成Rendition
      this.rendition = this.book.renderTo('read', {
        width: window.innerWidth,
        height: window.innerHeight
      })
      // 通过Rendition.display渲染电子书
      this.rendition.display()
    }
  },
  mounted() {
    this.showEpub()
  }
}
</script>
<style lang="scss" scoped>
@import 'assets/styles/global';
.ebook {
  user-select: text;
  position: relative;
  .read-wrapper {
    .mask {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 100;
      display: flex;
      width: 100%;
      height: 100%;
      .left {
        flex: 0 0 px2rem(100);
      }
      .center {
        flex: 1;
      }
      .right{
        flex: 0 0 px2rem(100);
      }
    }
  }
}
</style>
