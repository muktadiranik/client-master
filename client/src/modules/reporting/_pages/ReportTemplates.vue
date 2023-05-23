<template>
  <main class="c-site-main u-bgc-secondary u-height-100vh">
    <div class="u-pt-20 u-pb-20">
      <div class="l-wrap">
        <div class="l-flex u-ai-center u-jc-sb">
          <h6 class="o-h6">Reports</h6>
          <div class="u-flex-buttons">
            <button
              id="create-template-button"
              type="button"
              class="o-btn o-btn--sm o-btn--primary o-btn--rounded-sm"
              @click="createTemplateClick"
            >
              Create Template
            </button>
            <button
              id="generate-report-button"
              type="button"
              class="o-btn o-btn--sm o-btn--primary o-btn--rounded-sm"
              @click="generateReportClick"
            >
              Generate Report
            </button>
          </div>
        </div>
        <div class="u-mt-15">
          <div v-if="templates.length === 0">
            <div>No templates created yet.</div>
          </div>
          <ul v-if="templates.length > 0">
            <router-link
              tag="li"
              :to="{
                name: 'EditReportTemplate',
                params: { uuid: template.uuid },
              }"
              v-for="(template, index) in templates"
              :key="template + index"
            >
              <div class="u-bgc-white u-p-25 u-mb-8 u-box-shadow u-cursor-pointer o-text--dark l-flex u-ai-center">
                <i class="fal fa-file-alt u-fs-20 u-mr-12"></i>
                <span class="u-fs-16 o-text--500">{{ template.title }}</span>
              </div>
            </router-link>
          </ul>
        </div>
      </div>
      <!-- /.l-wrap -->
    </div>
    <generate-report v-if="modalOpen" :closeCallback="closeModal" />
  </main>
</template>

<script>
import { BreadcrumbsMixin } from '@/mixins/breadcrumbs'
import ReportingService from '@/services/api/reporting-service'
import GenerateReport from './GenerateReport.vue'

export default {
  components: { GenerateReport },
  name: 'ReportTemplates',
  mixins: [BreadcrumbsMixin],
  data() {
    return {
      templates: [],
      modalOpen: false
    }
  },
  computed: {},
  methods: {
    async createTemplateClick() {
      this.$router.push({ name: 'CreateReportTemplate' })
    },
    generateReportClick() {
      this.modalOpen = true
    },
    closeModal () {
      this.modalOpen = false
    },
    async loadReportTemplates() {
      let templates = []
      let page = 1

      let query = {
        page: page,
        all: true,
      }

      while (page >= 1) {
        try {
          query['page'] = page
          const response = await ReportingService.getReportTemplateList(query)
          const data = response.data
          page++
          templates = [...templates, ...data.results]

          if (!data.next) {
            break
          }
        } catch (e) {
          break
        }
      }

      return templates
    },
  },
  async mounted() {
    const templates = await this.loadReportTemplates()
    this.templates = templates

    this.actionSetBreadcrumbs({
      parent: {
        route: this.$router.resolve({ name: 'ReportTemplates' }).route,
        title: 'Reports',
      },
    })
  },
}
</script>
