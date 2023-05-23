<template>
  <div class="c-form-validation" :class="statusClass">
    <ul class="error-list" v-show="errors">
      <li class="error-list-item">
        <p class="o-text o-text--error o-text--xxs">{{ errors[0] }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'c-form-errors',
  data() {
    return {}
  },
  computed: {
    statusClass() {
      return this.errors && this.errors[0] ? 'active' : 'inactive'
    },
  },
  props: {
    errors: {
      type: Array,
      default: () => [],
      required: true,
    },
  },
}
</script>

<style lang="scss">
.c-form-validation.active {
  margin-top: 0.5rem;
}
</style>
