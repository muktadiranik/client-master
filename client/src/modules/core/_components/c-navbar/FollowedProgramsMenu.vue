<template>
  <li class="c-sidebar__menu-item" v-if="followedPrograms">
    <a href="#" class="c-sidebar__menu-link" :class="submenuLinkClass" @click.stop="toggleExpanded">
      <span class="c-sidebar__menu-link-icon">
        <i class="fal fa-tasks"></i>
      </span>
      <span class="c-sidebar__menu-link-text">Favorites</span>
      <span class="c-sidebar__menu-link-icon-arrow">
        <i class="fal fa-angle-right" v-show="!followedProgramsLoading"></i>
        <i class="fal fa-spinner fa-spin" v-show="followedProgramsLoading"></i>
      </span>
    </a>
    <nav class="c-sidebar__submenu" :class="submenuClass">
      <ul class="c-sidebar__menu-list">
        <li
          class="c-sidebar__menu-item"
          v-for="(program, index) in followedPrograms"
          :key="`followed-program-${index}`"
        >
          <router-link
            :to="{ name: 'Program', params: { uuid: program.uuid } }"
            class="c-sidebar__menu-link c-sidebar__menu-link-program"
          >
            <span class="c-sidebar__menu-link-icon">
              <i class="fas fa-heart"></i>
            </span>
            <span class="c-sidebar__menu-link-text">{{ program.title }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </li>
</template>

<script>
import { AccountMixin } from '@/mixins/account'
import { FollowedProgramsMixin } from '@/mixins/followed-programs'

export default {
  name: 'FollowedProgramsMenu',
  components: {},
  mixins: [AccountMixin, FollowedProgramsMixin],
  data() {
    return { expanded: true }
  },
  computed: {
    submenuLinkClass() {
      return { 'is-active': this.expanded }
    },
    submenuClass() {
      return { 'is-visible': this.expanded }
    },
    toggleButtonClass() {
      return this.expanded ? 'fal fa-chevron-down' : 'fal fa-chevron-up'
    },
  },
  methods: {
    toggleExpanded() {
      if (this.followedProgramsLoading) {
        return
      }
      this.expanded = !this.expanded
    },
  },
  async mounted() {
    await this.actionLoadFollowedPrograms()
  },
}
</script>
