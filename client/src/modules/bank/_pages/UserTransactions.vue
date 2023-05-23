<template>
  <main class="c-site-main">
    <div class="u-pt-20 u-pb-20">
      <div class="l-wrap">
        <div class="u-mb-20 l-stack l-stack--horizontal l-stack--gap-10">
          <div class="u-d-f u-jc-fe-at-768" v-if="userIsProgramManager() || userIsBanker()">
            <button type="button" class="o-btn o-btn--primary o-btn--rounded-sm" @click="onNewTransactionClick">
              <i class="far fa-plus o-btn__icon-left"></i>New Transaction
            </button>
          </div>
        </div>

        <div class="l-user-transactions">
          <aside>
            <div class="c-box u-overflow-hidden">
              <div class="c-box__header">
                <div class="c-media c-media--lg">
                  <img
                    class="c-media__img u-img-rounded"
                    :src="userProfile.profile_picture || defaultUserAvatar"
                    :alt="userProfile.username"
                  />
                  <div class="c-media__body">
                    <h6 class="o-h6">
                      {{ `${userProfile.first_name} ${userProfile.last_name}` }}
                    </h6>
                    <div class="o-text o-text--sm u-fw-700 u-text-mute">
                      {{ userProfile.username }}
                    </div>
                  </div>
                </div>
              </div>
              <!-- /.c-box__header -->
              <div class="c-box__body u-p-0">
                <ul class="c-list-group c-list-group--flush c-list-group--striped-odd">
                  <li class="c-dictionary c-dictionary--font-sm l-grid l-grid--row-gap-5">
                    <div class="c-dictionary__key u-text-mute">Default Payment Method</div>
                    <div class="c-dictionary__value" v-if="paymentInfo">
                      {{ paymentInfo.default_payment_method_display }}
                    </div>
                    <div class="c-dictionary__value" v-if="!paymentInfo">None</div>
                  </li>
                  <li
                    class="c-dictionary c-dictionary--font-sm l-grid l-grid--row-gap-5"
                    v-if="paymentInfo && paymentInfo.paypal_email"
                  >
                    <div class="c-dictionary__key u-text-mute">PayPal Email Address</div>
                    <div class="c-dictionary__value u-d-f u-ai-center">
                      {{ paymentInfo.paypal_email }}
                      <i
                        class="far fa-check u-ml-10 u-color-primary"
                        v-if="paymentInfo.default_payment_method === 2"
                      ></i>
                    </div>
                  </li>
                  <li
                    class="c-dictionary c-dictionary--font-sm l-grid l-grid--row-gap-5"
                    v-if="paymentInfo && paymentInfo.payoneer_email"
                  >
                    <div class="c-dictionary__key u-text-mute">Payoneer Email Address</div>
                    <div class="c-dictionary__value u-d-f u-ai-center">
                      {{ paymentInfo.payoneer_email }}
                      <i
                        class="far fa-check u-ml-10 u-color-primary"
                        v-if="paymentInfo.default_payment_method === 6"
                      ></i>
                    </div>
                  </li>
                  <li
                    class="c-dictionary c-dictionary--font-sm l-grid l-grid--row-gap-5"
                    v-if="paymentInfo && paymentInfo.btc_wallet_address"
                  >
                    <div class="c-dictionary__key u-text-mute">BTC Wallet Address</div>
                    <div class="c-dictionary__value">
                      {{ paymentInfo.btc_wallet_address
                      }}<i class="far fa-check right" v-if="paymentInfo.default_payment_method === 3"></i>
                    </div>
                  </li>
                  <li
                    class="c-dictionary c-dictionary--font-sm l-grid l-grid--row-gap-5"
                    v-if="paymentInfo && paymentInfo.eth_wallet_address"
                  >
                    <div class="c-dictionary__key u-text-mute">ETH Wallet Address</div>
                    <div class="c-dictionary__value">
                      {{ paymentInfo.eth_wallet_address
                      }}<i class="far fa-check right" v-if="paymentInfo.default_payment_method === 4"></i>
                    </div>
                  </li>
                  <li
                    class="c-dictionary c-dictionary--font-sm l-grid l-grid--row-gap-5"
                    v-if="hasBankInfo && bankInfo.usd_bank_type_display"
                  >
                    <div class="c-dictionary__key u-text-mute">Bank Account Type</div>
                    <div class="c-dictionary__value">
                      {{ bankInfo.usd_bank_type_display
                      }}<i class="far fa-check right" v-if="paymentInfo.default_payment_method === 5"></i>
                    </div>
                  </li>
                  <li
                    class="c-dictionary c-dictionary--font-sm l-grid l-grid--row-gap-5"
                    v-if="hasBankInfo && bankInfo.usd_bank_account_number"
                  >
                    <div class="c-dictionary__key u-text-mute">Bank Account Number</div>
                    <div class="c-dictionary__value">{{ bankInfo.usd_bank_account_number }}</div>
                  </li>
                  <li
                    class="c-dictionary c-dictionary--font-sm l-grid l-grid--row-gap-5"
                    v-if="hasBankInfo && bankInfo.usd_bank_routing_number"
                  >
                    <div class="c-dictionary__key u-text-mute">Bank Routing Number</div>
                    <div class="c-dictionary__value">{{ bankInfo.usd_bank_routing_number }}</div>
                  </li>
                  <li class="c-dictionary c-dictionary--font-sm l-grid l-grid--row-gap-5">
                    <div class="c-dictionary__key u-text-mute">Oldest Pending Transaction</div>
                    <div class="c-dictionary__value">
                      {{ userProfile.earliest_pending_transaction }}
                    </div>
                  </li>
                </ul>
              </div>
              <!-- /.c-box -->
              <div class="c-box__footer" v-show="userProfile.balance && userProfile.balance > 0">
                <div>
                  <button class="o-btn o-btn--primary o-btn--rounded-sm o-btn--block" @click="onPayNowClick">
                    <span>Pay ${{ userProfile.balance }}</span>
                  </button>
                </div>
              </div>
              <!-- /.c-box -->
            </div>
            <!-- /.c-box -->
          </aside>

          <div class="u-overflow-hidden-with-box-shadow">
            <UserPendingTransactions />

            <div class="u-mt-20">
              <TransactionList
                :sort-option="sortOption"
                :sort-order="sortOrder"
                :filter-option="filterOption"
                :current-page="transactionsQuery.page"
                :page-count="transactionsQuery.total_pages"
                :transaction-count="transactionsQuery.count"
                :transactions="transactions"
                :options="{ disableFilter: true }"
                :isPaid="true"
                @filter-changed="onFilterChange"
                @sort-changed="onSortChange"
                @page-changed="onPageChange"
              />
            </div>
          </div>
        </div>
        <!--  /.l-user-transactions -->
      </div>
      <!--  /.l-wrap -->
    </div>
  </main>
