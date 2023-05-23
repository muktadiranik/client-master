<template>
  <li class="item">
    <div class="content box u-p-0">
      <div class="head">
        <div class="brand">
          <div class="icon">
            <img :src="imageUrl" :alt="imageTitle" />
          </div>
          <div class="text">{{ title }}</div>
        </div>
        <p>{{ subTitle }}</p>
        <div class="bookmark">
          <i class="far fa-star" v-if="false"></i>
        </div>
      </div>
      <div class="body">
        <slot></slot>
      </div>
      <div class="foot">
        <p>{{ created }}</p>
        <p>{{ tag }}</p>
      </div>
    </div>
  </li>
</template>

<script>
export default {
  name: 'CaNewsFeedPost',
  props: {
    title: {
      type: String,
      default: '',
    },
    subTitle: {
      type: String,
      default: '',
    },
    body: {
      type: String,
      default: '',
    },
    created: {
      type: String,
      default: '',
    },
    tag: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      default: '/static/images/avatar-endpoint.svg',
    },
    imageTitle: {
      type: String,
      default: '',
    },
  },
  data() {
    return {}
  },
  computed: {},
}
</script>
