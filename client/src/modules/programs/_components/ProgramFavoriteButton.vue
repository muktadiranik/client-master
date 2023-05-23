<template>
  <div @click.prevent="followClick" class="c-program-bar__fav">
    <i :class="`${isFollowingProgram ? 'fas fa-bookmark' : 'fal fa-bookmark'}`"></i>
  </div>
</template>

<script>
import { AccountMixin } from '@/mixins/account'
import { FollowedProgramsMixin } from '@/mixins/followed-programs'

export default {
  name: 'ProgramFavoriteButton',
  components: {},
  mixins: [AccountMixin, FollowedProgramsMixin],
  props: {
    programUuid: {
      type: String,
      default: '',
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {
    followingIconClass() {
      return this.isFollowingProgram ? 'fas fa-star' : 'fal fa-star'
    },
    isFollowingProgram() {
      if (!this.followedPrograms) {
        return false
      }
      const existing = this.followedPrograms.find(x => x.uuid === this.programUuid)
      if (!existing) {
        return false
      }
      return existing !== undefined
    },
  },
  methods: {
    async followClick(event) {
      this.$solar.show()
      try {
        await this.actionToggleFollowing(this.programUuid)
      } catch (e) {
        this.$caAlert.error('Failed to update following preference.')
      } finally {
        this.$solar.hide()
      }
    },
  },
}
</script>

<style lang="scss">
@import '../../../scss/variables/_variables.scss';

.o-btn--bookmark {
  &:not(.is-active) {
    color: $primary-color;
    background-color: rgba($primary-color, 0.1);
  }

  &.is-active {
    color: #fff;
    background-color: $primary-color;
  }
}
</style>
