<template>
  <main class="c-site-main" style="padding-bottom: 100px">
    <div class="l-wrap">
      <h2 class="u-fs-22 u-mt-28 u-mb-20">Green Room</h2>
      <div>
        <domain-selector :domainOptions="domainOptions" @domain-selected="handleFilterByDomain" class="u-mr-8" />
        <vulnerability-selector
          :vulnerabilityOptions="vulnerabilityOptions"
          @vuln-type-selected="handleFilterByVulnType"
        />
      </div>
      <div class="l-flex u-jc-sb u-ai-center">
        <h6 class="u-mt-24 u-mb-20 o-text u-fs-16 o-text--gray o-text--400">
          Total Vulnerabilities ({{ vulnerabilities.length }})
        </h6>
        <div>
          <button
            v-if="selectedRows.length > 0"
            class="o-btn o-btn--sm o-btn--rounded o-btn--green u-mr-8"
            @click.prevent="selectedRows.length > 0 && toggleApproveModal()"
          >
            <i class="fal fa-check u-mr-4"></i>Approve
            {{ selectedRows.length > 0 ? ` (${selectedRows.length})` : '(0)' }}
          </button>

          <!-- approve modal -->
          <ca-dialog
            v-show="approveModalOpen"
            :active="true"
            :dialogId="'approve'"
            :hasConfirmButton="true"
            :confirmButtonText="'Approve Vulnerability'"
            :hasCancelButton="true"
            :cancelButtonText="'Cancel'"
            :title="'Approve Vulnerability'"
            :text="'Are you sure you want to approve this vulnerability and create a submission?'"
            :cancelCallback="toggleApproveModal"
            :confirmCallback="() => handleGreenRoomVulns('accept')"
          />
          <button
            v-if="selectedRows.length > 0"
            class="o-btn o-btn--sm o-btn--rounded o-btn--red"
            @click.prevent="selectedRows.length > 0 && toggleDeclineModal()"
          >
            <i class="fal fa-times u-mr-4"></i>Decline
            {{ selectedRows.length > 0 ? ` (${selectedRows.length})` : '(0)' }}
          </button>

          <!-- decline modal -->
          <div class="c-modal" v-show="declineModalOpen">
            <div class="c-modal__inner">
              <h6 class="u-fs-18">Delete Vulnerability</h6>
              <div class="c-modal__close" @click.prevent="toggleDeclineModal">
                <i class="fal fa-times u-font-150 u-cursor-pointer"></i>
              </div>

              <div class="c-modal__body u-mt-28">
                <div class="c-form__group u-mb-10">
                  <div class="c-custom-control c-custom-control--radio">
                    <input
                      type="radio"
                      name="deleteFromGreenRoom"
                      id="deleteFromGreenRoom"
                      value="decline"
                      v-model="declineModalSelectionType"
                    />
                    <label class="u-color-black u-fs-13" for="deleteFromGreenRoom">Delete from the green room</label>
                  </div>
                  <div class="u-br-3 u-bgc-gray2 o-text--gray u-p-10 l-flex u-text-left u-mt-10">
                    <i class="fal fa-info-circle u-fs-14 u-mr-8"></i>
                    <span class="u-fs-11">Vulnerability will be deleted and will appear if detected again</span>
                  </div>
                </div>
                <div class="c-form__group u-mb-10">
                  <div class="c-custom-control c-custom-control--radio">
                    <input
                      type="radio"
                      name="dontShowAgain"
                      id="dontShowAgain"
                      value="exclude"
                      v-model="declineModalSelectionType"
                    />
                    <label class="u-color-black u-fs-13" for="dontShowAgain">Don't show me again</label>
                  </div>
                  <div class="u-br-3 u-bgc-gray2 o-text--gray u-p-10 l-flex u-text-left u-mt-10">
                    <i class="fal fa-info-circle u-fs-14 u-mr-8"></i>
                    <span class="u-fs-11">Vunlnerability will be aded to blacklist</span>
                  </div>
                </div>
              </div>
              <div class="c-modal__footer">
                <div class="u-flex-buttons u-jc-center">
                  <button
                    class="o-btn o-btn--outline o-btn--outline-primary o-btn--sm o-btn--rounded-sm"
                    @click.prevent="toggleDeclineModal"
                  >
                    Cancel
                  </button>
                  <button
                    class="o-btn o-btn--sm o-btn--primary o-btn--rounded-sm"
                    @click.prevent="handleRemoveFindingsChoice"
                  >
                    Delete Vulnerability
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- details modal -->
          <!-- detailsModalOpen -->
          <div class="c-modal" v-show="detailsModalOpen">
            <div class="c-modal__inner">
              <h6 class="u-fs-18">Vulnerability Details</h6>
              <div class="c-modal__close" @click.prevent="toggleDetailsModal">
                <i class="fal fa-times u-font-150 u-cursor-pointer"></i>
              </div>

              <div class="c-modal__body u-mt-28">
                <p>{{ this.detailModalsText }}</p>
              </div>
              <div class="c-modal__footer">
                <div class="u-flex-buttons u-jc-center">
                  <button
                    class="o-btn o-btn--outline o-btn--outline-primary o-btn--sm o-btn--rounded-sm"
                    @click.prevent="toggleDetailsModal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- end details modal -->
        </div>
      </div>
      <!-- vue good table -->
      <div class="c-datatable--vgt" :style="{ 'padding-top': selectedRows.length > 0 ? 'inherit' : '14px' }">
        <vue-good-table
          ref="vulnsTable"
          :columns="columns"
          :rows="filteredGreenRoomVulns"
          :select-options="{ enabled: true, selectionText: 'vulnerabilities selected', selectOnCheckboxOnly: true }"
          :pagination-options="{
            enabled: true,
          }"
        >
          <!-- pagination -->
          <template slot="pagination-bottom" slot-scope="props">
            <good-table-pagination
              :total="props.total"
              :perPage="50"
              :pageChanged="props.pageChanged"
              :perPageChanged="props.perPageChanged"
            />
          </template>
          <!-- custom row template-->
          <template slot="table-row" slot-scope="props">
            <span v-if="props.column.field == 'vulnerability_type'" class="c-badge-list">
              <span class="c-badge--vuln">
                <span class="u-fs-11">{{ props.row.vulnerability_type }}</span>
              </span>
            </span>
            <span v-else-if="props.column.field == 'details'">
              <button
                class="o-btn o-btn--primary-light o-btn--rounded o-btn--sm u-d-if u-ai-center"
                @click.prevent="handleDetailsModal(props.row.details)"
              >
                <i class="far fa-eye u-fs-13 u-mr-8 o-btn--icon-sm"></i>
                <span>Details</span>
              </button>
            </span>
            <span v-else-if="props.column.field == 'create'">
              <span class="c-datatable__cell--approve" @click.prevent="handleGreenRoomVulnSingle('accept', props.row)"
                ><i class="fal fa-check"></i
              ></span>
            </span>
            <span v-else-if="props.column.field == 'decline'">
              <span class="c-datatable__cell--decline" @click.prevent="handleGreenRoomVulnSingle('decline', props.row)"
                ><i class="fal fa-times"></i
              ></span>
            </span>
          </template>
        </vue-good-table>
      </div>
    </div>
  </main>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { STORE_KEY, LOAD_GREENROOM_VULNS, GET_GREENROOM_VULNS } from '@/stores/green-room/types'
