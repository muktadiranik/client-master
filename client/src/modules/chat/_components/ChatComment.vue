<template>
  <li>
    <div class="c-comment">
      <div class="c-comment__thumb-container">
        <div class="c-comment__thumb">
          <img :src="getAvatar" alt="Comment Thumb" />
        </div>
      </div>
      <div class="c-comment__body" @click="onCommentClick">
        <div class="c-comment__meta">
          <div class="">
            <span class="c-comment__name">{{ getMessageUsername }}</span>
            <span class="c-comment__timestamp">{{ message.date_created | localTime(now) }}</span>
          </div>
          <div class="dropdownContainer" v-click-outside="hideDropdown">
            <div class="c-comment__actions" data-title="Options" @click.stop="toggleDropdown" v-if="isOwner">
              <i class="far fa-ellipsis-h"></i>
            </div>
            <ul
              class="c-submenu c-submenu--right c-submenu--for-edit-comment c-submenu--top-right-arrow"
              v-show="optionsExpanded"
              v-dynamic-color
            >
              <!-- <li class="c-submenu__item" @click="editClick">
                <div class="c-submenu__text">Edit</div>
              </li> -->
              <li class="c-submenu__item" @click="deleteComment">
                <div class="c-submenu__text">Delete</div>
              </li>
            </ul>
          </div>
        </div>
        <div class="c-comment__text">
          <span v-html="message.content" v-show="!editing"></span>
          <div class="c-comment__edit" v-show="editing">
            <form class="c-form">
              <div class="c-edit-comment">
                <textarea
                  v-html="message.content"
                  class="o-textarea o-textarea--border c-edit-comment__textarea"
                  name="commentText"
                  :id="`commentText-${message.uuid}`"
                  v-model="editMessageForm.content"
                ></textarea>
              </div>
              <div class="u-mt-10">
                <div class="u-flex-buttons u-jc-sb">
                  <button
                    @click.prevent="discardEdit"
                    class="o-btn o-btn--sm o-btn--outline o-btn--outline-coolgrey o-btn--rounded-sm"
                  >
                    <span>Cancel</span>
                  </button>
                  <button @click.prevent="saveEdit" class="o-btn o-btn--sm o-btn--primary o-btn--rounded-sm">
                    <span>Submit</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </li>
</template>

<script>
import DateTimeFilters from '@/filters/date-time-filters'
import { AccountMixin } from '@/mixins/account'
import { ThreadsMixin } from '@/mixins/threads'
import he from 'he'

import { clickOutside } from '@/directives/click-outside'
import { dynamicColor } from '@/directives/dynamic-color'

export default {
  name: 'ChatComment',
  directives: {
    clickOutside,
    dynamicColor,
  },
  filters: DateTimeFilters,
  mixins: [AccountMixin, ThreadsMixin],
  props: {
    threadUuid: {
      type: String,
      required: true,
    },
    message: {
      type: Object,
      required: true,
      default: () => {},
    },
    lastComment: {
      type: Boolean,
      required: false,
      default: false,
    },
    now: {
      type: Date,
      required: true,
      default: false,
    },
  },
  data() {
    return {
      editing: false,
      optionsExpanded: false,
      editMessageForm: {
        content: '',
      },
      metaExpanded: false,
      timeStamp: '',
    }
  },
  computed: {
    isReply() {
      return this.profile.user_name === this.message.owner.username
    },
    commentMetaClass() {
      return this.metaExpanded ? 'expanded' : 'collapsed'
    },
    getAvatar() {
      return this.message.profile_picture || DEFAULT_USER_IMAGE
    },
    showUsername() {
      if (!this.message || !this.message.owner) {
        return false
      }
      return this.message.owner.username !== 'Inspectiv'
    },
    isOwner() {
      return this.profile && this.profile.user_name === this.message.owner.username
    },
    getMessageUsername() {
      if (!this.message || !this.message.owner) {
        return ''
      }

      const username = this.message.owner.username
      return username === 'Inspectiv' ? 'Inspectiv Bot' : username
    },
  },
  methods: {
    // editClick() {
    //   this.optionsExpanded = false
    //   this.editing = true
    // },
    onCommentClick() {
      this.metaExpanded = !this.metaExpanded
    },
    async saveEdit() {
      try {
        const content = this.editMessageForm.content
        const payload = {
          threadUuid: this.threadUuid,
          messageUuid: this.message.uuid,
          postData: { content },
        }

        const response = await this.actionEditMessage(payload)
        this.$emit('message-updated', response)
        this.editing = false
        this.$caAlert.create({ type: 'success', text: 'Message updated' })
      } catch (e) {
        this.$caAlert.create({
          type: 'error',
          text: 'Failed to update message',
        })
      }
    },
    discardEdit() {
      this.editMessageForm.content = this.message.content
      this.editing = false
    },
    async deleteComment() {
      try {
        const payload = {
          threadUuid: this.threadUuid,
          messageUuid: this.message.uuid,
        }

        const response = await this.actionDeleteMessage(payload)
        this.$emit('message-deleted', this.message.uuid)
        this.editing = false
        this.$caAlert.create({
          type: 'success',
          text: response.message,
        })
      } catch (e) {
        this.$caAlert.create({
          type: 'error',
          text: 'Failed to delete message',
        })
      }
    },
    toggleDropdown() {
      this.optionsExpanded = !this.optionsExpanded
    },
    hideDropdown() {
      this.optionsExpanded = false
    },
  },
  mounted() {
    this.editMessageForm = {
      content: he.decode(this.message.content),
    }
  },
}
</script>
