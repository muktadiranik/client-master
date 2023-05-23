import { userTypeGuard } from '@/router/route-guards'
import { BANKER, PROGRAM_MANAGER, RESEARCHER } from '@/modules/core/models/user-types'

export default [
  {
    path: '/bank/transactions',
    name: 'Transactions',
    redirect: '/bank/transactions/pending',
    component: () => import(/* webpackChunkName: "bank-transactions" */ '@/modules/bank/_pages/Transactions'),
    meta: {
      secure: true,
      title: 'Inspectiv | Bank - Transactions',
      linkText: 'Transactions',
    },
    beforeEnter: userTypeGuard([PROGRAM_MANAGER, BANKER]),
    children: [
      {
        path: 'pending',
        name: 'TransactionsPending',
        component: () =>
          import(/* webpackChunkName: "bank-transactions" */ '@/modules/bank/_pages/TransactionsPending.vue'),
        meta: { secure: true, title: VUE_APP_TITLE },
      },
      {
        path: 'historical',
        name: 'TransactionsHistorical',
        component: () =>
          import(/* webpackChunkName: "bank-transactions" */ '@/modules/bank/_pages/TransactionsHistorical.vue'),
        meta: { secure: true, title: VUE_APP_TITLE },
      },
    ],
  },
  {
    //     /bank/programs/LBFiJF2bv3mF4pHo2JdxBA/transactions
    path: '/bank/programs/:uuid([A-Za-z0-9]{22})/transactions',
    name: 'ProgramTransactions',
    component: () =>
      import(/* webpackChunkName: "bank-program-transactions" */ '@/modules/bank/_pages/ProgramTransactions'),
    meta: {
      secure: true,
      title: 'Inspectiv | Bank - Program Transactions',
      linkText: 'Program Transactions',
    },
    beforeEnter: userTypeGuard([PROGRAM_MANAGER, BANKER]),
    params: { uuid: '' },
  },
  {
    //     /bank/users/LBFiJF2bv3mF4pHo2JdxBA/transactions
    path: '/bank/users/:uuid([A-Za-z0-9]{22})/transactions',
    name: 'UserTransactions',
    component: () => import(/* webpackChunkName: "bank-user-transactions" */ '@/modules/bank/_pages/UserTransactions'),
    meta: {
      secure: true,
      title: 'Inspectiv | Bank - User Transactions',
      linkText: 'Researcher Transactions',
    },
    beforeEnter: userTypeGuard([PROGRAM_MANAGER, BANKER]),
  },
  {
    path: '/bank/transactions/:uuid([A-Za-z0-9]{22})',
    name: 'TransactionDetails',
    component: () =>
      import(/* webpackChunkName: "bank-transaction-details" */ '@/modules/bank/_pages/TransactionDetailsPage'),
    meta: {
      secure: true,
      title: 'Inspectiv | Bank - Transaction Details',
      linkText: 'Transaction Details',
    },
    beforeEnter: userTypeGuard([PROGRAM_MANAGER, BANKER, RESEARCHER]),
    params: {
      uuid: '',
    },
  },
  {
    path: '/bank/transactions/:uuid/edit',
    name: 'TransactionEdit',
    component: () => import(/* webpackChunkName: "bank-transaction-edit" */ '@/modules/bank/_pages/EditTransaction'),
    meta: {
      secure: true,
      title: 'Inspectiv | Bank - Edit Transaction',
      linkText: 'Edit Transaction',
    },
    beforeEnter: userTypeGuard([PROGRAM_MANAGER, BANKER]),
    params: {
      uuid: '',
    },
  },
  {
    path: '/bank/transactions/create',
    name: 'TransactionCreate',
    component: () =>
      import(/* webpackChunkName: "bank-transaction-create" */ '@/modules/bank/_pages/CreateNewTransactionPage'),
    meta: {
      secure: true,
      title: 'Inspectiv | Bank - Create New Transaction',
      linkText: 'Create Transaction',
    },
    params: {
      userUuid: '',
      programUuid: '',
    },
    beforeEnter: userTypeGuard([PROGRAM_MANAGER, BANKER]),
  },
  {
    path: '/bank/payments/:uuid',
    name: 'PaymentDetailsPage',
    component: () => import(/* webpackChunkName: "bank-payment-details" */ '@/modules/bank/_pages/PaymentDetailsPage'),
    meta: {
      secure: true,
      title: 'Inspectiv | Bank - Payment Details Page',
      linkText: 'Payment Details',
    },
    beforeEnter: userTypeGuard([RESEARCHER, PROGRAM_MANAGER, BANKER]),
  },
  {
    path: '/bank/payments/new/:userUuid/transaction-selection',
    name: 'PaymentCreate',
    component: () =>
      import(/* webpackChunkName: "bank-payment-create-transaction-selection" */ '@/modules/bank/_pages/PaymentCreate'),
    meta: {
      secure: true,
      title: 'Inspectiv | Bank - Choose Transactions',
      linkText: 'Create Payment',
    },
    params: {
      userUuid: '',
    },
    beforeEnter: userTypeGuard([PROGRAM_MANAGER, BANKER]),
  },
  {
    path: '/bank/payments/edit/:uuid/transaction-selection',
    name: 'PaymentEdit',
    component: () =>
      import(/* webpackChunkName: "bank-payment-edit-transaction-selection" */ '@/modules/bank/_pages/PaymentEdit'),
    meta: {
      secure: true,
      title: 'Inspectiv | Bank - Choose Transactions',
      linkText: 'Edit Payment',
    },
    params: {
      uuid: '',
    },
    beforeEnter: userTypeGuard([PROGRAM_MANAGER, BANKER]),
  },
  {
    //     /bank/profile/uuid
    path: '/bank/my-payments',
    name: 'UserProfileTransactions',
    component: () =>
      import(/* webpackChunkName: "bank-user-profile-transactions" */ '@/modules/bank/_pages/UserProfileTransactions'),
    meta: {
      secure: true,
      title: 'Inspectiv | Bank - User Profile Transactions',
      linkText: 'Researcher Transactions',
    },
    beforeEnter: userTypeGuard([RESEARCHER]),
  },
]
