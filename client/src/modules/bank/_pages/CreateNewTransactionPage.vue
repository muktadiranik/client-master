<template>
  <main class="c-site-main">
    <div class="u-pt-20 u-pb-20">
      <div class="l-wrap">
        <div class="l-create-transaction">
          <aside>
            <div class="c-box u-overflow-hidden">
              <div class="c-box__header" v-if="form.researcher.username">
                <div class="c-media c-media--lg">
                  <img
                    :src="form.researcher.profile_picture || defaultUserAvatar"
                    :alt="form.researcher.username"
                    class="c-media__img u-img-rounded"
                  />
                  <div class="c-media__body">
                    <h6 class="o-h6">{{ `${form.researcher.first_name} ${form.researcher.last_name}` }}</h6>
                    <div class="o-text o-text--sm u-fw-700 u-text-mute">
                      {{ form.researcher.username }}
                    </div>
                  </div>
                </div>
              </div>
              <!-- /.c-box__header -->
              <div class="c-box__header" v-else>
                <h6 class="o-h6">Payee Information</h6>
              </div>
              <!-- /.c-box__header -->
              <div class="c-box__body u-p-0" v-if="Object.keys(form.researcher).length !== 0">
                <ul class="c-list-group c-list-group--flush c-list-group--striped-odd">
                  <li
                    class="c-dictionary c-dictionary--font-sm l-dictionary l-dictionary--media-lg"
                    v-if="form.researcher.twitter"
                  >
                    <span class="c-dictionary__key u-d-if u-ai-center">
                      <i class="fab fa-twitter c-dictionary__key-icon"></i>
                      <span class="u-ml-10">Twitter</span>
                    </span>
                    <span class="c-dictionary__value u-text-mute">
                      <a :href="`https://twitter.com/${form.researcher.twitter}`" target="_blank" class="u-d-if">
                        <span>@</span>
                        <span>{{ form.researcher.twitter }}</span>
                      </a>
                    </span>
                  </li>
                  <li
                    class="c-dictionary c-dictionary--font-sm l-dictionary l-dictionary--media-lg"
                    v-if="form.researcher.linked_in"
                  >
                    <span class="c-dictionary__key u-d-if u-ai-center">
                      <i class="fab fa-linkedin-in c-dictionary__key-icon"></i>
                      <span class="u-ml-10">Linkedin</span>
                    </span>
                    <span class="c-dictionary__value u-text-mute">
                      <a
                        :href="`https://www.linkedin.com/in/${form.researcher.linked_in}/`"
                        target="_blank"
                        class="u-d-if"
                      >
                        <span>@</span>
                        <span>{{ form.researcher.linked_in }}</span>
                      </a>
                    </span>
                  </li>
                  <template>
                    <li
                      class="c-dictionary c-dictionary--font-sm l-grid l-grid--row-gap-5"
                      v-if="form.researcher.paypal_email"
                    >
                      <span class="c-dictionary__key u-d-if u-ai-center">
                        <i class="fab fa-paypal c-dictionary__key-icon"></i>
                        <span class="u-ml-10">PayPal</span>
                      </span>
                      <span class="c-dictionary__value u-text-mute u-pl-26">
                        <span>{{ form.researcher.paypal_email }}</span>
                      </span>
                    </li>
                    <li
                      class="c-dictionary c-dictionary--font-sm l-grid l-grid--row-gap-5"
                      v-if="form.researcher.btc_wallet_address"
                    >
                      <span class="c-dictionary__key u-d-if u-ai-center">
                        <i class="fab fa-btc c-dictionary__key-icon"></i>
                        <span class="u-ml-10">BTC</span>
                      </span>
                      <span class="c-dictionary__value u-text-mute u-pl-26">
                        <span>{{ form.researcher.btc_wallet_address }}</span>
                      </span>
                    </li>
                    <li
                      class="c-dictionary c-dictionary--font-sm l-grid l-grid--row-gap-5"
                      v-if="form.researcher.eth_wallet_address"
                    >
                      <span class="c-dictionary__key u-d-if u-ai-center">
                        <i class="fab fa-ethereum c-dictionary__key-icon"></i>
                        <span class="u-ml-10">ETH</span>
                      </span>
                      <span class="c-dictionary__value u-text-mute u-pl-26">
                        <span>{{ form.researcher.eth_wallet_address }}</span>
                      </span>
                    </li>
                    <li
                      class="c-dictionary c-dictionary--font-sm l-grid l-grid--row-gap-5"
                      v-if="form.researcher.usd_bank_account_number"
                    >
                      <span class="c-dictionary__key u-d-if u-ai-center">
                        <i class="fas fa-credit-card c-dictionary__key-icon"></i>
                        <span class="u-ml-10">Bank Account Number</span>
                      </span>
                      <span class="c-dictionary__value u-text-mute u-pl-26">
                        <span>{{ form.researcher.usd_bank_account_number }}</span>
                      </span>
                    </li>
                    <li
                      class="c-dictionary c-dictionary--font-sm l-grid l-grid--row-gap-5"
                      v-if="form.researcher.usd_bank_account_number && form.researcher.usd_bank_routing_number"
                    >
                      <span class="c-dictionary__key u-d-if u-ai-center">
                        <i class="fas fa-credit-card c-dictionary__key-icon"></i>
                        <span class="u-ml-10">Bank Routing Number</span>
                      </span>
                      <span class="c-dictionary__value u-text-mute u-pl-26">
                        <span>{{ form.researcher.usd_bank_routing_number }}</span>
                      </span>
                    </li>
                    <li
                      class="c-dictionary c-dictionary--font-sm l-grid l-grid--row-gap-5"
                      v-if="form.researcher.usd_bank_account_number"
                    >
                      <span class="c-dictionary__key u-d-if u-ai-center">
                        <i class="fas fa-credit-card c-dictionary__key-icon"></i>
                        <span class="u-ml-10">Account type</span>
                      </span>
                      <span class="c-dictionary__value u-text-mute u-pl-26">
                        <span>{{ form.researcher.usd_bank_type ? 'Checking account' : 'Savings account' }}</span>
                      </span>
                    </li>
                    <li
                      class="c-dictionary c-dictionary--font-sm l-grid l-grid--row-gap-5 u-br-0-0-3-3"
                      v-if="form.researcher.address.address1"
                    >
                      <span class="c-dictionary__key u-d-if u-ai-center">
                        <i class="fas fa-address-card c-dictionary__key-icon"></i>
                        <span class="u-ml-10">Full Address</span>
                      </span>
                      <span class="c-dictionary__value u-text-mute u-pl-26">
                        {{ fullAddress }}
                      </span>
                    </li>
                  </template>
                </ul>
              </div>
              <!-- /.c-box__body -->
              <div class="c-box__body" v-else>
                <p>Select Payee to view details</p>
              </div>
            </div>
            <!-- /.c-box -->
          </aside>
          <ValidationObserver ref="observer" v-slot="{ invalid, handleSubmit, validate }">
            <div class="c-form" autocomplete="off">
              <div class="c-box">
                <div class="c-box__header">
                  <h6 class="o-h6">New Transaction</h6>
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
                  <!-- /.l-grid--col-2-at-1280 -->

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
                  <!-- /.l-grid--col-2-at-1280 -->

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
                  <!-- /.l-grid--col-2-at-1280 -->

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
                      class="o-btn o-btn--outline o-btn--outline-coolgrey o-btn--rounded-sm o-btn--rounded-sm u-mr-15-at-768"
                      @click="cancelClick"
                    >
                      <span>Cancel</span>
                    </button>
                    <button
                      type="button"
                      class="o-btn o-btn--long o-btn--primary o-btn--rounded-sm"
                      :disabled="loading || invalid || !hasResearcher"
                      @click="createTransaction(validate)"
                    >
                      <span>Create Transaction</span>
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
        <!-- /.l-create-transaction -->
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
  name: 'CreateNewTransactionPage',
  mixins: [BankMixin, BreadcrumbsMixin, DatesMixin],
  components: {
    Datepicker,
    Money,
    ResearcherSearch,
    CFormErrors,
  },
  data() {
    return {
      defaultUserAvatar: '/static/images/avatar-person.svg',
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
      submissions: [],
    }
  },
  computed: {
    hasResearcher() {
      const researcher = this.form.researcher || null
      return researcher && researcher.uuid
    },
    isScheduledPayment() {
      return new Date(this.form.paymentDate) > this.today
    },
    submissionValidationRules() {
      const required = this.form.transactionType === 2
      return { required }
    },
    fullAddress() {
      let fullAddress = ''
      const { address1, address2, city, state, zip_code: ZIP_CODE, country } = this.form.researcher.address
      if (address1) {
        fullAddress = address1
      }
      fullAddress = address1 ? (fullAddress = `${address1}, `) : fullAddress
      fullAddress = address2 ? (fullAddress += `${address2}, `) : fullAddress
      fullAddress = city ? (fullAddress += `${city}, `) : fullAddress
      fullAddress = state ? (fullAddress += `${state}, `) : fullAddress
      fullAddress = ZIP_CODE ? (fullAddress += `${ZIP_CODE}, `) : fullAddress
      fullAddress = country ? (fullAddress += `${country} `) : fullAddress
      return fullAddress
    },
  },
  methods: {
    cancelClick() {
      this.$router.go(-1)
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
    async onResearcherSelected(researcher) {
      if (researcher && researcher.uuid) {
        researcher = await this.actionGetUserProfile(researcher.uuid)
      }

      this.form.researcher = researcher
      if (!researcher || !researcher.uuid) {
        this.submissions = []
        this.form.submission = ''
        return
      }

      await this.refreshSubmissionsList()
    },
    onSubmissionSelected(submissionUuid) {
      if (!submissionUuid) {
        this.form.submission = ''
        return
      }
      const submission = this.submissions.find(x => x.uuid === submissionUuid)
      this.form.program = submission.program_uuid
    },
    paymentDateSelected(date) {
      this.form.paymentDate = date
    },
    async createTransaction(validate) {
      const valid = validate()
      if (!valid) {
        this.$caAlert.error('Failed to create transaction')
        return
      }

      try {
        this.form.paymentDate = new Date(this.form.paymentDate)
        const transaction = await this.actionCreateTransaction(this.form)
        this.$caAlert.success('Transaction created')
        this.$router.push({
          name: 'TransactionDetails',
          params: {
            uuid: transaction.uuid,
          },
        })
      } catch (e) {
        const error = e && e.data && e.data.error ? e.data.error : 'Failed to create transaction'
        this.$caAlert.error(error)
      }
    },
    async initializeNewTransactionWithUser() {
      const userUuid = this.$route.params.userUuid || ''
      if (!userUuid) {
        return
      }

      this.loading = true
      this.$solar.show()
      try {
        const researcher = await this.actionGetUserProfile(userUuid)
        this.onResearcherSelected({
          uuid: researcher.uuid,
          user_name: researcher.username,
          profile_picture: researcher.profile_picture,
        })
      } catch (e) {
        this.$caAlert.error('Failed to set user profile')
      } finally {
        this.$solar.hide()
        this.loading = false
      }
    },
    async initializeNewTransactionWithProgram() {
      const programUuid = this.$route.params.programUuid || ''
      if (!programUuid) {
        return
      }

      this.loading = true
      this.$solar.show()
      try {
        const program = await this.actionGetProgram(programUuid)
        this.form.program = program.uuid
      } catch (e) {
        this.$caAlert.error('Failed to set program')
      } finally {
        this.$solar.hide()
        this.loading = false
      }
    },
  },
  async mounted() {
    this.loading = true
    this.$solar.show()
    try {
      await this.actionLoadProgramsList()
      await this.actionLoadTransactionTypes()
      await this.initializeNewTransactionWithUser()
      await this.initializeNewTransactionWithProgram()

      this.actionSetBreadcrumbs({
        parent: {
          route: this.$router.resolve({ name: 'Transactions' }).route,
          title: 'Bank',
        },
        child: {
          title: 'Transactions',
          route: this.$router.resolve({ name: 'TransactionsHistorical' }).route,
        },
        grandChild: {
          title: 'New',
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
