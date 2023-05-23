<template>
  <main class="c-site-main u-bgc-secondary u-height-100vh">
    <div class="u-pt-20 u-pb-20">
      <div class="l-wrap">
        <!-- PAGE TITLE -->
        <h2 class="u-fs-22 u-mb-20">Programs</h2>
        <div class="l-flex u-ai-start u-jc-sb">
          <!-- PROGRAM TOP BAR -->
          <div class="l-program-topbar u-mb-24">
            <!-- PROGRAM SEARCH BAR -->
            <div
              class="c-program-search-bar l-program-topbar__search u-mr-8"
              :class="userIsAppOwner() ? 'ao-search-margin' : ''"
            >
              <programs-search-bar :search-terms="searchTerms" @search-terms-submit="onSearchTermsSubmit" />
            </div>

            <!-- PROGRAM FILTER BAR -->
            <div class="l-program-topbar__filter" v-if="this.userIsProgramManager() || this.userIsResearcher()">
              <!-- program type dropdown -->
              <Dropdown
                :selectOptions="programTypeFilterOptions"
                :selectedOption="selectedProgramFilterOption"
                @on-select="onProgramOptionSelected"
                :placeholder="'Program Types'"
              />
            </div>
          </div>
          <div class="u-d-f u-jc-fe">
            <!-- ADD NEW PROGRAM BUTTON -->
            <div class="u-text-right-at-768">
              <button
                type="button"
                class="o-btn o-btn--sm o-btn--primary o-btn--rounded"
                @click="addProgramClick"
                v-if="showAddProgramButton"
              >
                <span>Add New Program</span>
              </button>
            </div>
          </div>
        </div>

        <!-- FEATURED PROGRAMS -->
        <div v-if="!userIsAppOwner() && featuredPrograms.length > 0">
          <h6 class="u-fs-14 o-text--500 u-mb-8">Featured</h6>
          <ul class="l-programs-grid u-mb-20">
            <!-- SINGLE PROGRAM -->
            <li
              v-for="(program, index) in featuredPrograms"
              :id="`${index === programs.length - 1 ? 'last-program' : `program-${index}`}`"
              :key="`program-${index}`"
            >
              <!-- PROGRAM CARD -->
              <program-card-item :program="program" v-show="!searchLoading" featured />
            </li>
            <!-- /.c-program-card -->
          </ul>
        </div>

        <!-- ALL PROGRAMS -->
        <ul class="l-programs-grid">
          <!-- SINGLE PROGRAM -->
          <li
            v-for="(program, index) in programs"
            :id="`${index === programs.length - 1 ? 'last-program' : `program-${index}`}`"
            :key="`program-${index}`"
          >
            <!-- PROGRAM CARD -->
            <program-card-item :program="program" v-show="!searchLoading" />
          </li>
          <!-- /.c-program-card -->
        </ul>
      </div>
      <!-- /.l-wrap -->
    </div>
  </main>
</template>

<script>
import ProgramCardItem from '@/modules/programs/_components/ProgramCardItem'
import ProgramsSearchBar from '@/modules/programs/_components/ProgramsSearchBar'
import { mapActions } from 'vuex'
import { STORE_KEY, GET_PROGRAMS, GET_FEATURED_PROGRAMS } from '@/modules/programs/_store/types'
import Dropdown from '@/modules/core/_components/drop-down/Dropdown'
import { clickOutside } from '@/directives/click-outside'
import { AccountMixin } from '@/mixins/account'
import { BreadcrumbsMixin } from '@/mixins/breadcrumbs'
import { HttpsMixin } from '@/mixins/https'
import store from '@/modules/programs/_store'
import debounce from 'lodash.debounce'

