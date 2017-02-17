<template>
  <div class="bed-video">
    <div class="box-video"></div>
    <div class="box-tip">
      <div class="bar" v-on:click="barJumpTime($event)">
        <div class="bar-ongoing" v-bind:style="barWidth">
          {{ fixTimeFormat(time) }}
        </div>
      </div>
      <p>Video duration: {{ fixTimeFormat(duration) }} <span v-if="duration > 60">({{ duration }}s)</span></p>
    </div>
    <div class="box-panel">
      <div class="btn btn-info" v-on:click="play()">Play</div>
      <div class="btn btn-info" v-on:click="pause()">Pause</div>
      <div class="btn btn-danger" v-on:click="toggleMute()">Mute/Unmute</div>
    </div>
    <div class="box-panel">
      <div class="btn btn-default" v-on:click="toggleControls()">Show/Hide Controls</div>
      <div class="btn btn-default" v-on:click="load()">Replay</div>
    </div>
    <div class="box-panel" v-if="scrollTime > 30">
      <div class="btn btn-info" v-on:click="scroll()">+ {{ scrollTime }}s</div>
      <div class="btn btn-info" v-if="scrollTime > 60" v-on:click="scroll(60)">+ 60s</div>
      <div class="btn btn-info" v-if="scrollTime > 30" v-on:click="scroll(30)">+ 30s</div>
      <div class="btn btn-info" v-if="scrollTime > 10" v-on:click="scroll(10)">+ 10s</div>
    </div>
    <div class="box-panel" v-if="scrollTime > 30">
      <div class="btn btn-info" v-on:click="scrollBack()">- {{ scrollTime }}s</div>
      <div class="btn btn-info" v-if="scrollTime > 60" v-on:click="scrollBack(60)">- 60s</div>
      <div class="btn btn-info" v-if="scrollTime > 30" v-on:click="scrollBack(30)">- 30s</div>
      <div class="btn btn-info" v-if="scrollTime > 10" v-on:click="scrollBack(10)">- 10s</div>
    </div>
    <div class="box-panel" v-if="scrollTime > 60">
      Jump to <input type="number" class="input-default jump-time" v-model="jumpTime" />s ({{ fixTimeFormat(jumpTime) }})
      <div class="btn btn-info" v-on:click="jump()">Jump</div>
      <!-- <span>Time: {{ time }}</span>
      <div class="btn btn-default" v-on:click="showTime()">Time</div> -->
    </div>
  </div>
</template>

<script>
import $ from 'jQuery'

