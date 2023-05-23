<template>
  <div class="c-form__group u-position-relative researcher-search" v-click-outside="clickOutside">
    <label class="c-form__label c-form__label--small" for="payee">Payee</label>
    <div class="c-input-icon c-input-icon--left c-clear-input">
      <input
        type="text"
        class="o-input"
        id="payee-search"
        placeholder="Click to add payee..."
        data-lpignore="true"
        :value="searchTerms"
        @input="onInput($event.target.value)"
        @click="onInputClick"
        :readonly="readonly"
      />
      <i
        class="far fa-user-circle c-input-icon__element"
        v-show="!selectedResearcher || !selectedResearcher.profile_picture"
      >
      </i>
      <i
        class="far fa-times-circle c-clear-input__icon"
        @click="onResearcherSelected({})"
        v-show="selectedResearcher && selectedResearcher.profile_picture"
      >
      </i>
      <img
        class="c-input-icon__img"
        v-show="selectedResearcher && selectedResearcher.profile_picture"
        :src="selectedResearcher.profile_picture"
      />
    </div>
    <CesppaPopover :visible="showSearchResults" :title="searchResultsTitle">
      <template slot="content">
        <ul class="c-media-list c-media-list--font-sm c-media-list--smushed">
          <li
            class="c-media-list__item"
            v-for="(researcher, index) in researchers"
            :key="`researcher-${index}`"
            @click="onResearcherSelected(researcher)"
          >
            <div class="c-media c-media--sm">
              <img class="c-media__img c-media__img--circle" :src="researcher.profile_picture || defaultUserAvatar" />
              <strong class="c-media__text">{{ researcher.user_name }}</strong>
            </div>
          </li>
          <li class="c-media-list__item" v-show="(!researchers || researchers.length === 0) && searchTerms">
            <strong>No researchers found.</strong>
          </li>
        </ul>
      </template>
    </CesppaPopover>
  </div>
</template>

<script>
import { clickOutside } from '@/directives/click-outside'
import CesppaPopover from '@/modules/core/_components/cesppa-popover/CesppaPopover'
import { BankMixin } from '@/modules/bank/_mixins/bank'

export default {
  name: 'ResearcherSearch',
  components: {
    CesppaPopover,
  },
  directives: {
    clickOutside,
  },
  mixins: [BankMixin],
  props: {
    selectedResearcher: {
      type: Object,
      default: () => {},
      required: true,
    },
    readonly: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      searchTerms: '',
      showSearchResults: false,
      researchers: [],
      defaultUserAvatar: DEFAULT_USER_IMAGE,
    }
  },
  computed: {
    searchResultsTitle() {
      return !this.searchTerms ? 'Find a Payee' : `Results matching "${this.searchTerms}"`
    },
  },
  methods: {
    onResearcherSelected(researcher) {
      this.$emit('on-researcher-selected', researcher)
      this.searchTerms = ''
      this.showSearchResults = false
    },
    async onInput(val) {
      this.searchTerms = val
      if (!val) {
        this.showSearchResults = false
        this.researchers = []
        this.$emit('on-researcher-selected', {})
        return
      }
      const response = await this.actionSearchResearchers(this.searchTerms)
      this.researchers = response.data
      this.showSearchResults = true
    },
    onInputClick() {
      if (this.readonly) {
        return
      }
      this.showSearchResults = !this.showSearchResults
    },
    clickOutside() {
      this.showSearchResults = false
    },
  },
  watch: {
    async selectedResearcher(newVal, oldVal) {
      if (!newVal) {
        this.searchTerms = ''
        return
      }

      this.searchTerms = newVal.user_name
      const response = await this.actionSearchResearchers(this.searchTerms)
      this.researchers = response.data
    },
  },
}
</script>
