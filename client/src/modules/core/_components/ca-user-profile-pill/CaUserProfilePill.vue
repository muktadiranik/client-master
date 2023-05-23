<template>
  <div class="researcher-media">
    <img class="researcher-media__image" :src="profile.profile_picture || defaultUserAvatar" :alt="profile.username" />
    <div class="researcher-media__text">
      <div>
        <template v-if="fullName">{{ fullName }}</template>
        <span class="user-name">{{ profile.user_name || profile.username }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CaUserProfilePill',
  props: {
    profile: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  data() {
    return {
      defaultUserAvatar: DEFAULT_USER_IMAGE,
    }
  },
  computed: {
    fullName() {
      if (!this.profile || !this.profile.first_name) {
        return ''
      }
      if (!this.profile.last_name) {
        return `${this.profile.first_name}`
      }

      return `${this.profile.first_name} ${this.profile.last_name}`
    },
  },
}
</script>
