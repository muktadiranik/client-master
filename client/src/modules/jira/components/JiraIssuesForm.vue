<template>
  <div class="u-mt-20">
    <div class="c-box">
      <div class="c-box__header">
        <h6 class="o-h6">Create Issues</h6>
      </div>
      <!-- /.c-box__header -->
      <div class="c-box__body">
        <p>Select which fields you would like to map to populated Jira issues.</p>
        <form class="c-form" v-if="cesppaFields.length > 0">
          <div class="c-form__group">
            <label class="c-form__label c-form__label--small">Field Mappings</label>
            <ul>
              <jira-field-mapping
                v-for="(cesppaField, index) in cesppaFields"
                :cesppa-field="cesppaField"
                :jira-fields="jiraFields"
                :mapped-fields="mappedFields"
                :key="`field-mapping-${index}`"
                :jira-field-map-form="jiraFieldMapForm"
                @on-map-field-selected="onMapFieldSelected"
              />
            </ul>
          </div>
        </form>
      </div>
      <!-- /.c-box__body -->
      <div class="c-box__footer">
        <div class="u-flex-buttons">
          <button class="o-btn o-btn--primary o-btn--sm o-btn--rounded-sm" @click="createIssues" :disabled="saving">
            <span>Create Issues</span>
          </button>
        </div>
      </div>
      <!-- /.c-box__footer -->
    </div>
  </div>
</template>

<script>
import JiraFieldMapping from '@/modules/jira/components/JiraFieldMapping'
export default {
  name: 'JiraIssuesForm',
  components: {
    JiraFieldMapping,
  },
  data() {
    return {
      saving: false,
    }
  },
  props: {
    cesppaFields: {
      type: Array,
      default: () => [],
      required: true,
    },
    jiraFields: {
      type: Array,
      default: () => [],
      required: true,
    },
    mappedFields: {
      type: Array,
      default: () => [],
      required: true,
    },
    jiraFieldMapForm: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  methods: {
    onMapFieldSelected(fieldMap) {
      this.$emit('on-map-field-selected', fieldMap)
    },
    createIssues() {
      this.$emit('on-create-issues')
    },
  },
}
</script>
