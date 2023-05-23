<template>
  <li
    class="c-navbar__menu-item"
    v-if="followedPrograms"
    :class="isPage('programs') ? 'c-navbar__menu-item--active' : ''"
  >
    <a href="#/programs" class="c-navbar__menu-link" :class="submenuLinkClass">
      <span class="c-navbar__menu-link-text">Programs</span>
    </a>
    <nav class="c-navbar__submenu" :class="submenuClass" v-show="false">
      <ul class="c-navbar__menu-list">
        <li
          class="c-navbar__menu-item"
          v-for="(program, index) in followedPrograms"
          :key="`followed-program-${index}`"
        >
          <router-link
            :to="{ name: 'Program', params: { uuid: program.uuid } }"
            class="c-navbar__menu-link c-navbar__menu-link-program"
          >
            <!-- <span class="c-navbar__menu-link-icon">
              <i class="fal fa-bookmark"></i>
            </span> -->
            <span class="c-navbar__menu-link-text">{{ program.title }}</span>
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
  name: 'AllProgramsMenu',
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
      return this.expanded ? 'far fa-chevron-down' : 'far fa-chevron-up'
    },
  },
  methods: {
    // toggleExpanded() {
    //   if (this.followedProgramsLoading) {
    //     return
    //   }
    //   this.expanded = !this.expanded
    // },
    isPage(str) {
      const path = this.$route.path
      return path.toLowerCase().includes(str.toLowerCase())
    },
  },
  async mounted() {
    await this.actionLoadFollowedPrograms()
  },
}
</script>