export default {
  name: 'video',
  props: [
    'videoid',
    'videourl'
  ],
  data () {
    return {
      time: '',  // 当前播放到的时间点，单位s
      tc_updateTime: '',  // time control of update time
      duration: 0,  // 视频总长度，单位s
      jumpTime: 0  // 要跳转的时间点，单位s
    }
  },
  computed: {
    scrollTime () {
      if (this.duration) {
        // 视频总时长已经有了，计算获得合适的scroll time
        return Math.floor(this.duration / 10)
      } else {
        return 0
      }
    },

    barWidth () {
      if (this.time && this.duration) {
        // console.log(this.time, this.duration)
        let percent = this.time / this.duration * 100
        percent < 1 ? percent = 1 : percent
        percent > 100 ? percent = 100 : percent
        // console.log(percent)
        return {
          width: percent + '%'
        }
      } else {
        return {
          width: '1%'
        }
      }
    }
  },
  methods: {
    // 点击bar跳转到对应的时间
    barJumpTime (ev) {
      // console.log(document.querySelector('.bar').offsetWidth, ev.clientX)
      const x = ev.clientX || ev.layerX || 0
      const w = document.querySelector('.bar').offsetWidth || 0
      // get the percent of user's clicking
      if (ev && x && w) {
        let jumpTime = x / w * this.duration
        this.jump(jumpTime)
      }
    },

    createVideo () {
      // NOTE: since vue doesn't support MVVM video and can route into some bugs, we MUST use js to handle video related stuffs
      if (!document.querySelector('#video')) {
        let videoHtml = '<video id="video">'
        if (this.videoid === 'URL') {
          // outside url video
          videoHtml += '<source id="mp4_src" src="' + this.videourl + '" type="video/mp4">'
        } else {
          // inner server video
          videoHtml += '<source id="mp4_src" src="/static/video/' + this.videoid + '.mp4" type="video/mp4">'
        }
        // videoHtml += '<source id="ogg_src" src="http://www.w3school.com.cn//example/html5/mov_bbb.ogg" type="video/ogg">'
        videoHtml += 'Your browser does not support HTML5 video'
        videoHtml += '</video>'
        $('.box-video').append(videoHtml)
      }
    },

    checkVideoParams () {
      let _this = this
      if (document.querySelector('#video').readyState === 0) {
        // video not loaded yet, check later again
        setTimeout(function () {
          _this.checkVideoParams()
        }, 100)
      } else {
        // video loaded yet, save params
        this.duration = Math.floor(document.querySelector('#video').duration)
        if (this.duration) {
          // 视频总时长已经有了，计算获得合适的jump time
          this.jumpTime = Math.floor(this.duration / 4)

          this.tc_updateTime = setInterval(function () {
            _this.updateCurrentTime()
          }, 200)
        }
      }
    },

    // 更新当前播放时间
    updateCurrentTime () {
      if (document.querySelector('#video')) {
        // 更新当前播放时间
        this.time = document.querySelector('#video').currentTime
      }
    },

    // load or reload
    load () {
      document.querySelector('#video').load()
    },

    // play
    play () {
      document.querySelector('#video').play()
    },

    // pause
    pause () {
      document.querySelector('#video').pause()
    },

    // toggle controls
    toggleControls () {
      document.querySelector('#video').controls = !document.querySelector('#video').controls
    },

    // show current play time
    showTime () {
      this.time = document.querySelector('#video').currentTime
    },

    // jump to some time and play
    jump (jumpTime) {
      jumpTime !== undefined && jumpTime != null ? jumpTime : jumpTime = parseInt(Math.abs(this.jumpTime))
      document.querySelector('#video').currentTime = jumpTime
    },

    // fast scroll forward
    scroll (scrollTime) {
      scrollTime = scrollTime || this.scrollTime
      document.querySelector('#video').currentTime += scrollTime
    },

    // scroll backward
    scrollBack (scrollTime) {
      scrollTime = scrollTime || this.scrollTime
      document.querySelector('#video').currentTime -= scrollTime
    },

    // toggle mute
    toggleMute () {
      document.querySelector('#video').muted = !document.querySelector('#video').muted
    },

    // fix time(s) into human time(H:m:s)
    fixTimeFormat (time) {
      time = parseInt(time)
      let minutes = Math.floor(time / 60)
      let seconds = time % 60
      let hours = Math.floor(minutes / 60)
      minutes = minutes % 60

      // fill final time string
      let humanTimeStr = ''
      hours > 0 ? humanTimeStr += hours + 'h' : humanTimeStr
      minutes > 0 ? humanTimeStr += minutes + 'm' : humanTimeStr
      isNaN(seconds) ? seconds = 0 : seconds
      humanTimeStr += seconds + 's'
      return humanTimeStr
    }
  },
  mounted () {
    this.createVideo()

    this.checkVideoParams()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.bar {
  background-color: rgb(238,238,238);
}

.bar-ongoing {
  /*width: 20%;*/
  height: 36px;
  line-height: 36px;
  /*padding-right: 6px;*/

  color: rgb(39,77,68);
  background-color: rgb(143,198,255);
  text-align: right;
  font-size: 24px;

  transition: width .2s;
  -moz-transition: width .2s;	/* Firefox 4 */
  -webkit-transition: width .2s;	/* Safari 和 Chrome */
  -o-transition: width .2s;	/* Opera */
}

.box-tip {
  margin: 12px 0 36px;
}

.box-panel {
  margin-bottom: 24px;
}

.jump-time {
  width: 120px;
}
</style>
