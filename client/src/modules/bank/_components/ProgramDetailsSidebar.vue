<template>
  <aside>
    <div class="c-box u-overflow-hidden">
      <div class="c-box__header" v-if="program.highest_paid_researcher">
        <div class="l-grid l-grid--row-gap-10">
          <div>
            <div class="c-media c-media--lg">
              <img
                class="c-media__img u-img-rounded"
                :src="program.highest_paid_researcher.profile_picture || defaultUserAvatar"
                alt="Max"
              />
              <div class="c-media__body">
                <div>
                  <h6 class="o-h6">
                    {{ `${program.highest_paid_researcher.first_name} ${program.highest_paid_researcher.last_name}` }}
                    <span class="u-d-b o-text o-text--sm u-fw-700 u-text-mute">{{
                      program.highest_paid_researcher.username
                    }}</span>
                  </h6>
                  <div class="u-mt-5">
                    <div class="c-badge">Highest Paid Researcher</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- /.c-box__header -->
      <div class="c-box__header" v-else>
        <h6 class="o-h6">Payment Stats</h6>
      </div>
      <div class="c-box__body u-p-0">
        <ul class="c-list-group c-list-group--flush c-list-group--striped-odd">
          <li class="c-dictionary c-dictionary--font-sm l-grid l-grid--row-gap-5">
            <div class="u-text-mute">Total Payments</div>
            <div>{{ program.total_payments || 0 }}</div>
          </li>
          <li class="c-dictionary c-dictionary--font-sm l-grid l-grid--row-gap-5">
            <div class="u-text-mute">Paid to Researchers</div>
            <div>${{ program.total_paid || 0 }}</div>
          </li>
          <li class="c-dictionary c-dictionary--font-sm l-grid l-grid--row-gap-5">
            <div class="u-text-mute">Paid in the last 30 Days</div>
            <div>${{ program.total_paid_last_30_days || 0 }}</div>
          </li>
          <li
            class="c-dictionary c-dictionary--font-sm l-grid l-grid--row-gap-5"
            v-if="program.highest_paid_researcher"
          >
            <div class="u-text-mute">Highest Paid Researcher Amount</div>
            <div>${{ program.highest_paid_researcher.amount }}</div>
          </li>
          <li class="c-dictionary c-dictionary--font-sm l-grid l-grid--row-gap-5">
            <div class="u-text-mute">Highest Paid Bounty</div>
            <div>${{ program.highest_paid_bounty || 0 }}</div>
          </li>
          <li class="c-dictionary c-dictionary--font-sm l-grid l-grid--row-gap-5">
            <div class="u-text-mute">Program Life</div>
            <div>{{ program.program_life }}</div>
          </li>
          <li>
            <div class="u-d-f u-jc-center">
              <button
                type="button"
                v-if="userIsProgramManager() || userIsBanker()"
                class="o-btn o-btn--long o-btn--sm o-btn--primary o-btn--rounded-sm u-d-if u-ai-center"
                @click="onNewTransactionClick"
              >
                <i class="far fa-plus u-mr-5"></i>New Transaction
              </button>
            </div>
          </li>
        </ul>
      </div>
      <!-- /.c-box__body -->
    </div>
    <!-- /.c-box -->
  </aside>
</template>

<script>
import { BankMixin } from '@/modules/bank/_mixins/bank'
import { AccountMixin } from '@/mixins/account'

export default {
  name: 'ProgramDetailsSidebar',
  mixins: [BankMixin, AccountMixin],
  props: {
    program: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  data() {
    return {
      defaultUserAvatar: DEFAULT_USER_IMAGE,
    }
  },
  computed: {},
  methods: {
    onNewTransactionClick() {
      this.$router.push({
        name: 'TransactionCreate',
        params: {
          programUuid: this.$route.params.uuid,
        },
      })
    },
  },
}
</script>
