<template>
  <main class="c-site-main">
    <div class="u-pt-20 u-pb-20">
      <div class="l-wrap">
        <button
          @click="cancel"
          class="u-ml--16 u-mb-20 o-btn o-btn--primary-light o-btn--rounded o-btn--sm u-d-if u-ai-center"
        >
          <i class="fal fa-arrow-left o-btn--icon-sm"></i>
          Back
        </button>
        <div class="u-width-50">
          <h6 class="o-h6 u-mb-20">Create Template</h6>
          <h6 class="u-fs-14 o-text--500 o-text--dark u-mb-15">Template settings</h6>
          <div class="l-stack l-stack--form">
            <div class="c-form__group">
              <label for="cover-title" class="c-form__label c-form__label--small u-mb-15 u-maxw-200-at-768"
                >Template Cover Image</label
              >
              <div class="o-upload-photo o-upload-photo--lg">
                <input
                  class="u-hide-input"
                  type="file"
                  id="upload_photo"
                  accept="image/*"
                  ref="attachment"
                  @change="handlePhotoChange($event)"
                />
                <label for="upload_photo" class="o-upload-photo__label">
                  <img :src="form.attachment || defaultCoverImage" />
                </label>
              </div>
            </div>
            <div class="c-form__group">
              <label
                for="report-template-cover-title"
                class="c-form__label c-form__label--small u-maxw-200-at-768 u-m-0 u-height-sm-at-768 u-d-f u-ai-center"
                >Cover Title</label
              >
              <input
                class="o-input"
                type="text"
                v-model="form.coverTitle"
                id="report-template-cover-title"
                placeholder="Cover Title"
                name="report_template_cover_title"
              />
            </div>
            <div class="c-form__group">
              <label
                for="report-template-title"
                class="c-form__label c-form__label--small u-maxw-200-at-768 u-m-0 u-height-sm-at-768 u-d-f u-ai-center"
                >Template Name</label
              >
              <input
                class="o-input"
                type="text"
                v-model="form.templateTitle"
                id="report-template-title"
                placeholder="Template name"
                name="report_template_title"
              />
            </div>
            <div class="c-form__group">
              <label class="c-form__label c-form__label--small u-maxw-200-at-768 u-m-0 u-hidden-below-768"
                >&nbsp;</label
              >
              <div class="o-custom-checkbox">
                <input
                  class="o-custom-checkbox__input u-hide-input"
                  type="checkbox"
                  id="show-detailed-findings"
                  :checked="form.showDetailedFindings"
                  :value="form.showDetailedFindings"
                  @click="onShowDetailedFindingsToggle"
                />
                <label
                  for="show-detailed-findings"
                  class="c-form__label c-form__label--small o-custom-checkbox__label u-m-0"
                  >Show Detailed Findings</label
                >
              </div>
            </div>
          </div>
          <div class="u-mb-45">
            <h6 class="u-fs-14 o-text--500 u-mb-15">Permissions</h6>
            <div>
              <div class="u-mb-10">
                <input
                  class="o-custom-checkbox"
                  type="checkbox"
                  id="all-programs"
                  :checked="form.allPrograms"
                  :value="form.allPrograms"
                  @click="onAllProgramsToggle"
                />
                <label for="all-programs" class="c-form__label c-form__label--small u-m-0 o-custom-checkbox__label"
                  >All Programs</label
                >
              </div>
              <ReportingProgramSearch
                v-if="!form.allPrograms"
                :search-terms="programSearch.searchTerms"
                :show-search-results="programSearch.showSearchResults"
                :programs="programs"
                :selected-programs="form.selectedPrograms"
                @on-toggle-program-selected="onToggleProgramSelected"
                @on-program-search-input="onProgramSearchInput"
              />
            </div>
            <div>
              <div>
                <input class="o-custom-checkbox" type="checkbox" id="internal-checkbox" v-model="form.internal" />
                <label for="internal-checkbox" class="c-form__label c-form__label--small o-custom-checkbox__label"
                  >Internal Use Only</label
                >
              </div>
            </div>
          </div>
          <div>
            <div class="u-space-between u-ai-center">
              <h6 class="u-fs-14 o-text--500 u-mb-15">Template Pages</h6>
              <button
                class="o-btn o-btn--sm o-btn--outline-primary o-btn--rounded-sm"
                @click="showLegend = !showLegend"
              >
                <span>Available Keywords</span>
              </button>
            </div>
            <div>
              <ul class="c-template-pages-list">
                <li
                  class="l-grid l-grid--row-gap-20"
                  v-for="(section, index) in form.reportSections"
                  :key="`section-${index}`"
                >
                  <div class="c-form__group">
                    <label
                      :for="`section-title-${index}`"
                      class="c-form__label c-form__label--small u-maxw-200-at-768 u-m-0 u-height-sm-at-768 u-d-f u-ai-center"
                      >Page Title</label
                    >
                    <input
                      class="o-input"
                      type="text"
                      v-model="section.title"
                      :id="`section-title-${index}`"
                      placeholder="Page Title"
                      :name="`section-title-${index}`"
                    />
                  </div>
                  <div class="c-form__group">
                    <label
                      :for="`section-body-${index}`"
                      class="c-form__label c-form__label--small u-maxw-200-at-768 u-m-0 u-height-sm-at-768 u-d-f u-ai-center"
                      >Page Details</label
                    >
                    <div class="u-mb-20">
                      <markdown-editor
                        :id="`section-body-${index}`"
                        :name="`section-body-${index}`"
                        v-model="section.body"
                      />
                      <div class="u-mt-10">
                        <div class="u-d-f u-jc-fe">
                          <button
                            class="o-btn o-btn--sm o-btn--outline-primary o-btn--rounded-s u-mr-8"
                            @click="removeSection(index)"
                          >
                            <span>Remove Page</span>
                          </button>
                          <button class="o-btn o-btn--sm o-btn--primary o-btn--rounded-sm" @click="addNewSection">
                            <span>Add Page</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <h6 class="u-fs-14 o-text--500 u-mb-15">Templates</h6>
            <div class="l-grid l-grid--row-gap-20">
              <div>
                <CodeEditor
                  title="Cover"
                  :code="form.templateCover"
                  field-name="templateCover"
                  @on-code-updated="codeUpdated"
                />
              </div>
              <div>
                <CodeEditor
                  title="Body"
                  :code="form.templateBody"
                  field-name="templateBody"
                  @on-code-updated="codeUpdated"
                />
              </div>
              <div>
                <CodeEditor
                  title="Table"
                  :code="form.templateTable"
                  field-name="templateTable"
                  @on-code-updated="codeUpdated"
                />
              </div>
              <div>
                <CodeEditor
                  title="Detailed Findings"
                  :code="form.templateDetailedFindings"
                  field-name="templateDetailedFindings"
                  @on-code-updated="codeUpdated"
                />
              </div>
            </div>
          </div>
          <footer class="u-mt-25">
            <div class="u-d-f">
              <button
                id="submit-finding-button"
                type="button"
                class="o-btn o-btn--sm o-btn--outline-primary o-btn--rounded u-mr-8"
                @click="cancel"
              >
                <span>Cancel</span>
              </button>
              <button
                id="submit-finding-button"
                type="button"
                class="o-btn o-btn--sm o-btn--primary o-btn--rounded"
                @click="onSaveClick"
              >
                <span>Save</span>
              </button>
            </div>
          </footer>
          <div v-if="showLegend">
            <KeywordLegend :visible="showLegend" @on-close-legend="showLegend = false" />
          </div>
        </div>
        <!-- /.l-wrap -->
      </div>
    </div>
  </main>
