export const TRANSACTION_FILTER_OPTIONS = Object.freeze({
  All: {
    id: 1,
    name: 'All',
    description: 'Transactions and payments.',
    property: 'all',
  },
  Transactions: {
    id: 2,
    name: 'Transactions',
    description: 'Transactions only.',
    property: 'transactions',
  },
  Payments: {
    id: 3,
    name: 'Payments',
    description: 'Payments only.',
    property: 'payments',
  },
})

export const getFilterOptionById = id => {
  switch (id) {
    case 1:
      return TRANSACTION_FILTER_OPTIONS.All
    case 2:
      return TRANSACTION_FILTER_OPTIONS.Transactions
    case 3:
      return TRANSACTION_FILTER_OPTIONS.Payments
    default:
      return TRANSACTION_FILTER_OPTIONS.All
  }
}