export default {
  name: 'Programs',
  components: {
    ProgramCardItem,
    ProgramsSearchBar,
    Dropdown,
  },
  directives: {
    clickOutside,
  },
  mixins: [AccountMixin, BreadcrumbsMixin, HttpsMixin],
  data() {
    return {
      programs: [],
      featuredPrograms: [],
      currentUrl: '',
      currentPage: 0,
      nextPageUrl: '',
      previousPageUrl: '',
      currentCount: 0,
      searchTerms: '',
      programsHeading: 'Featured Programs',
      searchLoading: false,
      selectedFilter: 'all',
      filters: {
        all: true,
        private: false,
        favorites: false,
      },
      selectedProgramFilterOption: { value: '' },
      programTypeFilterOptions: [
        { name: 'All', value: '' },
        { name: 'Private', value: 'private' },
        { name: 'Bookmarked', value: 'favorites' },
      ],
    }
  },
  computed: {
    showAddProgramButton() {
      return this.userIsProgramManager()
    },
  },
  methods: {
    ...mapActions(STORE_KEY, {
      getPrograms: GET_PROGRAMS,
      getFeaturedPrograms: GET_FEATURED_PROGRAMS,
    }),
    toggleFilter(filter) {
      this.filters[filter] = !this.filters[filter]
      const filters = Object.entries(this.filters).filter(([k, v]) => k !== filter)
      filters.forEach(([k, v]) => {
        this.filters[k] = false
      })
      this.onSearchTermsSubmit(this.searchTerms)
    },
    async loadFeaturedPrograms() {
      try {
        const { data } = await this.getFeaturedPrograms()
        this.featuredPrograms = data.results
      } catch (error) {}
    },
    async loadPrograms() {
      this.$solar.show()
      try {
        this.currentPage++
        const searchTerms = this.searchTerms
        const all = this.filters.all
        const privateOnly = this.filters.private
        const favorites = this.filters.favorites
        const queryParams = `search=${searchTerms}&all=${all}&private=${privateOnly}&favorites=${favorites}`

        const url = this.convertUrlToHttps(
          this.nextPageUrl || `${API_BASE_URL}/programs/short-list/?page=${this.currentPage}&${queryParams}`
        )
        this.currentUrl = url
        const response = await this.getPrograms(url)
        const data = response.data
        this.nextPageUrl = data.next
        this.previousPageUrl = data.previous
        this.currentCount = data.count
        const results = response.data.results

        for (let i = 0, len = results.length; i < len; i++) {
          let program = results[i]
          let existing = this.programs.findIndex((x) => x.uuid === program.uuid)
          if (existing === -1) {
            this.programs.push(program)
          }
        }
      } catch (e) {
        this.$caAlert.error('Failed to load programs')
      } finally {
        this.$solar.hide()
      }
    },
    async onSearchTermsSubmit(value) {
      this.searchTerms = value
      this.searchLoading = true
      this.programs = []
      this.nextPageUrl = ''
      this.previousPageUrl = ''
      this.currentCount = 0
      this.currentPage = 0

      await this.loadPrograms()
      setTimeout(async () => {
        this.programsHeading = this.searchTerms ? `Programs matching "${this.searchTerms}"` : 'Featured Programs'

        this.searchLoading = false
      }, 200)
    },
    async onScrollEvent() {
      let bottomOfWindow =
        document.documentElement.scrollTop + window.innerHeight >= document.documentElement.scrollHeight

      if (bottomOfWindow) {
        if (this.nextPageUrl && this.nextPageUrl !== this.currentUrl) {
          await this.loadPrograms()

          if (this.programs && this.programs.length > 0) {
            const el = '#last-program'

            this.$scrollTo(el, 500, {
              container: 'body',
              duration: 500,
              easing: 'ease',
              offset: 0,
              force: true,
              cancelable: true,
              onStart: false,
              onDone: false,
              onCancel: false,
              x: false,
              y: true,
            })
          }
        }
      }
    },
    addProgramClick() {
      this.$router.push({ name: 'ProgramCreate' })
    },
    onProgramOptionSelected(option) {
      this.selectedProgramFilterOption = option
      this.toggleFilter(option.value)
    },
  },
  async created() {
    if (!(STORE_KEY in this.$store._modules.root._children)) {
      this.$store.registerModule(STORE_KEY, store)
    }

    this.loadPrograms = debounce(this.loadPrograms, 400)
  },
  async mounted() {
    window.addEventListener('scroll', this.onScrollEvent)
    await this.loadPrograms()
    if (!this.userIsAppOwner()) {
      await this.loadFeaturedPrograms()
    }

    this.actionSetBreadcrumbs({
      parent: {
        route: this.$router.resolve({ name: 'Programs' }).route,
      },
      child: {},
    })
  },
  async destroyed() {
    window.removeEventListener('scroll', this.onScrollEvent)
  },
}
</script>