</template>

<script>
import { AccountMixin } from '@/mixins/account'
import { BreadcrumbsMixin } from '@/mixins/breadcrumbs'
import ProgramService from '@/services/api/program-service'
import ReportingService from '@/services/api/reporting-service'
import ReportingProgramSearch from '@/modules/reporting/_components/ReportingProgramSearch'
import CodeEditor from '@/modules/reporting/_components/CodeEditor'
import KeywordLegend from '@/modules/reporting/_components/KeywordLegend'

export default {
  name: 'CreateReportTemplate',
  components: {
    CodeEditor,
    ReportingProgramSearch,
    KeywordLegend,
  },
  mixins: [AccountMixin, BreadcrumbsMixin],
  data() {
    return {
      defaultCoverImage: DEFAULT_TEMPLATE_IMAGE,
      programs: [],
      template: {},
      templateUuid: '',
      form: {
        allPrograms: true,
        attachment: null,
        coverTitle: '',
        filename: '',
        internal: false,
        reportSections: [
          {
            uuid: '',
            title: '',
            body: '',
          },
        ],
        selectedPrograms: [],
        showDetailedFindings: false,
        templateBody: '',
        templateDetailedFindings: '',
        templateTable: '',
        templateCover: '',
        templateTitle: '',
      },
      programSearch: {
        searchTerms: '',
        page: 1,
        showSearchResults: false,
      },
      showLegend: false,
    }
  },
  computed: {},
  methods: {
    cancel() {
      this.$router.go(-1)
    },
    addNewSection() {
      this.form.reportSections.push({ uuid: '', title: '', body: '' })
    },
    removeSection(index) {
      this.form.reportSections.splice(index, 1)
    },
    reIndexReportSections() {
      for (let i = 0, len = this.form.reportSections.length; i < len; i++) {
        this.form.reportSections[i]['position'] = i
      }
    },
    getTemplateForm() {
      this.reIndexReportSections()
      const form = this.form
      return {
        title: form.templateTitle,
        cover_title: form.coverTitle,
        attachment: form.attachment,
        filename: form.filename,
        include_all_programs: form.allPrograms,
        internal: form.internal,
        show_detailed_findings: form.showDetailedFindings,
        program_uuids: form.selectedPrograms.map((x) => x.uuid),
        report_sections: form.reportSections,
        template_body: form.templateBody,
        template_cover: form.templateCover,
        template_table: form.templateTable,
        template_detailed_findings: form.templateDetailedFindings,
      }
    },
    codeUpdated(fieldName, code) {
      this.form[fieldName] = code
    },
    onAllProgramsToggle() {
      this.form.allPrograms = !this.form.allPrograms
      if (this.form.allPrograms) {
        this.programs = []
        this.programSearch.showSearchResults = false
        this.programSearch.searchTerms = ''
        this.form.selectedPrograms = []
      }
    },
    onShowDetailedFindingsToggle() {
      this.form.showDetailedFindings = !this.form.showDetailedFindings
    },
    handlePhotoChange(e) {
      const file = e.target.files[0] || null
      if (!file || !file.name || !/\.(jpe?g|png|gif)$/i.test(file.name)) {
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        this.form.attachment = reader.result
        this.form.filename = file.name
      }

      reader.readAsDataURL(file)
    },
    async onProgramSearchInput(val) {
      this.programSearch.searchTerms = val
      if (!val) {
        this.programSearch.showSearchResults = false
        this.programs = []
        return
      }

      const response = await ProgramService.getShortProgramsList(
        this.programSearch.page,
        this.programSearch.searchTerms
      )
      this.programs = response.data.results
      this.programSearch.showSearchResults = true
    },
    async onSaveClick() {
      try {
        const payload = this.getTemplateForm()
        if (this.templateUuid) {
          const response = await ReportingService.editReportTemplate(this.templateUuid, payload)
          this.template = response.data
          this.resetForm()
          this.$caAlert.success('Report Template updated.')
        } else {
          const response = await ReportingService.createReportTemplate(payload)
          const template = response.data
          this.$caAlert.success('Report Template created.')
          this.$router.push({
            name: 'EditReportTemplate',
            params: { uuid: template.uuid },
          })
        }
      } catch (e) {
        const error = e && e.data && e.data.error ? e.data.error : 'Failed to create report template'
        this.$caAlert.error(error)
      }
    },
    onToggleProgramSelected(program) {
      const existingIndex = this.form.selectedPrograms.findIndex((x) => x.uuid === program.uuid)
      if (existingIndex >= 0) {
        this.form.selectedPrograms.splice(existingIndex, 1)
      } else {
        this.form.selectedPrograms.push(program)
      }
    },
    resetForm() {
      this.form = {
        allPrograms: this.template.include_all_programs,
        showDetailedFindings: this.template.show_detailed_findings,
        coverTitle: this.template.cover_title || '',
        attachment: this.template.attachment_url || null,
        filename: '',
        internal: this.template.internal || false,
        templateTitle: this.template.title || '',
        selectedPrograms: this.template.included_programs_display || [],
        reportSections: (
          this.template.report_sections || [
            {
              uuid: '',
              title: '',
              body: '',
            },
          ]
        ).sort((a, b) => (a.position > b.position ? 1 : -1)),
        templateCover: this.template.template_cover || '',
        templateBody: this.template.template_body || '',
        templateTable: this.template.template_table || '',
        templateDetailedFindings: this.template.template_detailed_findings || '',
      }
    },
    async initializeWithTemplate() {
      const uuid = this.$route.params.uuid
      if (!uuid || uuid === 'create') {
        return
      }
      this.templateUuid = uuid

      this.$solar.show()

      try {
        const response = await ReportingService.getReportTemplate(uuid)
        this.template = response.data
        this.resetForm()
      } catch (e) {
        this.$caAlert.error('Failed to load report template.')
      } finally {
        this.$solar.hide()
      }
    },
  },
  async mounted() {
    await this.initializeWithTemplate()

    this.actionSetBreadcrumbs({
      parent: {
        route: this.$router.resolve({ name: 'ReportTemplates' }).route,
        title: 'Reports',
      },
      child: {
        route: this.$route,
        title: this.template.title,
        copyValue: this.template.uuid,
      },
    })
  },
}
</script>
