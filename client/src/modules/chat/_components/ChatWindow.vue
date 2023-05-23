<template>
  <div id="submissionComments">
    <transition name="solar">
      <div key="ca-solar" class="ca-solar thin" v-show="loadingComment" v-dynamic-color />
    </transition>
    <div class="u-mb-20 c-comments-empty" v-if="Object.keys(getMessages).length === 0">
      <i class="fas fa-comments"></i>
      <p>Be the first to comment</p>
    </div>
    <div class="c-comments-wrapper" v-if="Object.keys(getMessages).length > 0">
      <div class="c-comments-group" v-for="(k, v) in getMessages" :key="`comment-group-${v}`">
        <div class="c-comments-date">{{ v }}</div>
        <ul class="c-comments-list">
          <chat-comment
            v-for="(message, index) in thread.messages[v]"
            :key="`comment-${message.uuid}`"
            :id="`comment-${message.uuid}`"
            :thread-uuid="threadUuid"
            :message="message"
            :last-comment="index === thread.messages.length - 1"
            :now="now"
            @message-updated="onMessageUpdated"
            @message-deleted="onMessageDeleted"
          />
        </ul>
      </div>
      <div id="scroll-anchor"></div>
    </div>
    <footer class="c-create-comment-wrapper">
        <div class="c-create-comment">
          <textarea class="o-input c-create-comment__textarea" placeholder="Write a comment..." v-model="messageForm.content" />
          <button v-on:click="submitMessage" class="o-btn o-btn--primary o-btn--sm o-btn--rounded" :disabled="messageForm.content === ''">Send</button>
        </div>
    </footer>
  </div>
</template>

<script>
import ChatComment from '@/modules/chat/_components/ChatComment'
import { ThreadsMixin } from '@/mixins/threads'
import { autoSize } from '@/directives/text-area-autosize'
import { dynamicColor } from '@/directives/dynamic-color'

export default {
  name: 'ChatWindow',
  components: {
    ChatComment,
  },
  directives: { autoSize, dynamicColor },
  props: {
    threadUuid: {
      type: String,
      default: '',
      required: true,
    },
  },
  mixins: [ThreadsMixin],
  data() {
    return {
      loading: false,
      thread: {},
      markdownConfig: {
        toolbar: false,
        placeholder: 'Write a comment...',
        status: [],
      },
      messageForm: {
        content: '',
      },
      now: new Date(),
      loadingComment: false,
    }
  },
  methods: {
    async submitMessage() {
      if (!this.messageForm.content) {
        return
      }

      try {
        this.loading = true
        this.loadingComment = true
        const payload = {
          threadUuid: this.thread.uuid,
          postData: this.messageForm,
        }
        await this.actionCreateMessage(payload)
        this.messageForm.content = ''

        this.$nextTick(() => {
          this.loadThread()
        }, 300)
      } catch (e) {
      } finally {
        this.loadingComment = false
      }
    },
    onMessageUpdated(updatedMessage) {
      this.loadThread()
    },
    onMessageDeleted(deletedMessageUuid) {
      this.loadThread()
    },
    onMessageTextInput(val) {
      this.messageForm.content = val
    },
    scrollToNewestComment() {
      if (this.thread.messages.length === 0) {
        return
      }

      const options = {
        container: '.c-comments-wrapper',
        easing: 'ease-in',
        force: true,
        x: false,
        y: true,
      }

      this.$scrollTo('#scroll-anchor', 250, options)
    },
    loadThread() {
      this.actionLoadThread(this.threadUuid).then((response) => {
        this.thread = response

        this.$nextTick(() => {
          this.scrollToNewestComment()
        }, 500)

        setInterval(() => {
          this.now = new Date()
        }, 60000)
      })
    },
  },
  computed: {
    getMessages() {
      if (!this.thread || !this.thread.messages) {
        return []
      }

      if (!this.thread.messages || this.thread.messages.length === 0) {
        return []
      }

      const keys = Object.keys(this.thread.messages).sort((a, b) => {
        const dateA = new Date(a)
        const dateB = new Date(b)
        if (dateA < dateB) return -1
        if (dateA > dateB) return 1
        return 0
      })

      let messages = {}
      for (let k of keys) {
        messages[k] = this.thread.messages[k]
      }
      return messages
    },
  },
  mounted() {
    this.loadThread()
  },
  async destroyed() {
    await this.actionResetThreadStore()
  },
}
</script>
