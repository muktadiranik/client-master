<template>
  <div>
    <program-visibility-block
      :program="program"
      :researcher-search-results="researcherSearchResults"
      :researcher-search-text="researcherSearchText"
      :program-actions-disabled="programActionsDisabled"
      @on-researcher-action="onResearcherAction"
      @on-researcher-search-text-input="researcherSearchTextInput"
      @on-toggle-visibility="programVisibilityToggle"
    />
  </div>
</template>

<script>
import { AccountMixin } from '@/mixins/account'
import ProgramVisibilityBlock from '@/modules/program-settings/_components/ProgramVisibilityBlock'

export default {
  name: 'ProgramSettingsGeneral',
  mixins: [AccountMixin],
  props: {
    program: {
      type: Object,
      default: () => {},
      required: true,
    },
    researcherSearchText: {
      type: String,
      default: '',
      required: true,
    },
    researcherSearchResults: {
      type: Array,
      default: () => [],
      required: true,
    },
    programActionsDisabled: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  components: {
    ProgramVisibilityBlock,
  },
  data() {
    return {}
  },
  computed: {},
  methods: {
    onResearcherAction(data) {
      this.$emit('on-researcher-action', {
        researcher: data.researcher,
        action: data.action,
      })
    },
    programVisibilityToggle() {
      this.$emit('on-toggle-visibility')
    },
    researcherSearchTextInput(value) {
      this.$emit('on-researcher-search-text-input', value)
    },
  },
}
</script>
