<template>
  <div>
    <CaNavbar />
    <main class="c-site-main u-bgc-secondary">
      <div class="l-wrap">
        <div class="c-notfound">
          <h1>404</h1>
          <h3>Oops!</h3>
          <p>Looks like something went wrong and the page you’re looking for can’t be not found</p>
          <button @click="$router.back()" class="o-btn o-btn--sm o-btn--primary o-btn--rounded">Go Back</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import CaNavbar from '@/modules/core/_components/ca-navbar/CaNavbar'

export default {
  name: 'NotFound',
  components: {
    CaNavbar,
  },
}
</script>

<style></style>
