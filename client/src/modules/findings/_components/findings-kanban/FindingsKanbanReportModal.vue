<template>
  <div id="complete-submission-panel" class="c-modal" :class="{ 'u-hidden': !visible }">
    <div class="c-modal__inner">
      <h6 class="o-text--dark o-text--500 u-fs-18">Generate Compliance Report</h6>
      <div class="c-modal__close u-fs-20 u-cursor-pointer">
        <i class="fal fa-times" @click="cancelButtonClick"></i>
      </div>
      <div class="u-fs-12 u-mb-20" style="width: 237px; margin: 20px auto">
        Select the Endpoint and date range for your compliance report.
      </div>
      <form class="c-form" v-on:submit.prevent>
        <label class="c-form__label c-form__label--small" for="program"></label>
        <div class="l-grid">
          <div class="c-form__group" style="width: 237px; margin: 0 auto">
            <div class="c-dropdown c-dropdown--select" v-click-outside="hideDropdownMenu">
              <div
                class="c-dropdown__toggle o-btn o-btn--rounded o-btn--select"
                tabindex="0"
                :class="[{ 'is-open': expanded }]"
                @click="toggleDropdownMenu"
              >
                <span>{{ selectedEndpoint }}</span>
              </div>
              <ul class="c-dropdown__menu" :class="{ 'is-visible': expanded }">
                <li
                  class="u-text-center"
                  v-for="(program, index) in programs"
                  :key="`program-${index}`"
                  @click="selectEndpoint(program)"
                >
                  {{ program.title }}
                </li>
              </ul>
            </div>
          </div>
          <!-- <div class="c-form__group">
            <label class="c-form__label c-form__label--small" for="program">Report Template</label>
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
          </div> -->
          <div class="c-form l-findings-datepicker-bar u-flex-wrap u-jc-center u-mt-20 u-mb-25">
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
            <span class="o-text--dark o-text--500 u-ml-5 u-mr-5">-</span>
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
      <div class="c-modal__footer">
        <div class="u-flex-buttons u-jc-center">
          <!-- <button class="o-btn o-btn--outline o-btn--outline-primary o-btn--rounded-sm" @click="cancelButtonClick">
            <span>Cancel</span>
          </button> -->
          <button
            id="generate-button"
            type="button"
            class="o-btn o-btn--primary o-btn--rounded-sm"
            @click="generateReport"
            :disabled="generateReportDisabled"
          >
            <span>Export Report</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import ProgramService from '@/services/api/program-service'
import ReportingService from '@/services/api/reporting-service'
import { BreadcrumbsMixin } from '@/mixins/breadcrumbs'
import { clickOutside } from '@/directives/click-outside'

export default {
  name: 'GenerateReport',
  components: {
    Datepicker,
  },
  mixins: [BreadcrumbsMixin],
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  directives: {
    clickOutside,
  },
  data() {
    return {
      templates: [],
      programs: [],
      form: {
        // inspectiv exec template
        template_uuid: 'XGsKnFbghtKGRWGdni3CuM',
        program_uuid: '',
        start_date: new Date(),
        end_date: new Date(),
      },
      loading: false,
      selectedEndpoint: 'Select Endpoint',
      expanded: false,
    }
  },
  methods: {
    toggleDropdownMenu(event) {
      this.expanded = !this.expanded
    },
    hideDropdownMenu() {
      this.expanded = false
    },
    selectEndpoint(endpoint) {
      this.selectedEndpoint = endpoint.title
      this.form.program_uuid = endpoint.uuid
      this.expanded = false
    },
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

    initializeDateRanges() {
      const today = new Date()
      this.form.start_date = new Date()
      this.form.start_date.setDate(1)
      this.form.end_date = today
    },
    cancelButtonClick() {
      this.$emit('cancel-report-click')
    },
  },
  computed: {
    generateReportDisabled() {
      return !this.form.program_uuid
    },
  },
  async mounted() {
    this.initializeDateRanges()
    await this.loadProgramsList()
    // await this.initializeProgram()
  },
}
</script>
