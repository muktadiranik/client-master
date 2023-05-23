<template>
  <div class="c-datatable__pager">
    <ul class="c-datatable__pager-nav">
      <li>
        <a
          @click.stop="onPageChange(currentPage - 2)"
          class="c-datatable__pager-link"
          :class="{
            'c-datatable__pager-link--disabled': !doubleBackPaginationEnabled,
          }"
          :disabled="!doubleBackPaginationEnabled"
        >
          <i class="fal fa-angle-double-left"></i>
        </a>
      </li>
      <li>
        <a
          @click.stop="onPageChange(currentPage - 1)"
          class="c-datatable__pager-link"
          :class="{
            'c-datatable__pager-link--disabled': !backPaginationEnabled,
          }"
          :disabled="!backPaginationEnabled"
        >
          <i class="fal fa-angle-left"></i>
        </a>
      </li>
      <li v-for="(page, index) in pagination" :key="`pager-link-${index}`">
        <a
          @click.stop="onPageChange(page)"
          class="c-datatable__pager-link"
          :class="{
            'c-datatable__pager-link--active': currentPage === page,
          }"
          :disabled="currentPage === page"
          >{{ page }}</a
        >
      </li>
      <li>
        <a
          @click.stop="onPageChange(currentPage + 1)"
          class="c-datatable__pager-link c-datatable__pager-link--next"
          :class="{
            'c-datatable__pager-link--disabled': !forwardPaginationEnabled,
          }"
          :disabled="!forwardPaginationEnabled"
        >
          <i class="fal fa-angle-right"></i>
        </a>
      </li>
      <li>
        <a
          @click.stop="onPageChange(currentPage + 2)"
          class="c-datatable__pager-link c-datatable__pager-link--next"
          :class="{
            'c-datatable__pager-link--disabled': !doubleForwardPaginationEnabled,
          }"
          :disabled="!doubleForwardPaginationEnabled"
        >
          <i class="fal fa-angle-double-right"></i>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'CPagination',
  components: {},
  data() {
    return {}
  },
  props: {
    currentPage: {
      type: Number,
      default: 1,
      required: true,
    },
    pageCount: {
      type: Number,
      default: 1,
      required: true,
    },
  },
  computed: {
    backPaginationEnabled() {
      return this.currentPage > 1
    },
    doubleBackPaginationEnabled() {
      return this.currentPage > 2
    },
    forwardPaginationEnabled() {
      return this.pageCount >= this.currentPage + 1
    },
    doubleForwardPaginationEnabled() {
      return this.pageCount >= this.currentPage + 2
    },
    pagination() {
      let delta = 0
      if (this.pageCount <= 7) {
        delta = 7
      } else {
        delta = this.currentPage > 4 && this.currentPage < this.pageCount - 3 ? 2 : 4
      }

      const range = {
        start: Math.round(this.currentPage - delta / 2),
        end: Math.round(this.currentPage + delta / 2),
      }

      if (range.start - 1 === 1 || range.end + 1 === this.pageCount) {
        range.start += 1
        range.end += 1
      }

      let pages =
        this.currentPage > delta
          ? this.getRange(Math.min(range.start, this.pageCount - delta), Math.min(range.end, this.pageCount))
          : this.getRange(1, Math.min(this.pageCount, delta + 1))

      const withDots = (value, pair) => (pages.length + 1 !== this.pageCount ? pair : [value])

      if (pages[0] !== 1) {
        pages = withDots(1, [1, '...']).concat(pages)
      }

      if (pages[pages.length - 1] < this.pageCount) {
        pages = pages.concat(withDots(this.pageCount, ['...', this.pageCount]))
      }

      return pages
    },
  },
  methods: {
    getRange(start, end) {
      return Array(end - start + 1)
        .fill()
        .map((v, i) => i + start)
    },
    onPageChange(page) {
      if (!page || page === '...') {
        return
      }
      this.$emit('on-page-change', page)
    },
  },
}
</script>

<style></style>
