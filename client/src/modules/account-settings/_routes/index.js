export default [
  {
    path: '/account/',
    name: 'AccountSettings',
    redirect: 'account/overview',
    component: () =>
      import(/* webpackChunkName: "account-settings" */ '@/modules/account-settings/_pages/AccountSettings'),
    meta: { secure: true, title: VUE_APP_TITLE },
    children: [
      {
        path: 'overview',
        name: 'AccountSettingsOverview',
        component: () =>
          import(
            /* webpackChunkName: "account-settings-overview" */ '@/modules/account-settings/_components/AccountSettingsOverview.vue'
          ),
        meta: { secure: true, title: VUE_APP_TITLE },
      },
    ],
  },
]
