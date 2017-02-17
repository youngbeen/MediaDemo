<template>
  <div class="bed-choosevideo">
    <div class="item-video" v-for="item in videoList" v-on:click="routeVideo(item)">
      <div class="video-title">
        {{  item.name }}
        <span class="video-tip">Duration: {{ item.duration }}s</span>
      </div>
      <div class="video-desc">
        {{ item.description }}
      </div>
    </div>
  </div>
</template>

<script>
import eventBus from '../EventBus'

export default {
  name: 'choose-video',
  data () {
    return {
      videoList: [
        {
          id: 'URL',
          url: 'http://www.w3school.com.cn/example/html5/mov_bbb.mp4',
          name: '测试外部URL视频',
          description: '测试短视频',
          duration: 10
        },
        {
          id: 'TEST1',
          url: '',
          name: 'Selenium IDE course',
          description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur praesentium voluptatum quo rem accusantium earum voluptate amet omnis debitis corporis, nulla aliquid pariatur ullam obcaecati optio accusamus numquam at beatae.',
          duration: 2117
        },
        {
          id: 'TEST2',
          url: '',
          name: 'TEST2',
          description: 'helowjeajo',
          duration: 0
        }
      ]
    }
  },
  methods: {
    routeVideo (videoItem) {
      if (videoItem.id) {
        eventBus.$emit('notifyPlayVideo', videoItem)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.bed-choosevideo {
  margin: 12px 24px;
}

.item-video {
  margin-bottom: 24px;
  padding: 24px 60px;

  color: white;
  background-color: rgb(79,119,199);
}

.video-title {
  text-align: left;
  font-weight: bold;
}

.video-tip {
  float: right;
  font-size: 24px;
}

.video-desc {
  text-align: left;
  font-size: 24px;
}
</style>
