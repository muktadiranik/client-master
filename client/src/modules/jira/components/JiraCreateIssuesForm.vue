<template>
  <div class="u-mt-10">
    <div v-if="publishedProgramFindings.length > 0" class="c-datatable--custom">
      <vue-good-table
        @on-selected-rows-change="selectionChanged"
        ref="select-findings-table"
        :columns="columns"
        :rows="publishedProgramFindings"
        :select-options="{
          enabled: true,
          selectionText: 'vulnerabilities selected',
        }"
        :pagination-options="{
          enabled: true,
        }"
        :search-options="{ enabled: true, placeholder: 'Search For Vulnerabilities' }"
        styleClass="vgt-table"
      >
        <template slot="pagination-bottom" slot-scope="props">
          <good-table-pagination
            :total="props.total"
            :pageChanged="props.pageChanged"
            :perPageChanged="props.perPageChanged"
          />
        </template>
        <template slot="table-column" slot-scope="props">
          <span v-if="props.column.label == 'Vulnerability'">
            <span class="c-datatable__cell u-p-0 o-text--500 u-fs-13">
              {{ props.column.label }}
            </span>
          </span>
          <span v-if="props.column.label == 'Date Created'">
            <span class="c-datatable__cell u-p-0 u-fs-13 o-text--500">
              {{ props.column.label }}
            </span>
          </span>
        </template>
        <template slot="table-row" slot-scope="props">
          <span v-if="props.column.field == 'title'">
            <span class="c-datatable__cell c-datatable__cell--txt-wrap u-p-0 u-fs-12 o-text--dark o-text--500">{{ props.row.title }}</span>
          </span>
          <span v-if="props.column.field == 'date_published'">
            <span class="c-datatable__cell u-p-0 u-fs-12 o-text--gray">{{ props.row.date_published | date }}</span>
          </span>
        </template>

        <!-- when search results in no matches -->
        <div class="vgt-center-align vgt-text-disabled" slot="emptystate">
          No vulnerabilities matched that search
        </div>
      </vue-good-table>
    </div>
    <div v-else class="c-form__group u-mt-20">
      No vulnerabilities are currently available. Save configuration and Jira issues will be created when new
      vulnerabilities are published
    </div>
    <div class="u-mt-20" v-show="isLoading">
      <Spinner size="medium" />
    </div>
    <div>
      <div class="u-p-20">
        <button class="o-btn o-btn--outline-primary o-btn--rounded-sm o-btn--sm u-mr-2" @click="$emit('on-cancel')">
          Cancel
        </button>
        <button
          v-if="publishedProgramFindings.length === 0 || !findingsSelected"
          class="o-btn o-btn--primary o-btn--rounded-sm o-btn--sm"
          @click.prevent="saveAndCreateIssues()"
        >
          Save
        </button>
        <button v-else class="o-btn o-btn--primary o-btn--rounded-sm o-btn--sm" @click.prevent="saveAndCreateIssues()">
          Create Issues and Save
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { IntegrationsServiceMixin } from '@/modules/jira/mixins/IntegrationsServiceMixin'
import 'vue-good-table/dist/vue-good-table.css'
import { VueGoodTable } from 'vue-good-table'
import { DatesMixin } from '@/mixins/dates'
import Spinner from 'vue-simple-spinner'
import DateTimeFilters from '@/filters/date-time-filters'
import GoodTablePagination from '../../core/_components/c-pagination/GoodTablePagination.vue'

export default {
  name: 'JiraCreateIssuesForm',
  filters: DateTimeFilters,
  mixins: [IntegrationsServiceMixin, DatesMixin],
  components: {
    Spinner,
    VueGoodTable,
    GoodTablePagination,
  },
  data() {
    return {
      findingsSelected: false,
      isLoading: false,
      columns: [
        {
          label: 'Vulnerability',
          field: 'title',
          sortable: true,
        },
        {
          label: 'Date Created',
          field: 'date_published',
          sortable: true,
        },
      ],
      inputText: '',
    }
  },
  methods: {
    selectionChanged({ selectedRows }) {
      this.findingsSelected = selectedRows.length !== 0
    },

    updateTitleSearch(value) {
      this.inputText = value
    },
    async saveAndCreateIssues() {
      try {
        this.isLoading = true
        await this.actionSaveJiraConfiguration()
        // // create issues
        if (this.publishedProgramFindings.length === 0) {
          this.$caAlert.success(`Jira integration saved`)
          return
        } else {
          const selectedUuids = this.$refs['select-findings-table'].selectedRows.map(f => f.uuid)
          await this.actionCreateFindingsIssues(selectedUuids)
          this.$caAlert.success(`Jira integration saved and ${selectedUuids.length} issues created`)
          // clear selected items
          this.$refs['select-findings-table'].reset()
        }
      } catch (error) {
        this.$caAlert.error('Error updating integration')
      } finally {
        this.isLoading = false
        this.actionLoadJiraProgram()
      }
    },
  },
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
