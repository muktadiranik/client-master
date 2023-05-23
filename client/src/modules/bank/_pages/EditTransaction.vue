<template>
  <main class="c-site-main">
    <div class="u-pt-20 u-pb-20">
      <div class="l-wrap">
        <div class="l-edit-transaction">
          <aside>
            <div class="c-box u-overflow-hidden">
              <div class="c-box__header">
                <h6 class="o-h6">Transaction Details</h6>
              </div>
              <div class="c-box__body u-p-0">
                <ul class="c-list-group c-list-group--flush c-list-group--striped-odd">
                  <li class="c-dictionary c-dictionary--font-sm l-grid l-grid--row-gap-5">
                    <span class="u-text-mute">Title</span>
                    <span>{{ form.title }}</span>
                  </li>
                  <li class="c-dictionary c-dictionary--font-sm l-grid l-grid--row-gap-5">
                    <span class="u-text-mute">Payee</span>
                    <span>{{ form.researcher.user_name }}</span>
                  </li>
                  <li class="c-dictionary c-dictionary--font-sm l-grid l-grid--row-gap-5">
                    <span class="u-text-mute">Amount</span>
                    <span>${{ form.amount }}</span>
                  </li>
                  <li class="c-dictionary c-dictionary--font-sm l-grid l-grid--row-gap-5">
                    <span class="u-text-mute">Date</span>
                    <span>{{ form.paymentDate }}</span>
                  </li>
                  <li class="c-dictionary c-dictionary--font-sm l-grid l-grid--row-gap-5">
                    <span class="u-text-mute">Notes</span>
                    <span>{{ form.notes }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </aside>
          <ValidationObserver ref="observer" v-slot="{ invalid, handleSubmit, validate }">
            <div class="c-form" autocomplete="off">
              <div class="c-box">
                <div class="c-box__header">
                  <h6 class="o-h6">Edit Transaction</h6>
                </div>
                <!-- /.c-box__header -->
                <div class="c-box__body l-grid l-grid--row-gap-30">
                  <!-- STATUS -->
                  <div class="c-alert c-alert--warning u-d-f u-ai-center" v-show="isScheduledPayment">
                    <i class="far fa-exclamation-circle u-mr-10"></i>
                    <span>Transaction has been scheduled for a future date.</span>
                  </div>

                  <div class="l-grid l-grid--col-2-at-1280 l-grid--gap-30">
                    <!-- PAYEE -->
                    <ResearcherSearch
                      @on-researcher-selected="onResearcherSelected"
                      :selected-researcher="form.researcher"
                    />
                  </div>

                  <div class="l-grid l-grid--col-2-at-1280 l-grid--gap-30">
                    <!-- AMOUNT -->
                    <ValidationProvider name="Amount" :rules="formValidationRules.amount" v-slot="{ errors }">
                      <div class="c-form__group amountUSD">
                        <label class="c-form__label c-form__label--small" for="amountUSD">Amount (USD)</label>
                        <money
                          v-model="form.amount"
                          v-bind="amountMask"
                          class="o-input"
                          id="amountUSD"
                          name="amountUSD"
                          placeholder="Enter transaction amount..."
                        />
                      </div>
                      <c-form-errors :errors="errors" />
                    </ValidationProvider>

                    <!-- DATE -->
                    <ValidationProvider name="Date" :rules="formValidationRules.paymentDate" v-slot="{ errors }">
                      <div class="c-form__group date">
                        <label class="c-form__label c-form__label--small" for="paymentDate">Date</label>
                        <div class="c-input-icon">
                          <datepicker
                            type="text"
                            wrapper-class="c-cesppa-calendar-container"
                            calendar-class="c-cesppa-calendar"
                            input-class="o-input"
                            id="paymentDate"
                            placeholder="Choose a date"
                            :value="form.paymentDate"
                            :name="'paymentDate'"
                            :use-utc="true"
                            @selected="paymentDateSelected"
                          ></datepicker>
                          <i class="fal fa-calendar-alt c-input-icon__element"></i>
                        </div>
                      </div>
                      <c-form-errors :errors="errors" />
                    </ValidationProvider>
                  </div>
                  <!-- /.l-grid--col-2 -->

                  <!-- TITLE -->
                  <ValidationProvider name="Title" :rules="formValidationRules.title" v-slot="{ errors }">
                    <div class="c-form__group title">
                      <label class="c-form__label c-form__label--small" for="title">Title</label>
                      <input
                        type="text"
                        class="o-input"
                        id="title"
                        v-model="form.title"
                        name="title"
                        placeholder="Enter transaction title..."
                      />
                    </div>
                    <c-form-errors :errors="errors" />
                  </ValidationProvider>

                  <!-- PROGRAM -->
                  <ValidationProvider name="Program" :rules="formValidationRules.program" v-slot="{ errors }">
                    <div class="c-form__group program">
                      <label class="c-form__label c-form__label--small" for="program">Program</label>
                      <div class="c-form__select-control">
                        <select
                          class="o-input"
                          id="program"
                          :disabled="loading"
                          name="program"
                          @change="refreshSubmissionsList"
                          v-model="form.program"
                        >
                          <option value>Click to assign a program...</option>
                          <option
                            v-for="(program, index) in programs"
                            :key="`program-${index}`"
                            :value="program.uuid"
                            >{{ program.title }}</option
                          >
                        </select>
                        <i class="far fa-chevron-down"></i>
                      </div>
                    </div>
                    <c-form-errors :errors="errors" />
                  </ValidationProvider>

                  <div class="l-grid l-grid--gap-30" :class="{ 'l-grid--col-2-at-1280': form.transactionType === 2 }">
                    <!-- TYPE -->
                    <ValidationProvider
                      name="Transaction Type"
                      :rules="formValidationRules.transactionType"
                      v-slot="{ errors }"
                    >
                      <div class="c-form__group transactionType">
                        <label class="c-form__label c-form__label--small" for="transactionType">Type</label>
                        <div class="c-form__select-control">
                          <select
                            class="o-input"
                            id="transactionType"
                            :disabled="loading"
                            name="transactionType"
                            @change="refreshSubmissionsList"
                            v-model="form.transactionType"
                          >
                            <option value="-1">Choose a transaction type...</option>
                            <option
                              v-for="(option, index) in transactionTypes"
                              :key="`transaction-type-${index}`"
                              :value="option.id"
                              >{{ option.name }}</option
                            >
                          </select>
                          <i class="far fa-chevron-down"></i>
                        </div>
                      </div>
                      <c-form-errors :errors="errors" />
                    </ValidationProvider>

                    <!-- SUBMISSION -->
                    <ValidationProvider
                      name="Submission"
                      :rules="submissionValidationRules"
                      v-slot="{ errors }"
                      v-if="form.transactionType === 2"
                    >
                      <div class="c-form__group">
                        <label class="c-form__label c-form__label--small submission-label" for="submission"
                          >Submission</label
                        >
                        <div class="c-form__select-control">
                          <select
                            class="o-input"
                            id="submission"
                            :disabled="loading"
                            name="submission"
                            @change="onSubmissionSelected($event.target.value)"
                            v-model="form.submission"
                          >
                            <option value="">Select a submission to link...</option>
                            <option
                              v-for="(submission, index) in submissions"
                              :key="`submission-${index}`"
                              :value="submission.uuid"
                              >{{ submission.title }}</option
                            >
                          </select>
                          <i class="far fa-chevron-down"></i>
                        </div>
                      </div>
                      <c-form-errors :errors="errors" />
                    </ValidationProvider>
                  </div>
                  <!-- /.l-grid--col-2 -->

                  <!-- NOTE -->
                  <div class="c-form__group note">
                    <label class="c-form__label c-form__label--small" for="note">Note</label>
                    <textarea
                      class="o-textarea"
                      id="note"
                      v-model="form.notes"
                      placeholder="Enter a note about this transaction..."
                    ></textarea>
                  </div>
                </div>
                <!-- /.c-box__body -->
                <div class="c-box__footer">
                  <div class="u-d-grid-below-500 u-grid-row-gap-10 u-d-f-at-500 u-ai-center u-jc-sb-at-500">
                    <button
                      type="button"
                      class="o-btn o-btn--primary o-btn--rounded-sm"
                      v-show="!transaction"
                      :disabled="loading || invalid"
                      @click="saveTransaction"
                    >
                      Create Transaction
                    </button>
                    <button
                      type="button"
                      class="o-btn o-btn--outline o-btn--outline-coolgrey o-btn--rounded-sm"
                      @click="cancelClick"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      class="o-btn o-btn--long o-btn--primary o-btn--rounded-sm"
                      :disabled="loading || invalid || !fieldsUpdated || !hasResearcher"
                      v-show="transaction"
                      @click="saveTransaction(validate)"
                    >
                      Save Transaction
                    </button>
                  </div>
                </div>
                <!-- /.c-box__footer -->
              </div>
              <!-- /.c-box -->
            </div>
            <!-- /.c-form -->
          </ValidationObserver>
        </div>
        <!-- /.l-edit-transaction -->
      </div>
      <!-- /.l-wrap -->
    </div>
  </main>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import { Money } from 'v-money'
import { BankMixin } from '@/modules/bank/_mixins/bank'
import { BreadcrumbsMixin } from '@/mixins/breadcrumbs'
import { DatesMixin } from '@/mixins/dates'
import ResearcherSearch from '@/modules/bank/_components/ResearcherSearch.vue'
import CFormErrors from '@/modules/core/_components/c-form/c-form-errors'

export default {
  name: 'EditTransaction',
  mixins: [BankMixin, BreadcrumbsMixin, DatesMixin],
  components: {
    Datepicker,
    Money,
    ResearcherSearch,
    CFormErrors,
  },
  data() {
    return {
      amountMask: {
        decimal: '.',
        thousands: ',',
        prefix: '$ ',
        precision: 2,
      },
      loading: false,
      today: new Date(),
      form: {
        amount: 0.0,
        title: '',
        transactionType: -1,
        program: '',
        notes: '',
        paymentDate: new Date(),
        researcher: {},
        submission: '',
      },
      submissions: [],
      formValidationRules: {
        amount: {
          min_value: 0,
          required: true,
        },
        payee: {
          required: true,
        },
        paymentDate: {
          required: true,
        },
        program: {
          required: true,
        },
        title: {
          required: true,
        },
        transactionType: {
          required: true,
          min_value: 0,
        },
      },
      transaction: {},
    }
  },
  computed: {
    hasResearcher() {
      const researcher = this.form.researcher || null
      return researcher && researcher.uuid
    },
    isScheduledPayment() {
      return this.form.paymentDate > this.today
    },
    fieldsUpdated() {
      const formPaymentDate = new Date(this.form.paymentDate)
      const transactionPaymentDate = new Date(this.transaction.payment_date)

      return (
        this.form.amount !== this.transaction.amount ||
        this.form.title !== this.transaction.title ||
        this.form.transactionType !== this.transaction.transaction_type_id ||
        this.form.program !== this.transaction.program.uuid ||
        this.form.notes !== this.transaction.notes ||
        formPaymentDate !== transactionPaymentDate ||
        this.form.researcher !== this.transaction.payee
      )
    },
    submissionValidationRules() {
      const required = this.form.transactionType === 2
      return { required }
    },
    submissionUuid() {
      if (!this.transaction || !this.transaction.submission) {
        return ''
      }
      return this.transaction.submission.uuid || ''
    },
  },
  methods: {
    cancelClick() {
      this.$router.go(-1)
    },
    async onResearcherSelected(researcher) {
      this.form.researcher = researcher
      await this.refreshSubmissionsList()
    },
    paymentDateSelected(date) {
      this.form.paymentDate = new Date(date)
    },
    async editTransaction() {
      try {
        const transaction = await this.actionEditTransaction({
          transactionUuid: this.transaction.uuid,
          form: this.form,
        })
        this.$caAlert.success('Transaction saved')
        return transaction
      } catch (e) {
        this.$caAlert.error('Failed to save transaction')
      }
    },
    onSubmissionSelected(submissionUuid) {
      if (!submissionUuid) {
        this.form.submission = ''
        return
      }
      if (this.submissionUuid && submissionUuid === this.transaction.submission.uuid) {
        this.form.submission = this.submissionUuid
        this.form.program = this.transaction.program.uuid
        return
      }
      const submission = this.submissions.find(x => x.uuid === submissionUuid)
      this.form.program = submission.program_uuid
    },
    async refreshSubmissionsList() {
      const isBountyTransaction = this.form.transactionType === 2
      const researcher = this.form.researcher
      const researcherUuid = researcher && researcher.uuid ? researcher.uuid : ''

      if (!isBountyTransaction || !researcherUuid) {
        this.submissions = []
        this.form.submission = ''
        return
      }

      try {
        this.$solar.show()
        const payload = {
          researcherUuid: researcher.uuid,
          programUuid: this.form.program,
          submissionUuid: this.submissionUuid,
        }
        const submissions = await this.actionGetPendingSubmissions(payload)
        this.submissions = submissions
      } catch (e) {
        this.$caAlert.error('Failed to load available submissions')
        this.submissions = []
      } finally {
        const isSelectedSubmissionValid = this.submissions.find(x => x.uuid === this.form.submission)
        if (!isSelectedSubmissionValid) {
          this.form.submission = ''
        }
        this.$solar.hide()
      }
    },
    async saveTransaction(validate) {
      const valid = validate()
      if (!valid) {
        this.$caAlert.error('Failed to edit transaction')
        return
      }

      this.form.paymentDate = new Date(this.form.paymentDate)
      const transaction = await this.editTransaction()

      this.$router.push({
        name: 'TransactionDetails',
        params: {
          uuid: transaction.uuid,
        },
      })
    },
    async initializeWithTransaction() {
      const transactionUuid = this.$route.params.uuid
      if (!transactionUuid) {
        return
      }

      this.transaction = await this.actionGetTransaction(transactionUuid)
      const submission = this.transaction.submission

      this.form = {
        amount: this.transaction.amount,
        title: this.transaction.title,
        transactionType: this.transaction.transaction_type_id,
        program: this.transaction.program.uuid,
        notes: this.transaction.notes || '',
        paymentDate: this.transaction.payment_date,
        researcher: this.transaction.payee ? this.transaction.payee : {},
        submission: submission && submission.uuid ? submission.uuid : '',
      }

      await this.refreshSubmissionsList()
    },
  },
  async mounted() {
    this.loading = true
    this.$solar.show()
    try {
      await this.initializeWithTransaction()
      await this.actionLoadProgramsList()
      await this.actionLoadTransactionTypes()

      this.actionSetBreadcrumbs({
        parent: {
          route: this.$router.resolve({ name: 'Transactions' }).route,
          title: 'Bank',
        },
        child: {
          title: 'Transactions',
          route: this.$router.resolve({ name: 'Transactions' }).route,
        },
        grandChild: {
          title: this.transaction.transaction_id,
          copyValue: this.transaction.transaction_id,
        },
      })
    } catch (e) {
      this.$caAlert.error('Failed to load transaction settings')
    } finally {
      this.$solar.hide()
      this.loading = false
    }
  },
}
</script>
