<template>
  <li class="field-mappings-list__item">
    <div class="field jira-field">
      {{ cesppaField.name }}
    </div>
    <div>maps to</div>
    <div class="field custom-field">
      <div class="c-select-container">
        <select
          class="form__control"
          :id="`field-map-select-${cesppaField.name}`"
          :name="`field-map-select-${cesppaField.name}`"
          v-model="fieldMapModel"
        >
          <option value>Select an issue type...</option>
          <option
            v-for="(jiraField, index) in jiraFields"
            :key="`jira-field-${index}`"
            :value="JSON.stringify(jiraField)"
            >{{ jiraField.name }}</option
          >
        </select>
      </div>
    </div>
  </li>
</template>

<script>
export default {
  name: 'JiraFieldMapping',
  data() {
    return {}
  },
  props: {
    cesppaField: {
      type: Object,
      default: () => {},
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
  computed: {
    fieldMapModel: {
      get() {
        return JSON.stringify(this.jiraFieldMapForm[this.cesppaField.name])
      },
      set(val) {
        const payload = {
          cesppaField: this.cesppaField.name,
          jiraField: JSON.parse(val),
        }
        this.$emit('on-map-field-selected', payload)
      },
    },
  },
}
</script>
