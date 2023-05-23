<template>
  <router-link :to="{ name: 'Program', params: { uuid: program.uuid } }">
    <div class="c-program-card">
      <div>
        <div class="l-flex u-ai-center u-jc-sb">
          <img :src="program.image || defaultProgramImage" :alt="program.title" class="c-program-card__logo-img" />
          <div class="c-program-card__header-meta">
            <ProgramFavoriteButton
              :program-uuid="program.uuid"
              v-if="this.userIsProgramManager() || this.userIsResearcher()"
            />
          </div>
        </div>
        <div class="c-program-card__status">
          <ProgramStatusBadge :status="program.status" v-if="program.status !== 'Active'" />
        </div>
      </div>
      <router-link :to="{ name: 'Program', params: { uuid: program.uuid } }" class="c-program-card__title">
        <i v-show="featured" class="u-fs-16 fas fa-star"></i>
        <span>
          {{ program.title }}
        </span>
      </router-link>
      <div class="c-program-card__byline" v-if="program.company_name">by {{ program.company_name }}</div>
      <p class="c-program-card__copy">
        {{ programDetails }}
      </p>
      <div class="l-flex u-mt-10 u-ai-center" v-show="!featured && !this.userIsAppOwner()">
        <div class="u-mr-10 o-text--gray">
          <i class="fal fa-money-bill-wave u-mr-2"></i> <span>${{ program.payout_range }}</span>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script>
import { AccountMixin } from '@/mixins/account'
import ProgramStatusBadge from '@/modules/programs/_components/ProgramStatusBadge'
import ProgramFavoriteButton from '../_components/ProgramFavoriteButton'

export default {
  name: 'ProgramCardItem',
  mixins: [AccountMixin],
  props: {
    program: {
      type: Object,
      default: () => {},
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  components: {
    ProgramStatusBadge,
    ProgramFavoriteButton,
  },
  data() {
    return {
      defaultProgramImage: DEFAULT_COMPANY_IMAGE,
    }
  },
  computed: {
    favoriteIconClass() {
      return this.program.favorited ? 'fas fa-bookmark' : 'fal fa-bookmark'
    },
    backdropClass() {
      return this.getUserType().replace('_', '-')
    },
    backdropStyle() {
      if (!this.program.color) {
        return {}
      }

      return {
        backgroundColor: `${this.program.color}`,
      }
    },
    programDetails() {
      return this.program && this.program.short_description ? this.program.short_description : ''
    },
  },
  methods: {
    favoriteClick() {
      this.$emit('program-favorite-click', this.program.uuid)
    },
  },
}
</script>