</template>

<script>
import { AccountMixin } from '@/mixins/account'
import { BreadcrumbsMixin } from '@/mixins/breadcrumbs'
import TransactionList from '@/modules/bank/_components/transaction-list/TransactionList'
import UserPendingTransactions from '@/modules/bank/_components/UserPendingTransactions'
import { BankMixin } from '@/modules/bank/_mixins/bank'
import { UserTransactionsMixin } from '@/modules/bank/_mixins/user-transactions'

import { STORE_KEY } from '@/stores/user-transactions/types'
import store from '@/stores/user-transactions'

export default {
  name: 'UserTransactions',
  components: {
    TransactionList,
    UserPendingTransactions,
  },
  mixins: [AccountMixin, BankMixin, BreadcrumbsMixin, UserTransactionsMixin],
  data() {
    return {
      defaultUserAvatar: DEFAULT_USER_IMAGE,
    }
  },
  computed: {
    bankInfo() {
      if (!this.paymentInfo) {
        return null
      }

      return this.paymentInfo.usd_bank || null
    },
    hasBankInfo() {
      if (!this.bankInfo) {
        return false
      }

      if (!this.bankInfo.usd_bank_account_number) {
        return false
      }

      return true
    },
    paymentInfo() {
      if (!this.userProfile) {
        return null
      }
      return this.userProfile.payment_info || null
    },
  },
  methods: {
    onQueryChanged(query) {
      this.actionSetTransactionsQuery(query)
    },
    async onPageChange(page) {
      await this.actionSetTransactionsQueryPage(page)
    },
    async onFilterChange(option) {
      await this.actionSetFilterOption(option)
    },
    async onSortChange(option) {
      await this.actionSetSortOption(option)
    },
    onNewTransactionClick() {
      const uuid = this.$route.params.uuid
      this.$router.push({
        name: 'TransactionCreate',
        params: {
          userUuid: uuid,
        },
      })
    },
    onPayNowClick() {
      this.$router.push({
        name: 'PaymentCreate',
        params: { userUuid: this.$route.params.uuid },
      })
    },
  },
  async mounted() {
    if (!(STORE_KEY in this.$store._modules.root._children)) {
      this.$store.registerModule(this.storeKey, store)
    }

    this.$solar.show()
    const userProfileUuid = this.$route.params.uuid
    await this.actionResetStore()
    await this.actionLoadUserProfile(userProfileUuid)
    await this.actionLoadTransactions()
    await this.actionSetRoute()

    this.actionSetBreadcrumbs({
      parent: {
        title: 'Users',
      },
      child: {
        title: this.userProfile.username,
        route: this.$route,
        copyValue: this.userProfile.uuid,
      },
      grandChild: {
        title: 'Transactions',
        route: this.$route,
      },
    })

    this.$solar.hide()
  },
  created() {
    if (!(STORE_KEY in this.$store._modules.root._children)) {
      this.$store.registerModule(STORE_KEY, store)
    }
  },
  async beforeDestroy() {
    await this.actionResetStore()
  },
}
</script>
