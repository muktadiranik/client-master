<template>
  <main class="c-site-main">
    <section class="section-program-summary">
      <div class="l-wrap" v-if="program && program.uuid">
        <div class="content-width">
          <div class="content-header-buttons">
            <div class="buttons">
              <button class="button outline" @click="reportVulnerability">
                <i class="far fa-plus left"></i>Report Vulnerability
              </button>
            </div>
          </div>
        </div>
        <div class="content-width box">
          <div class="content-header" :style="backdropStyle">
            <img :src="programImage" :alt="program.title" />
            <h1 v-if="program">{{ program.title }}</h1>
            <h4 v-if="companyName">
              <em>by</em>
              {{ companyName }}
            </h4>
          </div>
          <div class="content-copy">
            <div class="copy">
              <div class="markdown-content">
                <vue-markdown v-if="program && program.details" :source="program.details"></vue-markdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import { mapActions } from 'vuex'
import { STORE_KEY, GET_PROGRAM_PUBLIC } from '@/modules/programs/_store/types'
import store from '@/modules/programs/_store'
import { AccountMixin } from '@/mixins/account'

export default {
  name: 'ProgramDetails',
  components: {
    VueMarkdown,
  },
  mixins: [AccountMixin],
  data() {
    return {
      program: {},
    }
  },
  computed: {
    companyName() {
      return this.program && this.program.company_name ? this.program.company_name : ''
    },
    programImage() {
      return this.program.image || DEFAULT_PROGRAM_IMAGE
    },
    backdropStyle() {
      if (!this.program.color) {
        return {}
      }

      return {
        backgroundColor: `${this.programBackdropColor}`,
      }
    },
    programBackdropColor() {
      const hex = this.program.color.replace('#', '')
      const r = parseInt(hex.substring(0, 2), 16)
      const g = parseInt(hex.substring(2, 4), 16)
      const b = parseInt(hex.substring(4, 6), 16)
      return `rgba(${r}, ${g}, ${b}, .1)`
    },
  },
  methods: {
    ...mapActions(STORE_KEY, {
      getProgram: GET_PROGRAM_PUBLIC,
    }),
    reportVulnerability() {
      const authenticated = this.userIsAuthenticated()

      if (!authenticated) {
        this.$router.push({
          name: 'LogIn',
          params: { programUuid: this.program.uuid },
        })
      } else {
        const redirectPath = this.userIsResearcher()
          ? `/submissions/${this.program.uuid}/create`
          : `/programs/${this.program.uuid}`
        this.$router.push({ path: redirectPath })
      }
    },
    async loadProgram() {
      this.$solar.show()
      try {
        const response = await this.getProgram(this.$route.params.name)
        this.program = response.data
      } catch (e) {
        this.$caAlert.error('The requested program could not be found.')
      } finally {
        this.$solar.hide()
      }
    },
  },
  async mounted() {
    if (!(STORE_KEY in this.$store._modules.root._children)) {
      this.$store.registerModule(STORE_KEY, store)
    }

    await this.loadProgram()
  },
}
</script>
