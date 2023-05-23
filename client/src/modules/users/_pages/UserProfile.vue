<template>
  <main class="c-site-main">
    <section class="section-padding section-user-profile">
      <div class="l-wrap">
        <form class="form">
          <div class="flex-row">
            <div class="flex-col flex-col--sm-4 flex-col--lg-3">
              <ul ref="formNavContainer" class="form-nav">
                <li class="active">
                  <a class="menu-item-link">Profile</a>
                </li>
              </ul>
            </div>
            <div id="form-section-container" class="flex-col flex-col--sm-8 flex-col--lg-9">
              <div class="box u-p-0 user-profile-container">
                <div class="user-profile-details" v-if="userProfile">
                  <h4>{{ userProfile.username }}</h4>
                  <dl>
                    <dt>Paypal Email</dt>
                    <dd>{{ userProfile.paypal_email }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  </main>
</template>

<script>
import { UserMixin } from '@/mixins/users'

export default {
  name: 'UserProfile',
  mixins: [UserMixin],
  data() {
    return {
      userProfile: {},
    }
  },
  async mounted() {
    try {
      this.$solar.show()
      const payload = { profileUuid: this.$route.params.uuid }
      const response = await this.getUserProfile(payload)
      this.userProfile = response.data
      this.$solar.hide()
    } catch (e) {
      const error = e && e.data && e.data.error ? e.data.error : 'Failed to load user profile.'
      this.$caAlert.error(error)
    }
  },
}
</script>

<style lang="scss">
h4 {
  margin-bottom: 20px;
}

dl {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}
dt {
  width: 33%;
}
dd {
  width: 66%;
}
</style>
