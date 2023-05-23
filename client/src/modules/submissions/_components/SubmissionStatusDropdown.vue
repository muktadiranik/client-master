<template>
  <div class="dropdownContainer" v-click-outside="hideDropdown">
    <button
      v-if="editingEnabled"
      class="button text dropdownButton"
      :class="submissionStatusClass"
      @click="toggleDropdown"
      v-dynamic-color
    >
      <span>{{ submissionStatusTitle }}</span>
      <i class="far fa-angle-down right"></i>
    </button>
    <span class="submission-status-readonly" :class="submissionStatusClass" v-if="!editingEnabled" v-dynamic-color>{{
      submissionStatusTitle
    }}</span>
    <ul class="dropdownMenu" v-show="expanded" v-dynamic-color>
      <li
        v-for="status in submissionStatuses"
        :key="`status-${status.name}`"
        :value="status.id"
        :class="{ disabled: submission.status === status.id }"
        @click="updateSubmissionStatus(status)"
      >
        {{ status.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import { AccountMixin } from '@/mixins/account'
import { mapActions, mapGetters, mapState } from 'vuex'
import { clickOutside } from '@/directives/click-outside'
import { dynamicColor } from '@/directives/dynamic-color'
import { STORE_KEY, GET_SUBMISSION } from '@/modules/submissions/_store/types'

export default {
  name: 'SubmissionStatusDropdown',
  mixins: [AccountMixin],
  props: {
    editingEnabled: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  directives: {
    clickOutside,
    dynamicColor,
  },
  data() {
    return {
      expanded: false,
    }
  },
  computed: {
    ...mapState(STORE_KEY, {
      submissionStatuses: state => state.submissionStatuses,
    }),
    ...mapGetters(STORE_KEY, {
      submission: GET_SUBMISSION,
    }),
    submissionStatusClass() {
      return {
        deleted: this.submission.deleted,
      }
    },
    submissionStatusTitle() {
      if (!this.submission || !this.submissionStatuses) {
        return ''
      }

      const status = this.submissionStatuses.find(x => x.id === this.submission.status)
      if (!status) {
        return ''
      }

      return status.name
    },
  },
  methods: {
    ...mapActions(STORE_KEY, {}),
    updateSubmissionStatus(status) {
      if (this.submission.status === status.id) {
        return
      }
      this.$emit('on-update-status', status)
    },
    toggleDropdown() {
      this.expanded = !this.expanded
    },
    hideDropdown() {
      this.expanded = false
    },
  },
}
</script>
