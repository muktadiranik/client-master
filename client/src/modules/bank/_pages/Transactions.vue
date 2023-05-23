<template>
  <main class="c-site-main">
    <div class="u-pt-20 u-pb-20">
      <div class="l-wrap">
        <router-view key="transactions-router"></router-view>
      </div>
      <!-- /.l-wrap -->
    </div>
  </main>
</template>

<script>
import { AccountMixin } from '@/mixins/account'
import { BreadcrumbsMixin } from '@/mixins/breadcrumbs'

export default {
  name: 'Transactions',
  mixins: [AccountMixin, BreadcrumbsMixin],
  data() {
    return {}
  },
  methods: {},
  computed: {},
  async mounted() {
    this.actionSetBreadcrumbs({
      parent: {
        route: this.$router.resolve({ name: 'Transactions' }).route,
        title: 'Bank',
      },
      child: {
        title: 'Transactions',
      },
    })
  },
}
</script>
