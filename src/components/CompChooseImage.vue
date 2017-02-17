<template>
  <div class="bed-chooseimage">
    <div class="item-image" v-for="item in imageList" v-on:click="routeImage(item.id, item.pages)">
      <div class="image-title">
        {{  item.name }}
        <span class="image-tip">Pages: {{ item.pages }}</span>
      </div>
      <div class="image-desc">
        {{ item.description }}
      </div>
    </div>
  </div>
</template>

<script>
import eventBus from '../EventBus'

export default {
  name: 'choose-image',
  data () {
    return {
      imageList: [
        {
          id: 'TEST1',
          name: 'TEST1',
          description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur praesentium voluptatum quo rem accusantium earum voluptate amet omnis debitis corporis, nulla aliquid pariatur ullam obcaecati optio accusamus numquam at beatae.',
          pages: 11
        },
        {
          id: 'TEST2',
          name: '王小二的幸福生活',
          description: 'helowjeajo而骄傲了积分',
          pages: 0
        }
      ]
    }
  },
  methods: {
    routeImage (imageId, imagePages) {
      if (imageId) {
        eventBus.$emit('notifyPlayImage', { id: imageId, pages: imagePages })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.bed-chooseimage {
  margin: 12px 24px;
}

.item-image {
  margin-bottom: 24px;
  padding: 24px 60px;

  /*color: white;*/
  background-color: rgb(74,212,100);
}

.image-title {
  text-align: left;
  font-weight: bold;
}

.image-tip {
  float: right;
  font-size: 24px;
}

.image-desc {
  text-align: left;
  font-size: 24px;
}
</style>
