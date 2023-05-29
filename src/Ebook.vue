<template>
    <div class="ebook">
      <title-bar :ifTitleAndMenuShow="ifTitleAndMenuShow"></title-bar>
      <div class="read-wrapper">
        <div id="read"></div>
        <div class="mask">
          <div class="left" @click="prevPage"></div>
          <div class="center" @click="toggleTitleAndMenu"></div>
          <div class="right" @click="nextPage"></div>
        </div>
      </div>
      <menu-bar :ifTitleAndMenuShow="ifTitleAndMenuShow"
                :fontSizeList="fontSizeList"
                :defaultFontSize="defaultFontSize"
                @setFontSize='setFontSize'
                :themeList="themeList"
                :defaultTheme="defaultTheme"
                @setTheme="setTheme"
                :bookAvailable="bookAvailable"
                @onProgressChange="onProgressChange"
                :navigation="navigation"
                :curPercentage="curPercentage"
                @jumpTo="jumpTo"
                :parentProgress="progress"
                ref="menuBar"></menu-bar>
    </div>
</template>
<script>
import TitleBar from '@/components/TitleBar'
import MenuBar from '@/components/MenuBar'
import Epub from 'epubjs'
const DOWNLOAD_URL = '/static/bookTest.epub'
global.ePub = Epub
export default {
  components: {
    TitleBar,
    MenuBar
  },
  data() {
    return {
      ifTitleAndMenuShow: false,
      fontSizeList: [
        {fontSize: 12},
        {fontSize: 14},
        {fontSize: 16},
        {fontSize: 18},
        {fontSize: 20},
        {fontSize: 22},
        {fontSize: 24}
      ],
      defaultFontSize: 16,
      themeList: [
        {
          name: 'default',
          style: {
            body: {
              'color': '#000', 'background': '#fff'
            }
          }
        },
        {
          name: 'eye',
          style: {
            body: {
              'color': '#000', 'background': '#ceeaba'
            }
          }
        },
        {
          name: 'night',
          style: {
            body: {
              'color': '#fff', 'background': '#000'
            }
          }
        },
        {
          name: 'gold',
          style: {
            body: {
              'color': '#000', 'background': 'rgb(241, 236, 226)'
            }
          }
        }
      ],
      defaultTheme: 0,
      bookAvailable: false,
      curPercentage: 0,
      navigation: {},
      progress: 0
    }
  },
  methods: {
    // 对进度条的控制
    showProgress() {
      const currentLocation = this.rendition.currentLocation()
      this.progress = this.bookAvailable ? this.locations.percentageFromCfi(currentLocation.start.cfi) : 0
      this.progress = Math.round(this.progress * 100)
    },
    // 根据链接跳转
    jumpTo(href) {
      this.rendition.display(href).then(() => {
        this.showProgress()
      })
      this.hideTitleAndMenu()
    },
    hideTitleAndMenu() {
      this.ifTitleAndMenuShow = false
      this.$refs.menuBar.hideSetting()
      this.$refs.menuBar.hideContent()
    },
    // 翻页，切换目录过程中给触发
    onLocationChange() {
      let curLocation = this.rendition.currentLocation()
      this.curPercentage = (Math.floor(this.locations.percentageFromCfi(curLocation.start.cfi) * 10000) / 100).toFixed(0) * 1
      this.$refs.menuBar.LocationChange()
    },
    // 进度条数值，0-100
    onProgressChange(progress) {
      const percentage = progress / 100
      const location = percentage > 0 ? this.locations.cfiFromPercentage(percentage) : 0
      this.rendition.display(location)
    },
    setTheme(index) {
      this.themes.select(this.themeList[index].name)
      this.defaultTheme = index
    },
    registerTheme() {
      this.themeList.forEach(theme => {
        this.themes.register(theme.name, theme.style)
      })
    },
    setFontSize(fontSize) {
      this.defaultFontSize = fontSize
      if (this.themes) {
        this.themes.fontSize(fontSize + 'px')
      }
    },
    toggleTitleAndMenu() {
      this.ifTitleAndMenuShow = !this.ifTitleAndMenuShow
      if (!this.ifTitleAndMenuShow) {
        this.$refs.menuBar.hideSetting()
      }
    },
    prevPage() {
      // Rendition.prev
      if (this.rendition) {
        this.rendition.prev()
        this.showProgress()
        if (this.ifTitleAndMenuShow) {
          this.ifTitleAndMenuShow = !this.ifTitleAndMenuShow
          this.$refs.menuBar.hideSetting()
        }
      }
    },
    nextPage() {
      // Rendition.next
      if (this.rendition) {
        this.rendition.next()
        this.showProgress()
        if (this.ifTitleAndMenuShow) {
          this.ifTitleAndMenuShow = !this.ifTitleAndMenuShow
          this.$refs.menuBar.hideSetting()
        }
      }
    },
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
      // 获取Theme对象
      this.themes = this.rendition.themes
      this.setFontSize(this.defaultFontSize)
      this.registerTheme()
      this.setTheme(this.defaultTheme)
      // 获取Location对象，通过钩子函数来实现
      this.book.ready.then(() => {
        this.navigation = this.book.navigation
        return this.book.locations.generate()
      }).then(result => {
        this.locations = this.book.locations
        this.bookAvailable = true
      })
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
