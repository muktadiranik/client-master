<template>
  <main class="c-site-main">
    <section class="u-pt-20 u-pb-20">
      <div class="l-wrap l-wrap--700">
        <div class="c-box">
          <div class="c-box__header l-grid l-grid--row-gap-15 u-d-f-at-500 u-ai-center u-jc-sb-at-500">
            <div class="c-media">
              <img class="c-media__img u-br-3" :src="programImage" :alt="program.title" />
              <div class="c-media__body">
                <h6 class="o-h6" v-if="program">{{ program.title }}</h6>
                <p v-if="companyName" class="o-text o-text--sm u-text-mute u-m-0">
                  <em>by</em>
                  {{ companyName }}
                </p>
              </div>
            </div>
            <button type="button" class="o-btn o-btn--sm o-btn--coolgrey o-btn--rounded-sm" @click="backClick">
              <i class="far fa-chevron-left u-mr-10"></i>
              <span>Back to Edit</span>
            </button>
          </div>
          <!-- /.c-box__header -->
          <div class="c-box__body">
            <div class="c-markdown-content">
              <vue-markdown v-if="program && program.details" :source="program.details"></vue-markdown>
            </div>
          </div>
          <!-- /.c-box__body -->
          <div class="c-box__footer u-d-f u-jc-fe">
            <button
              type="button"
              class="o-btn o-btn--sm u-pr-30 u-pl-30 o-btn--primary o-btn--rounded-sm"
              @click="saveProgramClick"
              v-dynamic-color
            >
              <span>Save Program</span>
            </button>
          </div>
        </div>
        <!-- /.c-box -->
      </div>
      <!-- /.l-wrap -->
    </section>
  </main>
</template>

<script>
import { mapActions } from 'vuex'
import { STORE_KEY, CREATE_PROGRAM, EDIT_PROGRAM } from '@/modules/programs/_store/types'

import VueMarkdown from 'vue-markdown'
import { AccountMixin } from '@/mixins/account'
import { BreadcrumbsMixin } from '@/mixins/breadcrumbs'
import { ColorMixin } from '@/mixins/colors'
import { dynamicColor } from '@/directives/dynamic-color'
import { NavbarMixin } from '@/mixins/navbar'

export default {
  name: 'ProgramEditPreview',
  components: {
    VueMarkdown,
  },
  directives: { dynamicColor },
  mixins: [AccountMixin, BreadcrumbsMixin, ColorMixin, NavbarMixin],
  props: {
    program: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {}
  },
  computed: {
    companyName() {
      return this.program && this.program.company_name ? this.program.company_name : ''
    },
    programImage() {
      return this.program.attachment || this.program.image || DEFAULT_PROGRAM_IMAGE
    },
    headerBackgroundStyle() {
      if (!this.program || !this.program.color) {
        return {}
      }
      return this.getBackgroundStyle(this.program.color)
    },
    headerClass() {
      return (this.getUserType() || '').replace('_', '-')
    },
  },
  methods: {
    ...mapActions(STORE_KEY, {
      editProgram: EDIT_PROGRAM,
      createProgram: CREATE_PROGRAM,
    }),
    backClick() {
      const isNewProgram = !this.$route.params.uuid && !this.program.uuid
      let route = {
        name: isNewProgram ? 'ProgramCreate' : 'ProgramEdit',
        params: {
          previewedProgram: this.program,
        },
      }

      if (!isNewProgram) {
        route.params['uuid'] = this.$route.params.uuid || this.program.uuid
      }

      this.$router.push(route)
    },
    async saveProgramClick() {
      if (!this.program.uuid) {
        await this.saveNewProgram()
      } else {
        await this.saveExistingProgram()
      }
    },
    async saveNewProgram() {
      try {
        this.$solar.show()
        let payload = {
          ...this.program,
        }

        payload.color = payload.color ? `#${payload.color}` : null
        const response = await this.createProgram(payload)
        const createdProgram = response.data

        this.$caAlert.success('This program has been created.')
        this.$router.push({
          name: 'Program',
          params: { uuid: createdProgram.uuid },
        })
      } catch (e) {
        const msg = e && e.data && e.data.error ? e.data.error : 'Failed to create program'
        this.$caAlert.error(msg)
      } finally {
        this.$solar.hide()
      }
    },
    async saveExistingProgram() {
      try {
        this.$solar.show()
        let payload = {
          ...this.program,
        }

        if (payload.color && !payload.color.includes('#')) {
          payload.color = `#${payload.color}`
        }

        await this.editProgram(payload)

        this.$caAlert.success('This program has been saved.')
        this.$router.push({
          name: 'Program',
          params: { uuid: this.program.uuid },
        })
      } catch (e) {
        this.$caAlert.error('Failed to save program')
      } finally {
        this.$solar.hide()
      }
    },
  },
  async mounted() {
    if (!this.program) {
      this.$router.go(-1)
    }

    document.title = `Inspectiv | ${this.program.title}`
    await this.actionLoadProgramForNavbar(this.program)

    this.actionSetBreadcrumbs({
      parent: {
        route: this.$router.resolve({ name: 'Programs' }).route,
        title: 'Programs',
      },
      child: {
        route: this.$route,
        title: 'Program Preview',
        copyValue: this.program.uuid,
      },
    })
  },
}
</script>
