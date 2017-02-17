<template>
  <div id="app">
    <!-- login part -->
    <div class="bed-login" v-if="!enable" v-bind:style="{ backgroundColor: loginBgColor }">
      <div class="box-login" v-show="!isBanned">
        <div class="login-title">Enter pin to access:</div>
        <div style="margin-bottom: 48px;">
          <input type="text" class="input-login input-default" v-model="pin" />
        </div>
        <div class="btn btn-default" v-on:click="login()">Login</div>
      </div>
      <div class="box-bannedlogin" v-show="isBanned">
        <div class="login-title">Sorry, you are banned and cannot access!</div>
      </div>
    </div>
    <!-- main services -->
    <div class="bed-content" v-if="enable">
      <div class="bed-nav" v-show="selectedPage === ''">
        <div class="item-nav" v-for="item in navList" v-on:click="navigate(item.id)">
          {{ item.name }}
        </div>
      </div>
      <choose-image v-show="selectedPage === 'choose_image'"></choose-image>
      <comp-image v-if="selectedPage === 'image'" v-bind:imageid="imageId" v-bind:pages="imagePages"></comp-image>
      <choose-video v-show="selectedPage === 'choose_video'"></choose-video>
      <comp-video v-if="selectedPage === 'video'" v-bind:videoid="videoId" v-bind:videourl="videoUrl"></comp-video>
    </div>
  </div>
</template>

<script>
import eventBus from './EventBus'
import CompChooseImage from './components/CompChooseImage'
import CompImage from './components/CompImage'
import CompChooseVideo from './components/CompChooseVideo'
import CompVideo from './components/CompVideo'

export default {
  name: 'app',
  data () {
    return {
      enable: false,  // 是否允许使用功能服务 （测试，调试时可以直接设置为true免除输入pin）
      isBanned: false,  // 是否是被ban的用户
      pin: '',   // 登陆输入的pin
      loginTriedCount: 0,  // 尝试登陆的次数
      selectedPage: '',  // 当前选择的page
      imageId: '',  // 选择的image id
      imagePages: 0,  // 选择的image列表拥有多少页
      videoId: '',  // 选择的video id
      videoUrl: '',  // 选择的video url（如是外部视频）
      navList: [
        { id: 'choose_image', name: 'Image' },
        { id: 'choose_video', name: 'Video' }
      ]
    }
  },
  computed: {
    loginBgColor () {
      if (this.isBanned) {
        return 'rgb(238,110,110)'
      } else if (this.loginTriedCount <= 1) {
        return 'rgb(215,212,212)'
      } else if (this.loginTriedCount >= 3) {
        return 'rgb(238,110,110)'
      } else {
        return 'rgb(237,147,64)'
      }
    }
  },
  methods: {
    // login
    login () {
      if (!this.isBanned) {
        this.loginTriedCount++
        if (this.verifyPin(this.pin)) {
          // correct pin, open service for user
          this.enable = true
        } else {
          // wrong pin, check if how many times user tried
          if (this.loginTriedCount >= 3) {
            // user should be banned
            this.isBanned = true
            window.localStorage.bannedLogin = 'true'
          } else {
            // wrong login times can be beared...
          }
        }
      } else {
        window.alert('You are banned and cannot access!')
      }
    },

    // verify pin code
    // NOTE: what's the correct pin code ?
    // 1. pick up today's date(into format MMDD, e.g. Feb. 15th is 0215)
    // 2. map date string into alphabet, the map table is as below
    //       0 -- O    1 -- I    2 -- Z    3 -- E    4 -- F
    //       5 -- S    6 -- b    7 -- L    8 -- W    9 -- q
    //    e.g 0215 should be mapped into OZIS, the correct pin code this day is 'OZIS'
    verifyPin (pin) {
      if (pin) {
        // turn pin into string format and change into upper case
        pin = pin + ''
        pin = pin.toUpperCase()

        // generate correct pin code by today's date
        const today = new Date()
        let month = today.getMonth() + 1
        let day = today.getDate()
        // turn month and day into string
        month += ''
        day += ''
        month.length === 1 ? month = '0' + month : month
        day.length === 1 ? day = '0' + day : day
        const pinNumStr = month + day
        // console.log('raw pin:', pinNumStr)
        let realPin = ''
        const mapTable = ['O', 'I', 'Z', 'E', 'F', 'S', 'B', 'L', 'W', 'Q']
        for (let i = 0; i < 4; i++) {
          realPin += mapTable[parseInt(pinNumStr[i])]
        }
        // console.log('final pin:', realPin)

        if (realPin === pin) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },

    // 跳转 -- 跳转的页面id
    navigate (id) {
      if (id) {
        this.selectedPage = id
      }
    }
  },
  components: {
    'choose-image': CompChooseImage,
    'comp-image': CompImage,
    'choose-video': CompChooseVideo,
    'comp-video': CompVideo
  },
  created () {
    let _this = this

    // read LS data
    if (window.localStorage.bannedLogin && window.localStorage.bannedLogin === 'true') {
      // check if user was banned
      this.isBanned = true
    }
    // if (window.localStorage.loginTriedCount) {
    //   // check how many times user tried to login before
    //   this.loginTriedCount = parseInt(window.localStorage.loginTriedCount)
    // }

    eventBus.$on('notifyPlayImage', params => {
      _this.imageId = params.id
      _this.imagePages = params.pages || 0
      _this.selectedPage = 'image'
    })

    eventBus.$on('notifyPlayVideo', params => {
      _this.videoId = params.id
      _this.videoUrl = params.url
      _this.selectedPage = 'video'
    })
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /*color: #2c3e50;
  margin-top: 60px;*/

  font-size: 36px;
}

#video {
  width: 100%;
}

.bed-login {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;

  /*background-color: rgb(238,110,110);*/
  z-index: 900;
}

.box-login, .box-bannedlogin {
  /*width: 80%;*/
  margin-top: 30%;
}

.login-title {
  margin-bottom: 24px;

  color: white;
  font-weight: bold;
}

.input-login {
  text-align: center;
  /*font-size: 36px;*/
}

.bed-nav {
  width: 600px;
  margin: 0 auto;
}

.item-nav {
  height: 240px;
  line-height: 240px;
  margin: 30px 0;
  background-color: rgb(30,174,187);

  text-align: center;
  font-size: 60px;
}

.btn {
  display: inline-block;
  margin: 0 12px;
  padding: 12px 24px;

  border-radius: 12px;
}

.btn-default {
  border: 1px solid rgb(121,121,121);

  background-color: white;
  color: black;
}

.btn-info {
  border: 1px solid rgb(56,154,244);

  background-color: rgb(56,154,244);
  color: white;
}

.btn-danger {
  border: 1px solid rgb(210,65,70);

  background-color: rgb(210,65,70);
  color: white;
}

.input-default {
  /*width: 120px;*/
  height: 75px;

  font-size: 30px;
  border: 1px solid rgb(81,148,249);
}
</style>
