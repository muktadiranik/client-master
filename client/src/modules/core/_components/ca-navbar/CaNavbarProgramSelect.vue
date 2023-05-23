<template>
  <ul class="c-submenu c-submenu--large programs-menu">
    <li class="c-submenu__item" v-for="program in filteredNavbarPrograms" :key="`navbar-program-${program.uuid}`">
      <router-link class="c-submenu__text" :to="{ name: 'Program', params: { uuid: program.uuid } }">{{
        program.title
      }}</router-link>
    </li>
    <li class="c-submenu__item load-more" v-show="navbarProgramsQuery.next">
      <span class="c-submenu__text" @click.stop="actionLoadProgramsListForNavbar">Load More</span>
    </li>
  </ul>
</template>

<script>
import { NavbarMixin } from '@/mixins/navbar'

export default {
  name: 'CaNavbarProgramSelect',
  mixins: [NavbarMixin],
  data() {
    return {
      notificationsListVisible: false,
      showProfileMenu: false,
      showProgramMenu: false,
      isMobile: false,
    }
  },
  async mounted() {
    await this.actionLoadProgramsListForNavbar()
  },
}
</script>
