<template>
  <main class="c-site-main">
    <section class="section-researcher-dashboard-stats" v-if="false">
      <div class="l-wrap">
        <div class="content">
          <div class="researcher-stat researcher-badge">
            <div class="heading">Badges</div>
            <div class="score">18</div>
            <div class="heading">Earned</div>
          </div>
          <div class="researcher-profile" v-if="dashboardDetails">
            <div class="researcher-portrait"></div>
            <div class="researcher-name" v-if="dashboardDetails">Welcome {{ dashboardDetails.user_name }}</div>
          </div>
          <div class="researcher-stat researcher-level">
            <div class="heading">Level</div>
            <div class="score">34</div>
            <div class="paragraph">850/1000 <br />Before next level</div>
          </div>
        </div>
      </div>
    </section>

    <section class="section-researcher-dashboard-recent-updates" v-if="false">
      <div class="l-wrap">
        <ul class="list">
          <CaNewsFeedPost
            :title="'Welcome to Inspectiv'"
            :sub-title="''"
            :created="'1 hour ago'"
            :image-url="'/static/images/logo-icon.png'"
            :image-title="'Inspectiv Logo Icon'"
          >
            <p>
              <strong>Welcome to Inspectiv. Check back soon for more information.</strong>
            </p>
          </CaNewsFeedPost>

          <CaNewsFeedPost
            v-if="false"
            :title="'Inspectiv'"
            :sub-title="'updated their program'"
            :created="'1 hour ago'"
            :tag="'Transfer BT-1598-H320'"
            :image-url="DEFAULT_COMPANY_IMAGE"
            :image-title="'Inspectiv Logo Icon'"
          >
            <p>Bounties for level 2 bugs have increased to $1500 during the month of July. <br />Happy Hunting!</p>
          </CaNewsFeedPost>

          <CaNewsFeedPost
            v-if="false"
            :title="'Inspectiv'"
            :sub-title="'updated their program'"
            :created="'1 hour ago'"
            :tag="'Transfer BT-1598-H320'"
            :image-url="DEFAULT_COMPANY_IMAGE"
            :image-title="'Inspectiv Logo Icon'"
          >
            <p>Bounties for level 2 bugs have increased to $1500 during the month of July. <br />Happy Hunting!</p>
          </CaNewsFeedPost>

          <CaNewsFeedPost
            v-if="false"
            :title="'Inspectiv'"
            :sub-title="'Program Updates'"
            :created="'1 hour ago'"
            :image-url="'/static/images/logo-icon.png'"
            :image-title="'Inspectiv Logo Icon'"
          >
            <p><strong>33 new programs</strong> have been added this month!</p>
            <p><a href="#" class="button button--inline">Click here</a> to check them out</p>
          </CaNewsFeedPost>

          <CaNewsFeedPost
            v-if="false"
            :title="'Inspectiv'"
            :sub-title="'Submission update'"
            :created="'1 hour ago'"
            :tag="'Submission AXR-1598-32'"
            :image-url="DEFAULT_COMPANY_IMAGE"
            :image-title="'Inspectiv'"
          >
            <p>Congratulations, your submission has been accepted.</p>
            <p>
              <a href="#">Click here for more details.</a>
            </p>
          </CaNewsFeedPost>

          <CaNewsFeedPost
            v-if="false"
            :title="'Bank'"
            :sub-title="'Transfer Complete'"
            :created="'1 hour ago'"
            :tag="'Transfer BT-1598-H320'"
            :image-url="'/static/images/bank.png'"
            :image-title="'Bank'"
          >
            <p>Your transfer initiated June 31st has completed successfully.</p>
            <p>
              <a href="#">Click here for more details.</a>
            </p>
          </CaNewsFeedPost>
        </ul>
      </div>
    </section>
  </main>
</template>

<script>
import CaNewsFeedPost from '@/modules/core/_components/ca-news-feed-post/CaNewsFeedPost'
import { AccountMixin } from '@/mixins/account'
export default {
  name: 'CompanyDashboard',
  components: {
    CaNewsFeedPost,
  },
  mixins: [AccountMixin],
  data() {
    return {}
  },
  created() {
    this.$router.push({ name: 'Programs' })
  },
}
</script>
