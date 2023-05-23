<template>
  <li>
    <div class="c-history__item">
      <div>
        <div class="c-history__thumb">
          <img :src="historyItem.changed_by.profile_picture || '/static/images/avatar-person.svg'" alt="User Thumb" />
        </div>
        <div class="c-history__info">
          <span class="c-history__user">{{ historyItem.changed_by.name }}</span>
          <div class="c-history__date">
            <span
              ><small>{{ displayTime }}</small></span
            >
          </div>
        </div>
      </div>
      <span class="c-history__text">
        <li v-for="(change, index) in displayChanges" :key="index">{{ change }}</li>
      </span>
    </div>
  </li>
</template>

<script>
export default {
  name: 'HistoryItem',
  components: {},
  props: {
    historyItem: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  computed: {
    displayTime() {
      let date = new Date(this.historyItem.date_changed)
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date
        .getMinutes()
        .toString()
        .padStart(2, '0')}`
    },
    displayChanges() {
      let changes = []
      if (this.historyItem.change.id) {
        changes.push(`Created`)
      } else {
        for (let key of Object.keys(this.historyItem.change)) {
          let fieldFormatted = ''
          let returnStr = ''
          fieldFormatted =
            key === 'vulnerability_types' ? 'Vulnerability' : `${key.charAt(0).toUpperCase() + key.slice(1)}`
          if (this.historyItem.prev[key]) {
            returnStr += `changed from ${this.historyItem.prev[key]} to ${this.historyItem.change[key]}`
          } else {
            returnStr += `changed to ${this.historyItem.change[key]}`
          }
          changes.push(`${fieldFormatted} ${returnStr}`)
        }
      }
      return changes
    },
  },
}
</script>
