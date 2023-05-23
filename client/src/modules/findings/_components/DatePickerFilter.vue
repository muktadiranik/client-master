<template>
  <div>
    <form class="c-form l-findings-datepicker-bar u-flex-wrap">
      <div class="l-flex u-ai-center">
        <div class="c-input-icon c-input-icon--padding-sm">
          <datepicker
            wrapper-class="c-cesppa-calendar-container"
            calendar-class="c-cesppa-calendar"
            input-class="o-input o-input--date"
            id="startDate"
            placeholder="From Date"
            :name="'startDate'"
            :value="startDate"
            :use-utc="true"
            @selected="startDateSelected"
          />
          <i class="fal fa-calendar-alt c-input-icon__element"></i>
        </div>
      </div>
      <span class="o-text--dark o-text--500 u-ml-5 u-mr-5">-</span>
      <!-- /.c-form__group -->
      <div class="l-flex u-ai-center">
        <div class="c-input-icon c-input-icon--padding-sm u-mr-15">
          <datepicker
            wrapper-class="vdp-datepicker--custom"
            input-class="o-input o-input--date"
            calendar-class="c-cesppa-calendar"
            id="endDate"
            placeholder="To Date"
            :name="endDate"
            :value="endDate"
            :use-utc="true"
            @selected="endDateSelected"
          />
          <i class="fal fa-calendar-alt c-input-icon__element"></i>
        </div>
      </div>

      <!-- /.c-form__group -->
    </form>
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker'

export default {
  name: 'DatePickerFilter',
  components: {
    Datepicker,
  },
  props: {
    startDate: {
      type: String,
      default: '',
      required: true,
    },
    endDate: {
      type: String,
      default: '',
      required: true,
    },
  },
  methods: {
    startDateSelected(date) {
      this.$emit('on-start-date-selected', date)
    },
    endDateSelected(date) {
      this.$emit('on-end-date-selected', date)
    },
  },
}
</script>
