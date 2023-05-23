<template>
  <div class="l-wrap">
    <div class="dropdownMenuContainer">
      <button
        class="button small text report-list-dropdown-button"
        @click="createFindingClick"
        v-if="userIsProgramManager()"
      >
        <i class="far fa-plus"></i> New Finding
      </button>
      <div class="dropdownMenuContent" v-click-outside="hideSortDropdown">
        <button
          type="button"
          @click="toggleSortDropdown"
          id="dropdownMenuButton"
          class="button text report-list-dropdown-button"
        >
          <i class="far fa-eye"></i>
          <span>{{ sortOption.name }}</span>
          <i class="far fa-angle-down"></i>
        </button>
        <div class="dropdownMenu right" v-show="sortDropdownExpanded">
          <div class="dropdown-section" v-if="sortOptions">
            <div class="title">Sort</div>
            <div class="radioContainer" v-for="(option, index) in sortOptions" :key="`sort-option-container-${index}`">
              <input
                type="radio"
                name="sortBy"
                :id="`sort-option-${index}`"
                :value="option"
                :checked="option === sortOption"
                @click="onSortChange(option)"
              />
              <label :for="`sort-option-${index}`">
                {{ option.name }}
                <i class="icon fal" :class="sortOrderIconClass" v-show="option === sortOption"></i>
              </label>
            </div>
          </div>
          <div class="dropdown-section" v-if="filterOptions">
            <div class="title">Filter</div>
            <div
              class="radioContainer"
              v-for="(option, index) in filterOptions"
              :key="`filter-option-container-${index}`"
            >
              <input
                type="radio"
                name="filterBy"
                :id="`filter-option-${index}`"
                :value="option"
                :checked="option === filterOption"
                @click="onFilterChange(option)"
              />
              <label :for="`filter-option-${index}`">{{ option.name }}</label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="box u-p-0">
      <header class="box-header">
        <div class="box-header__title">
          <h5>
            <em>{{ filterOption.name }}</em>
            <span v-show="filterOption.name !== 'All'">({{ count || 0 }})</span>
            <span v-show="filterOption.name === 'All'">({{ newCount }} New)</span>
          </h5>
        </div>
        <div class="box-header__columns">
          <h6 class="column-header created" @click="headerClick('DateCreated')">
            Created
            <i
              class="column-order-icon fa"
              :class="sortOrder === 'asc' ? 'fa-chevron-up' : 'fa-chevron-down'"
              v-show="sortOption.name === 'Date Created'"
            ></i>
          </h6>
          <h6 class="column-header severity" @click="headerClick('Severity')">
            Severity
            <i
              class="column-order-icon fa"
              :class="sortOrder === 'asc' ? 'fa-chevron-up' : 'fa-chevron-down'"
              v-show="sortOption.name === 'Severity'"
            ></i>
          </h6>
          <h6 class="column-header status">Status</h6>
        </div>
      </header>
      <div class="box-main">
        <ul class="report-list">
          <li
            class="report-list-item"
            v-for="(finding, index) in findings"
            :key="`finding-${index}`"
            :class="{ active: finding.active === true, complete: finding.resolution !== 'New' }"
            @click="findingClick(finding, $event)"
          >
            <div class="report-info">
              <div class="report-name">
                <router-link id="finding-title-link" :to="{ name: 'Finding', params: { uuid: finding.uuid } }">{{
                  finding.title
                }}</router-link>
              </div>
            </div>
            <div class="report-list-columns">
              <div class="report-list-column created">
                <div>{{ finding.date_published | elapsedTimeToDay(now) }}</div>
              </div>
              <div class="report-list-column severity">
                <submission-severity-badge :priority="finding.priority" />
              </div>
              <div class="report-list-column status">
                <div>{{ finding.resolution }}</div>
              </div>
            </div>
            <div class="report-action-icon">
              <i class="fa fa-caret-right"></i>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { clickOutside } from '@/directives/click-outside'
import { AccountMixin } from '@/mixins/account'
import DateTimeFilters from '@/filters/date-time-filters'
import SubmissionSeverityBadge from '@/modules/programs/_components/program-submissions-list/SubmissionSeverityBadge'

export default {
  name: 'ProgramFindingsList',
  components: {
    SubmissionSeverityBadge,
  },
  directives: {
    clickOutside,
  },
  filters: DateTimeFilters,
  mixins: [AccountMixin],
  props: {
    count: {
      type: Number,
      default: 0,
      required: true,
    },
    filterOption: {
      type: Object,
      default: () => {},
      required: true,
    },
    filterOptions: {
      type: Object,
      default: () => {},
      required: true,
    },
    sortOrder: {
      type: String,
      required: true,
    },
    sortOption: {
      type: Object,
      default: () => {},
      required: true,
    },
    sortOptions: {
      type: Object,
      default: () => {},
      required: true,
    },
    findings: {
      type: Array,
      default: () => [],
      required: true,
    },
  },
  data() {
    return {
      now: new Date(),
      sortDropdownExpanded: false,
      defaultUserImage: DEFAULT_USER_IMAGE,
    }
  },
  computed: {
    sortOrderIconClass() {
      return this.sortOrder === 'asc' ? 'fa-chevron-up' : 'fa-chevron-down'
    },
  },
  methods: {
    createFindingClick() {
      this.$router.push({
        name: 'CreateFinding',
        params: { uuid: this.$route.params.uuid },
      })
    },
    toggleSortDropdown() {
      this.sortDropdownExpanded = !this.sortDropdownExpanded
    },
    hideSortDropdown() {
      this.sortDropdownExpanded = false
    },
    onFilterChange(option) {
      this.$emit('filter-changed', option)
    },
    onSortChange(option) {
      this.$emit('sort-changed', option)
    },
    findingClick(finding, e) {
      const targetId = e && e.target && e.target.id ? e.target.id : ''
      if (targetId && targetId === 'finding-title-link') {
        return
      }
      this.$router.push({ path: `/findings/${finding.uuid}` })
    },
    headerClick(name) {
      const sortOption = this.sortOptions[name]
      this.$emit('sort-changed', sortOption)
    },
  },
}
</script>
