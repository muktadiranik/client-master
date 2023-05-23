<template>
  <div class="c-modal">
    <div class="c-modal__inner">
      <h6 class="u-fs-18">Generate Report</h6>
      <div class="c-modal__close" @click="closeCallback">
        <i class="fal fa-times u-font-150 u-cursor-pointer"></i>
      </div>

      <!-- /.c-modal__header -->
      <div class="c-modal__body">
        <div>
          <div class="u-mb-20">
            <span>Select the Program and date range for your compliance report.</span>
          </div>
          <form class="c-form" v-on:submit.prevent>
            <div class="l-stack l-stack--form">
              <div class="c-form__group">
                <div class="c-select-container">
                  <select
                    class="o-input o-input--select"
                    id="program"
                    name="program"
                    v-model="form.program_uuid"
                    :disabled="loading"
                    @change="onProgramSelectChange($event)"
                  >
                    <option value>Select a program...</option>
                    <option v-for="(program, index) in programs" :key="`program-${index}`" :value="program.uuid">
                      {{ program.title }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="c-form__group">
                <div class="c-select-container">
                  <select
                    class="o-input o-input--select"
                    id="program"
                    name="program"
                    v-model="form.template_uuid"
                    :disabled="loading || !form.program_uuid"
                  >
                    <option>Select a Report Template...</option>
                    <option v-for="(template, index) in templates" :key="`template-${index}`" :value="template.uuid">
                      {{ template.title }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="l-stack l-stack--form l-stack--two-col">
                <div class="c-form__group">
                  <div class="c-input-icon c-input-icon--padding-sm">
                    <datepicker
                      type="text"
                      wrapper-class="c-cesppa-calendar-container"
                      calendar-class="c-cesppa-calendar"
                      input-class="o-input o-input--sm"
                      id="startDate"
                      placeholder="Choose a date"
                      :value="form.start_date"
                      :name="'startDate'"
                      :use-utc="true"
                      @selected="startDateSelected"
                    ></datepicker>
                    <i class="fal fa-calendar-alt c-input-icon__element"></i>
                  </div>
                </div>
                <div class="c-form__group">
                  <div class="c-input-icon c-input-icon--padding-sm">
                    <datepicker
                      wrapper-class="c-cesppa-calendar-container"
                      calendar-class="c-cesppa-calendar"
                      input-class="o-input o-input--sm"
                      type="text"
                      id="endDate"
                      placeholder="Choose a date"
                      :value="form.end_date"
                      :name="'endDate'"
                      :use-utc="true"
                      @selected="endDateSelected"
                    ></datepicker>
                    <i class="fal fa-calendar-alt c-input-icon__element"></i>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <!-- /.c-modal__body -->
      <div class="c-modal__footer">
        <div class="u-flex-buttons u-jc-center">
          <button class="o-btn o-btn--sm o-btn--primary o-btn--rounded-sm" @click.prevent="generateReport">
            Generate Report
          </button>
        </div>
      </div>
      <!-- /.c-modal__footer -->
    </div>
    <!-- /.c-modal__inner -->
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import ProgramService from '@/services/api/program-service'
import ReportingService from '@/services/api/reporting-service'
import { BreadcrumbsMixin } from '@/mixins/breadcrumbs'

export default {
  name: 'GenerateReport',
  components: {
    Datepicker,
  },
  mixins: [BreadcrumbsMixin],
  data() {
    return {
      templates: [],
      programs: [],
      form: {
        template_uuid: '',
        program_uuid: '',
        start_date: new Date(),
        end_date: new Date(),
      },
      loading: false,
      reportForm: '<h1>test html variable</h1>',
    }
  },
  props: {
    closeCallback: {
      type: Function,
      default: () => {},
      required: true,
    },
  },
  methods: {
    startDateSelected(date) {
      this.form.start_date = date
    },
    endDateSelected(date) {
      this.form.end_date = date
    },
    async generateReport() {
      try {
        const response = await ReportingService.generateReport(this.form)
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'report.pdf')
        document.body.appendChild(link)
        link.click()
        this.$caAlert.success('Report generated')
      } catch (e) {
        const error = e && e.data && e.data.error ? e.data.error : 'Failed to generate report'
        this.$caAlert.error(error)
      }
    },
    async onProgramSelectChange() {
      this.loading = true
      this.$solar.show()
      try {
        this.templates = await this.loadReportTemplates()
      } catch (e) {
        const error = e && e.data && e.data.error ? e.data.error : 'Failed to load report templates'
        this.$caAlert.error(error)
      } finally {
        this.loading = false
        this.$solar.hide()
      }
    },
    async loadReportTemplates() {
      let templates = []
      let page = 1
      const programUuid = this.form.program_uuid

      while (page >= 1) {
        try {
          const response = await ReportingService.getReportTemplateList({
            page,
            programUuid,
          })
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
    async getProgramsList() {
      let page = 1
      let programs = []

      while (page >= 1) {
        try {
          const response = await ProgramService.getShortProgramsList(page)
          const data = response.data
          page++
          programs = [...programs, ...data.results]

          if (!data.next) {
            break
          }
        } catch (e) {
          break
        }
      }

      return programs
    },
    async loadProgramsList() {
      this.loading = true
      this.$solar.show()
      try {
        const programs = await this.getProgramsList()
        this.programs = programs
      } catch (e) {
        const error = e && e.data && e.data.error ? e.data.error : 'Failed to create report template'
        this.$caAlert.error(error)
      } finally {
        this.loading = false
        this.$solar.hide()
      }
    },
    async initializeProgram() {
      const programUuid = this.$route.params.programUuid
      if (!programUuid) {
        return
      }

      this.form.program_uuid = programUuid
      await this.onProgramSelectChange()
    },
    initializeDateRanges() {
      const today = new Date()
      this.form.start_date = new Date()
      this.form.start_date.setDate(1)
      this.form.end_date = today
    },
  },
  async mounted() {
    this.initializeDateRanges()
    await this.loadProgramsList()
    await this.initializeProgram()

    this.actionSetBreadcrumbs({
      parent: {
        route: this.$router.resolve({ name: 'ReportTemplates' }).route,
        title: 'Reports',
      },
      child: {
        title: 'New',
      },
    })
  },
}
</script>
