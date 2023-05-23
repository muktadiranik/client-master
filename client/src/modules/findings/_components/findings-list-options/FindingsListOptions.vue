<template>
  <div>
    <div class="u-mb-20">
      <div class="l-findings-list-options" v-if="showProgramSelector">
        <div class="l-wrap">
          <div class="l-flex u-jc-sb u-ai-center">
            <div class="l-flex l-findings-head u-width-full u-jc-sb">
              <div class="l-findings-program-selector u-mr-40 l-flex u-ai-center">
                <div class="c-dropdown c-dropdown--select" v-click-outside="hideDropdownMenu">
                  <div
                    class="c-dropdown__toggle o-btn o-btn--rounded o-btn--select"
                    tabindex="0"
                    :class="[{ 'is-open': expanded }]"
                    @click="toggleDropdownMenu"
                  >
                    <span>{{ selectedProgram.title }}</span>
                  </div>
                  <ul class="c-dropdown__menu" :class="{ 'is-visible': expanded }">
                    <!-- pm program search input -->
                    <div class="u-pl-10 u-pr-10 u-pb-5" v-if="this.userIsProgramManager()">
                      <input
                        class="o-input o-input--xs u-text-italic"
                        placeholder="Search endpoints..."
                        type="text"
                        v-model="pmEndpointSearch"
                      />
                    </div>
                    <li @click="selectProgram({ title: 'All Endpoints' })">
                      {{ programsLoading ? 'Endpoints loading...' : 'All Endpoints' }}
                    </li>
                    <li
                      v-for="(program, index) in filteredProgams"
                      :key="`program-${index}`"
                      @click="selectProgram(program)"
                    >
                      {{ program.title }}
                    </li>
                  </ul>
                </div>
                <button
                  title="Program Description"
                  v-if="selectedProgram.title && selectedProgram.title !== 'All Endpoints'"
                  class="u-ml-15 o-btn o-btn--lightgray o-btn--rounded o-btn--sm"
                >
                  <router-link
                    class="l-flex u-ai-center"
                    tag="div"
                    :to="{ name: 'Program', params: { uuid: selectedProgram.uuid } }"
                  >
                    <i class="program-details-icon fal fa-sliders-h o-btn--icon-sm"></i>
                    <span>Settings</span>
                  </router-link>
                </button>
              </div>
            </div>
          </div>
          <!-- /.c-box__body -->
        </div>
        <!-- /.c-box -->
      </div>

      <div class="l-wrap" v-if="findingsMessageBanner">
        <alert-message
          type="success"
          title="Congratulations! Your vulnerability scan is currently running in the background."
          message="You'll receive an email once account is approved and results are ready"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { FINDINGS_FILTER_OPTIONS } from '@/modules/findings/_models/findings-filter-options'
import { AccountMixin } from '@/mixins/account'
import { DatesMixin } from '@/mixins/dates'
import { ProgramsMixin } from '@/mixins/programs'
import { FeatureFlagsMixin } from '@/mixins/feature-flags'
import { clickOutside } from '@/directives/click-outside'
import ProgramsService from '@/services/api/program-service'
import AlertMessage from '@/modules/core/_components/c-alert-message/AlertMessage.vue'

export default {
  name: 'FindingsListOptions',
  components: {
    AlertMessage,
  },
  directives: {
    clickOutside,
  },
  mixins: [AccountMixin, DatesMixin, ProgramsMixin, FeatureFlagsMixin],
  data() {
    return {
      filterOptions: FINDINGS_FILTER_OPTIONS,
      form: {
        reportTemplateUuid: '',
        programUuid: '',
      },
      reportTemplates: [],
      allPrograms: [],
      selectedProgram: {
        title: 'All Endpoints',
      },
      expanded: false,
      pmEndpointSearch: '',
    }
  },
  props: {
    companyName: {
      type: String,
      default: '',
      required: false,
    },
    showProgramSelector: {
      type: Boolean,
      required: true,
    },
    programUuid: {
      type: String,
      required: false,
    },
    selectedProgramFromState: {
      type: String,
      required: false,
    },
    programsLoading: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    showReportOptions() {
      return this.userIsProgramManager()
    },
    filteredProgams() {
      if (!this.pmEndpointSearch) {
        return this.allPrograms
      }
      return this.allPrograms.filter(program => {
        const programTitle = program.title.toLowerCase()
        return programTitle.includes(this.pmEndpointSearch.toLowerCase())
      })
    },
  },
  methods: {
    async loadAllPrograms() {
      try {
        const res = await ProgramsService.getAllPrograms()
        this.allPrograms = res.data
      } catch (error) {}
    },
    selectProgram(program) {
      this.selectedProgram = program
      this.expanded = false
      this.pmEndpointSearch = ''
      this.$emit('on-select-program', program.uuid || '')
    },
    toggleDropdownMenu() {
      this.expanded = !this.expanded
    },
    hideDropdownMenu() {
      this.expanded = false
    },
  },
  async created() {
    // Get all programs associated with user
    try {
      this.$emit('on-loading-progams', true)
      await this.loadAllPrograms()
      // use selected program query, if available
      if (this.selectedProgramFromState) {
        this.selectedProgram = this.allPrograms.find(el => el.uuid === this.selectedProgramFromState)
        this.$emit('on-select-program', this.selectedProgram.uuid)
      } else {
        this.$emit('on-select-program', '')
      }
    } catch (error) {
    } finally {
      this.$emit('on-loading-progams', false)
    }
  },
  watch: {
    startDate(newVal, oldVal) {
      this.form.startDate = newVal
    },
  },
}
</script>

<style lang="scss">
.findings-list-options {
  display: flex;
  flex: 1;
}

.finding-list-options-section {
  display: flex;
}

.findings-list-options-form {
  display: flex;
  flex: 1;
  margin: -1rem;

  &__left,
  &__right {
    padding: 1.5rem 2rem;
    background-color: #fff;
    border-radius: 4px;
    // border: 1px solid #ebedf2;
    box-shadow: 0 0 1.3rem 0 rgba(82, 63, 105, 0.05);
    margin: 1rem;

    @media (min-width: 599px) {
      flex: 1;
    }

    .vdp-datepicker {
      max-width: 17rem;

      @media (max-width: 1324px) {
        max-width: 100%;
      }
    }
  }

  .section-title {
    color: #53565a;
    font: normal 600 1.4rem/1.5 'Fira Sans', Helvetica, Arial, sans-serif;
    margin-bottom: 1rem;
  }

  .date {
    // display: flex;
    // flex-direction: column;
    // flex: 0 1 40%;

    .input-container {
      position: relative;

      input {
        background-color: transparent;
        border: 0;
      }

      .form__control {
        padding-right: 34px;
      }

      i {
        position: absolute;
        left: auto;
        right: 7px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 20px;
      }
    }
  }
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
