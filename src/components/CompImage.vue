<template>
  <div class="bed-image" v-if="currentPage !== ''">
    <!-- top panel -->
    <div class="box-panel">
      <div class="btn btn-danger" v-bind:style="{ visibility: currentPage > firstPage ? 'visible': 'hidden' }" v-on:click="goFirst()">
        << {{ firstPage + 1 }}
      </div>
      <div class="btn btn-info" v-bind:style="{ visibility: currentPage > firstPage ? 'visible': 'hidden' }" v-on:click="goPrevious()">
        < {{ previousPage + 1 }}
      </div>
      {{ currentPage + 1 }}
      <div class="btn btn-info" v-bind:style="{ visibility: currentPage < lastPage ? 'visible': 'hidden' }" v-on:click="goNext()">
        {{ nextPage + 1 }} >
      </div>
      <div class="btn btn-danger" v-bind:style="{ visibility: currentPage < lastPage ? 'visible': 'hidden' }" v-on:click="goLast()">
        {{ lastPage + 1 }} >>
      </div>
    </div>
    <!-- image area -->
    <div class="box-pages">
      <div class="page">
        <img v-bind:src="currentImage" v-bind:alt="currentImage" />
      </div>
    </div>
    <!-- bottom panel -->
    <div class="box-panel">
      <div class="btn btn-danger" v-bind:style="{ visibility: currentPage > firstPage ? 'visible': 'hidden' }" v-on:click="goFirst()">
        << {{ firstPage + 1 }}
      </div>
      <div class="btn btn-info" v-bind:style="{ visibility: currentPage > firstPage ? 'visible': 'hidden' }" v-on:click="goPrevious()">
        < {{ previousPage + 1 }}
      </div>
      {{ currentPage + 1 }}
      <div class="btn btn-info" v-bind:style="{ visibility: currentPage < lastPage ? 'visible': 'hidden' }" v-on:click="goNext()">
        {{ nextPage + 1 }} >
      </div>
      <div class="btn btn-danger" v-bind:style="{ visibility: currentPage < lastPage ? 'visible': 'hidden' }" v-on:click="goLast()">
        {{ lastPage + 1 }} >>
      </div>
    </div>
    <div class="box-panel">
      Jump to page <input type="number" class="input-default jump-page" v-model="jumpPage" />
      <div class="btn btn-info" v-on:click="jump()">Jump</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'image',
  props: [
    'imageid', // 选择的图片集id
    'pages'  // 选择的图片集有多少页
  ],
  data () {
    return {
      currentPage: '',  // 当前浏览页索引， '' - 默认，非法， 0~+ 合法页
      jumpPage: 1,  // 要跳转的页面（注意此数字是从1开始）
      imageList: []  // 图片集所有图片地址
    }
  },
  computed: {
    currentImage () {
      if (this.currentPage !== '' && this.imageList.length && this.currentPage <= this.imageList.length - 1) {
        return this.imageList[this.currentPage]
      } else {
        return ''
      }
    },

    previousPage () {
      if (this.currentPage !== '') {
        let previous = this.currentPage - 1
        previous < this.firstPage ? previous = this.firstPage : previous
        return previous
      } else {
        return 0
      }
    },

    nextPage () {
      if (this.currentPage !== '') {
        let next = this.currentPage + 1
        next > this.lastPage ? next = this.lastPage : next
        return next
      } else {
        return 0
      }
    },

    firstPage () {
      if (this.pages) {
        return 0
      } else {
        return 0
      }
    },

    lastPage () {
      if (this.pages) {
        return this.pages - 1
      } else {
        return 0
      }
    }
  },
  methods: {
    // get image data for list
    getImageData () {
      for (let i = 0; i < this.pages; i++) {
        this.imageList.push('/static/image/' + this.imageid + '/' + (i + 1) + '.png')
      }
      // console.log(this.imageList)
    },

    // goto next page
    goNext () {
      if (this.currentPage < this.lastPage) {
        this.currentPage++
      }
    },

    // goto previous page
    goPrevious () {
      if (this.currentPage > this.firstPage) {
        this.currentPage--
      }
    },

    // goto first page
    goFirst () {
      this.currentPage = this.firstPage
    },

    // goto last page
    goLast () {
      this.currentPage = this.lastPage
    },

    jump () {
      let jumpPage = parseInt(Math.abs(this.jumpPage))
      jumpPage -= 1

      if (jumpPage <= this.lastPage && jumpPage >= this.firstPage) {
        this.currentPage = jumpPage
      }
    }
  },
  created () {
    // let _this = this

    this.getImageData()

    if (this.imageList.length) {
      this.currentPage = 0
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.box-pages {
  width: 90%;
  margin: 24px 5%;

  border: 1px solid rgb(184,183,182);
}

.box-panel {
  margin-bottom: 24px;
}

.jump-page {
  width: 120px;
}
</style>
