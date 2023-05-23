<template>
  <li class="activity-list__item">
    <div class="activity-list__item-content">
      <div class="activity-list__item-content-left">
        <div class="thumb">
          <img :src="message.profile_picture" />
        </div>
      </div>
      <div class="activity-list__item-content-right">
        <div class="activity-title">{{ message.owner }}</div>
        <div class="time">{{ message.created }}</div>
        <div class="activity-desc">{{ message.content }}</div>
      </div>
    </div>
  </li>
</template>
<script>
export default {
  name: 'ThreadMessage',
  components: {},
  props: {
    message: {
      attachment: null,
      content: '',
      date_created: '',
      date_modified: '',
      owner: '',
      profile_picture: '',
      uuid: '',
    },
  },
  data() {
    return {}
  },
  methods: {},
}
</script>
