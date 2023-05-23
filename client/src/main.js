// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueAnalytics from 'vue-analytics'
import VModal from 'vue-js-modal'
import VueMarkdown from 'vue-markdown'
import VueSimplemde from 'vue-simplemde'
import VueScrollTo from 'vue-scrollto'
import CaAlerts from '@/plugins/ca-alerts'
import CaDialogs from '@/plugins/ca-dialogs'
import CaSolar from '@/plugins/ca-solar'
import store from '@/stores'
import 'bootstrap/dist/js/bootstrap.min.js'
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate'
// eslint-disable-next-line camelcase
import { required, email, regex, required_if, min_value } from 'vee-validate/dist/rules'

import HttpInterceptor from '@/http/http-auth-interceptor'
import './scss/style.scss'

import 'prismjs'
import 'prismjs/themes/prism.css'
import VuePrismEditor from 'vue-prism-editor'
import 'vue-prism-editor/dist/VuePrismEditor.css' // import the styles

import bugsnagClient from '@/bugsnag'
import bugsnagVue from 'bugsnag-vue'
import Donut from 'vue-css-donut-chart'
import 'vue-css-donut-chart/dist/vcdonut.css'
import 'simplemde-theme-base/dist/simplemde-theme-base.min.css'
import { SET_USER, STORE_KEY } from '@/stores/account/types'
import AccountService from '@/services/api/account-service'

Vue.use(Donut)

bugsnagClient.use(bugsnagVue(Vue))

Vue.component('prism-editor', VuePrismEditor)

Vue.use(VueAnalytics, {
  id: 'UA-129001852-1',
  router,
  checkDuplicatedScript: true,
})

Vue.use(CaAlerts)
Vue.use(CaDialogs)
Vue.use(CaSolar)
Vue.use(VueScrollTo)
Vue.use(VueMarkdown)
Vue.use(VModal, { dynamic: true })

Vue.component('markdown-editor', VueSimplemde)

// Vee-Validate
Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)

extend('email', email)
extend('password', {
  params: ['target'],
  validate(value, { target }) {
    return value === target
  },
  message: 'Password confirmation does not match',
})
extend('required', {
  ...required,
  message: 'This field is required',
})
extend('regex', regex)
extend('required_if', required_if)
extend('min_value', min_value)

Vue.config.productionTip = false
Vue.config.keyCodes = {
  arrowKeys: [37, 38, 39, 40],
  up: 38,
  down: 40,
}

HttpInterceptor()

/* eslint-disable no-new */

const localStorageToken = localStorage.getItem('inspectiv')

const vueApp = {
  el: '#app',
  router: router,
  components: {
    App,
    vueMarkdown: VueMarkdown,
  },
  template: '<App/>',
  store
}

if (localStorageToken) {
  // load user from token, set to account store before rendering app
  AccountService.loadUserFromToken(localStorageToken)
    .then(r => r.data)
    .then((user) => {
      store.commit(`${STORE_KEY}/${SET_USER}`, user)
      new Vue(vueApp)
    })
    .catch((error) => {
      console.error(error)
      // clear local storage, push user to base route to log back in
      localStorage.removeItem('inspectiv')
      location.replace('/')
    })
} else {
  // normal render of app
  new Vue(vueApp)
}
