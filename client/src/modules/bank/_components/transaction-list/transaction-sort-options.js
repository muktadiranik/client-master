export const TRANSACTION_SORT_OPTIONS = Object.freeze({
  Name: {
    id: 1,
    name: 'Name',
    description: 'Name (title) of the transaction.',
    property: 'title',
  },
  DateCreated: {
    id: 2,
    name: 'Date Created',
    description: 'Date the transaction was created.',
    property: 'date_created',
  },
  Status: {
    id: 3,
    name: 'Status',
    description: 'Status of the transaction.',
    property: 'paid',
  },
  Amount: {
    id: 4,
    name: 'Amount',
    description: 'Amount of the transaction.',
    property: 'amount',
  },
  PaymentDate: {
    id: 5,
    name: 'Payment Date',
    description: 'Date the payment was made',
    property: 'payment_date',
  },
})

export const getSortOptionById = id => {
  switch (id) {
    case 1:
      return TRANSACTION_SORT_OPTIONS.Name
    case 2:
      return TRANSACTION_SORT_OPTIONS.DateCreated
    case 3:
      return TRANSACTION_SORT_OPTIONS.Status
    case 4:
      return TRANSACTION_SORT_OPTIONS.Amount
    case 5:
      return TRANSACTION_SORT_OPTIONS.PaymentDate
    default:
      return TRANSACTION_SORT_OPTIONS.Name
  }
}