import store from '@/stores/green-room'
import GreenRoomService from '@/services/api/greenroom-service'
import DomainSelector from '../_components/DomainSelector.vue'
import VulnerabilitySelector from '../_components/VulnerabilitySelector.vue'
import { DatesMixin } from '@/mixins/dates'
import DateTimeFilters from '@/filters/date-time-filters'
import CaDialog from '../../../plugins/ca-dialogs/components/CaDialog.vue'
import { VueGoodTable } from 'vue-good-table'
import GoodTablePagination from '../../core/_components/c-pagination/GoodTablePagination.vue'

export default {
  name: 'GreenRoom',
  components: {
    DomainSelector,
    VulnerabilitySelector,
    CaDialog,
    VueGoodTable,
    GoodTablePagination,
  },
  filters: DateTimeFilters,
  mixins: [DatesMixin],
  data() {
    return {
      // to make computed "selectedRows work" property on template
      hasMounted: false,
      tempHoldingForSingle: [],
      currentPage: 1,
      pageCount: 1,
      declineModalOpen: false,
      approveModalOpen: false,
      detailsModalOpen: false,
      detailModalsText: '',
      declineModalSelectionType: '',
      columns: [
        {
          label: 'Created',
          field: 'date_created',
          sortable: true,
          formatFn: DateTimeFilters.date,
        },
        {
          label: 'Last Seen',
          field: 'date_last_seen',
          sortable: true,
          formatFn: DateTimeFilters.date,
        },
        {
          label: 'Domain',
          field: 'root_domain',
          sortable: true,
        },
        {
          label: 'Asset',
          field: 'asset',
        },
        {
          label: 'Type',
          field: 'vuln_type',
          sortable: true,
        },
        {
          label: 'Details',
          field: 'details',
        },
        {
          label: '',
          field: 'create',
        },
        {
          label: '',
          field: 'decline',
        },
      ],
      initialLoad: true,
      isLoading: true,
      vulnsLoading: false,
      filterByVulnType: '',
      filterByDomainType: '',
    }
  },
  computed: {
    ...mapState(STORE_KEY, {
      vulnerabilities: (state) => state.greenroomVulns,
    }),
    ...mapGetters(STORE_KEY, {
      greenroomVulns: GET_GREENROOM_VULNS,
    }),
    selectedRows() {
      return this.hasMounted ? this.$refs['vulnsTable'].selectedRows : []
    },
    domainOptions() {
      return this.greenroomVulns.reduce((acc, currVal) => {
        if (!acc.some((x) => x.name === currVal.root_domain.toLowerCase())) {
          acc.push({ displayName: currVal.root_domain, name: currVal.root_domain })
          return acc
        } else return acc
      }, [])
    },
    vulnerabilityOptions() {
      return this.greenroomVulns.reduce((acc, currVal) => {
        if (!acc.some((x) => x.name === currVal.vuln_type.toLowerCase())) {
          acc.push({ displayName: currVal.vuln_type, name: currVal.vuln_type })
          return acc
        } else return acc
      }, [])
    },
    filteredGreenRoomVulns() {
      let filteredArray = this.greenroomVulns
      if (this.filterByVulnType) {
        filteredArray = filteredArray.filter((x) => x.vuln_type.toLowerCase() === this.filterByVulnType.toLowerCase())
      }
      if (this.filterByDomainType) {
        filteredArray = filteredArray.filter(
          (x) => x.root_domain.toLowerCase() === this.filterByDomainType.toLowerCase()
        )
      }
      return filteredArray
    },
  },
  methods: {
    ...mapActions(STORE_KEY, {
      actionLoadGreenRoomVulns: LOAD_GREENROOM_VULNS,
    }),
    onPageChange(page) {
      if (page > this.pageCount || page < 1) {
        return
      }
      this.$emit('page-changed', page)
    },
    toggleDeclineModal() {
      if (this.declineModalOpen === true && this.tempHoldingForSingle.length > 0) {
        this.tempHoldingForSingle = []
      }
      this.declineModalSelectionType = ''
      this.declineModalOpen = !this.declineModalOpen
    },
    toggleApproveModal() {
      if (this.approveModalOpen === true && this.tempHoldingForSingle.length > 0) {
        this.tempHoldingForSingle = []
      }
      this.approveModalOpen = !this.approveModalOpen
    },
    async handleGreenRoomVulns(type) {
      const selectedVulns = this.tempHoldingForSingle.length === 0 ? this.selectedRows : this.tempHoldingForSingle
      const payload = {}
      const selectedVulnUuids = selectedVulns.map((vuln) => vuln.uuid)
      switch (type.toLowerCase()) {
        case 'accept':
          payload.accepted = selectedVulnUuids
          this.toggleApproveModal()
          break
        case 'decline':
          payload.declined = selectedVulnUuids
          this.toggleDeclineModal()
          break
        case 'exclude':
          payload.excluded = selectedVulnUuids
          this.toggleDeclineModal()
          break
        default:
          break
      }
      try {
        await GreenRoomService.handleGreenRoomVulns(payload)
        this.$refs['vulnsTable'].unselectAllInternal(true)
        if (this.tempHoldingForSingle > 0) {
          this.tempHoldingForSingle = []
        }
        this.$caAlert.success(selectedVulnUuids.length > 1 ? 'Vulnerabilities processed' : 'Vulnerability processed')
      } catch (error) {
        this.$caAlert.error(
          selectedVulnUuids.length > 1 ? 'Error processing vulnerabilities' : 'Error processing vulnerability'
        )
      }
      await this.loadGreenRoomVulns()
    },
    handleRemoveFindingsChoice() {
      this.declineModalSelectionType.toLowerCase() === 'decline'
        ? this.handleGreenRoomVulns('decline')
        : this.handleGreenRoomVulns('exclude')
    },
    handleGreenRoomVulnSingle(type, vuln) {
      switch (type.toLowerCase()) {
        case 'accept':
          this.tempHoldingForSingle.push(vuln)
          this.toggleApproveModal()
          break
        case 'decline':
          this.tempHoldingForSingle.push(vuln)
          this.toggleDeclineModal()
      }
    },
    toggleDetailsModal() {
      if (this.detailsModalText) {
        this.detailsModalText = ''
      }
      this.detailsModalOpen = !this.detailsModalOpen
    },
    handleDetailsModal(details) {
      this.toggleDetailsModal()
      this.detailModalsText = details
    },
    async loadGreenRoomVulns() {
      this.$solar.show()
      if (this.initialLoad) {
        this.initialLoad = false
      } else {
        this.vulnsLoading = true
      }
      try {
        await this.actionLoadGreenRoomVulns()
      } catch (e) {
        const error = e && e.data && e.data.error ? e.data.error : 'Failed to load vulns'
        this.$caAlert.error(error)
      } finally {
        this.$solar.hide()
        this.vulnsLoading = false
      }
    },
    handleFilterByVulnType(vulnType) {
      this.filterByVulnType = vulnType
    },
    handleFilterByDomain(domainName) {
      this.filterByDomainType = domainName
    },
  },
  async created() {
    if (!(STORE_KEY in this.$store._modules.root._children)) {
      this.$store.registerModule(STORE_KEY, store)
    }
  },
  async mounted() {
    if (!(STORE_KEY in this.$store._modules.root._children)) {
      this.$store.registerModule(STORE_KEY, store)
    }
    // to make computed "selectedRows work" property on template
    this.hasMounted = true
    await this.loadGreenRoomVulns()
  },
}
</script>
