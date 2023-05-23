<template>
  <div class="c-modal" v-if="visible">
    <div class="c-modal__inner u-br-3">
      <div class="c-modal__header">
        <h6 class="o-h6 u-color-white">Template Keyword Legend</h6>
        <div @click="$emit('on-close-legend')">
          <i class="fal fa-times u-cursor-pointer u-font-150"></i>
        </div>
      </div>
      <div class="c-modal__body">
        <!-- Global Keywords -->
        <div class="u-mb-30">
          <h6 class="o-h6 u-mb-10">Global Keywords</h6>
          <div class="o-table-responsive">
            <table class="o-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Syntax</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(keyword, index) in globalKeywords" :key="`keyword-${index}`">
                  <td class="u-text-nowrap">{{ keyword.name }}</td>
                  <td class="u-text-nowrap">
                    <code>{{ keyword.syntax }}</code>
                  </td>
                  <td class="u-minw-200">{{ keyword.description }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Findings Keywords -->
        <div class="u-mb-30">
          <h6 class="o-h6 u-mb-10">Findings Keywords</h6>
          <div class="o-table-responsive">
            <table class="o-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Syntax</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(keyword, index) in findingsKeywords" :key="`keyword-${index}`">
                  <td class="u-text-nowrap">{{ keyword.name }}</td>
                  <td class="u-text-nowrap">
                    <code>{{ keyword.syntax }}</code>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Chart Keywords -->
        <div>
          <h6 class="o-h6 u-mb-10">Chart Keywords</h6>
          <div class="o-table-responsive">
            <table class="o-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Syntax</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(keyword, index) in chartKeywords" :key="`keyword-${index}`">
                  <td class="u-text-nowrap">{{ keyword.name }}</td>
                  <td class="u-text-nowrap">
                    <code>{{ keyword.syntax }}</code>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'KeywordLegend',
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  data() {
    return {
      globalKeywords: [
        {
          name: 'Company Name',
          syntax: '{{ company_name }}',
          description: 'Company name of the selected program(s)',
        },
        {
          name: 'Date From',
          syntax: '{{ date_from }}',
          description: 'End Date of date range used to filter Findings',
        },
        {
          name: 'Date To',
          syntax: '{{ date_to }}',
          description: 'Start Date of date range used to filter Findings',
        },
        {
          name: 'Date Generated',
          syntax: '{{ date_generated }}',
          description: 'Date of report generation',
        },
        {
          name: 'Finding Count',
          syntax: '{{ findings_count }}',
          description: 'Total number of findings included in the report',
        },
        {
          name: 'Report Title',
          syntax: '{{ report_title }}',
          description: 'Title of the report',
        },
      ],
      findingsKeywords: [
        { name: 'Date Completed', syntax: '{{ finding.date_completed }}' },
        { name: 'Details', syntax: '{{ finding.details }}' },
        { name: 'Program Title', syntax: '{{ finding.program.title }}' },
        { name: 'Resolution', syntax: '{{ finding.get_resolution_display }}' },
        { name: 'Severity', syntax: '{{ finding.get_priority_display }}' },
        { name: 'Title', syntax: '{{ finding.title }}' },
      ],
      chartKeywords: [
        {
          name: 'Findings by Severity (Donut)',
          syntax: '<img src="{{ chart_donut_findings_by_severity }}" style="width:300px; height: 300px;">',
        },
      ],
    }
  },
}
</script>

<style lang="scss"></style>
