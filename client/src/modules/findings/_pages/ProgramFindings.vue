<template>
  <main class="c-site-main">
    <div class="u-pb-20" v-if="!programLoading">
      <ProgramFindingsKanban @update-finding-resolution="updateFindingResolution" />
    </div>
  </main>
</template>

<script>
import ProgramFindingsKanban from '@/modules/findings/_components/findings-kanban/ProgramFindingsKanban'
import { NavbarMixin } from '@/mixins/navbar'
import { ProgramFindingsMixin } from '@/modules/findings/_mixins/program-findings'
import { AccountMixin } from '@/mixins/account'
import { BreadcrumbsMixin } from '@/mixins/breadcrumbs'
import { DatesMixin } from '@/mixins/dates'
import { ProgramsMixin } from '@/mixins/programs'

export default {
  name: 'ProgramFindings',
  components: {
    ProgramFindingsKanban,
  },
  mixins: [AccountMixin, BreadcrumbsMixin, DatesMixin, NavbarMixin, ProgramFindingsMixin, ProgramsMixin],
  data() {
    return {
      loading: false,
      programLoading: false,
    }
  },
  methods: {
    async onPageChange(page) {
      await this.actionSetPage(page)
    },
    async onSortChange(option) {
      await this.actionSetSortOption(option)
    },
    async onApplySearchText(value) {
      this.actionSetFindingQueryFindingName(value)
    },
    async loadFindings() {
      this.$solar.show()
      try {
        // await this.actionLoadFindings()
        await this.actionLoadNewFindings()
        await this.actionLoadInProgressFindings()
        await this.actionLoadClosedFindings()
      } catch (e) {
        const error = e && e.data && e.data.error ? e.data.error : 'Failed to load findings'
        this.$caAlert.error(error)
      } finally {
        this.$solar.hide()
      }
    },
    async loadProgram() {
      this.programLoading = true

      const response = await this.getProgram(this.$route.params.uuid)
      await this.actionSetProgram(response.data)
      document.title = `Inspectiv | ${this.program.title}`

      this.programLoading = false
    },
    async loadInitialFindings() {
      if (!this.findings || this.findings.length === 0) {
        await this.loadFindings()
      }
    },
    async setStartDate() {
      let startDate = new Date(this.program.date_created)
      startDate = DatesMixin.methods.getIsoDateStringFromDate(startDate)
      await this.actionSetStartDate(startDate)
    },
    // on kanban column move, update resolution
    async updateFindingResolution(finding) {
      this.actionUpdateFindingResolution(finding)
    },
    setPriorityQuery(priority) {
      this.actionSetPriorityQuery(priority)
    },
    onStartDateSelected(date) {
      const isoDate = this.getIsoDateStringFromDate(new Date(date))
      this.actionSetStartDate(isoDate)
    },
    onEndDateSelected(date) {
      const isoDate = this.getIsoDateStringFromDate(new Date(date))
      this.actionSetEndDate(isoDate)
    },
  },
  async mounted() {
    await this.loadProgram()
    await this.setStartDate()
    await this.actionLoadProgramForNavbar(this.program)
    await this.loadInitialFindings()

    this.actionSetBreadcrumbs({
      parent: {
        route: this.$router.resolve({ name: 'Programs' }).route,
      },
      child: {
        title: this.program.title,
        route: this.$route,
        copyValue: this.program.uuid,
      },
    })
  },
  async destroyed() {},
}
</script>
