<template>
  <div class="submission-content submission-activity">
    <div class="section-title">Activity</div>
    <div class="activity-timeline">
      <ul class="activity-list">
        <li class="activity-list__item" v-if="displayDefaultMessage">
          <div class="activity-list__item-content">
            <div class="activity-list__item-content-left">
              <div class="thumb">
                <img src="/static/images/logo-icon.png" />
              </div>
            </div>
            <div class="activity-list__item-content-right">
              <div class="activity-title">{{ 'Inspectiv' }}</div>
              <div class="time">{{ todaysDateFormatted }}</div>
              <div class="activity-desc">{{ 'This submission has not had any activity yet.' }}</div>
            </div>
          </div>
        </li>
        <ThreadMessage v-for="message in messages" :key="message.uuid" :message="message" />
        <li class="activity-list__item">
          <div class="activity-list__item-content">
            <div class="activity-list__item-content-left">
              <div class="thumb">
                <img :src="profile.profile_picture" class="portrait" />
              </div>
            </div>
            <div class="activity-list__item-content-right">
              <form class="form" v-on:submit.prevent>
                <input
                  class="form__control"
                  type="text"
                  name="chat-message"
                  id="chat-message"
                  v-model="messageForm.content"
                  v-on:keyup.enter="submitMessage()"
                  placeholder="Write a message..."
                />
              </form>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import threadsStore from '@/modules/threads/_store'

import { STORE_KEY as THREADS_STORE_KEY, REQUEST_THREAD, CREATE_MESSAGE } from '@/modules/threads/_store/types'

import { STORE_KEY as ACCOUNT_STORE_KEY, GET_PROFILE } from '@/stores/account/types'

export default {
  name: 'ThreadActivity',
  components: {
    ThreadMessage: () => import(/* webpackChunkName: "thread-message" */ '@/modules/threads/_components/ThreadMessage'),
  },
  props: {
    threadUuid: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      messages: [{}],
      messageForm: {
        content: '',
      },
      todaysDate: new Date(),
    }
  },
  computed: {
    ...mapGetters({
      profile: `${ACCOUNT_STORE_KEY}/${GET_PROFILE}`,
    }),
    displayDefaultMessage() {
      return this.messages.length === 0
    },
    todaysDateFormatted() {
      return this.todaysDate.toLocaleDateString('en-US')
    },
  },
  methods: {
    resetMessageForm() {
      this.messageForm = {
        content: '',
      }
    },
    async loadThread() {
      const payload = { threadUuid: this.threadUuid }
      await this.$store
        .dispatch(`${THREADS_STORE_KEY}/${REQUEST_THREAD}`, payload)
        .then(response => {
          this.messages = response.data.messages
        })
        .catch(() => {})
    },
    async submitMessage() {
      await this.$store
        .dispatch(`${THREADS_STORE_KEY}/${CREATE_MESSAGE}`, {
          threadUuid: this.threadUuid,
          messageForm: this.messageForm,
        })
        .then(response => {
          this.loadThread()
          this.resetMessageForm()
        })
        .catch(response => {
          this.loadThread()
          this.resetMessageForm()
        })
    },
  },
  created() {
    if (!(THREADS_STORE_KEY in this.$store._modules.root._children)) {
      this.$store.registerModule(THREADS_STORE_KEY, threadsStore)
    }

    this.loadThread()
  },
}
</script>
