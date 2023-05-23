export const TableOptionsMixin = {
  data() {
    return {
      defaultTableOptions: {
        disableFilter: false,
        disableRowToggle: false,
        title: 'All Transactions',
      },
    }
  },
  props: {
    options: {
      type: Object,
      default: () => {},
      required: false,
    },
  },
  computed: {
    tableOptions() {
      return {
        ...this.defaultTableOptions,
        ...this.options,
      }
    },
  },
}
