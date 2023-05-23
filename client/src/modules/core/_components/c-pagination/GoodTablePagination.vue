<template>
  <div class="c-datatable__pager">
    <ul class="c-datatable__pager-nav">
      <li>
        <a
          @click.stop="previous()"
          class="c-datatable__pager-link"
          :class="{
            'c-datatable__pager-link--disabled': !backPaginationEnabled,
          }"
          :disabled="!backPaginationEnabled"
        >
          <i class="fal fa-angle-left"></i>
        </a>
      </li>
      <li v-for="(page, index) in pages" :key="`pager-link-${index}`">
        <a
          @click.stop="setPage(page)"
          class="c-datatable__pager-link"
          :class="{
            'c-datatable__pager-link--active': current === page,
          }"
          :disabled="current === page"
          >{{ page }}</a
        >
      </li>
      <li>
        <a
          @click.stop="next()"
          class="c-datatable__pager-link c-datatable__pager-link--next"
          :class="{
            'c-datatable__pager-link--disabled': !forwardPaginationEnabled,
          }"
          :disabled="!forwardPaginationEnabled"
        >
          <i class="fal fa-angle-right"></i>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'GoodTablePagination',
  components: {},
  data() {
    return {
      current: 1,
    }
  },
  props: {
    total: {
      type: Number,
      default: 1,
      required: true,
    },
    perPage: {
      type: Number,
      default: 10,
      required: false,
    },
    pageChanged: { type: Function },
    perPageChanged: { type: Function },
  },
  computed: {
    backPaginationEnabled() {
      return this.current > 1
    },
    doubleBackPaginationEnabled() {
      return this.current > 2
    },
    forwardPaginationEnabled() {
      return this.pageCount >= this.current + 1
    },
    doubleForwardPaginationEnabled() {
      return this.pageCount >= this.current + 2
    },
    pages() {
      if (this.total > this.perPage) {
        return Math.ceil(this.total / this.perPage)
      } else {
        this.setPage(1)
        return 1
      }
    },
  },
  methods: {
    setPage(page) {
      this.current = page
      this.pageChanged({ currentPage: this.current })
    },
    previous() {
      if (this.current > 1) this.setPage(this.current - 1)
    },
    next() {
      if (this.current < this.pages) this.setPage(this.current + 1)
    },
    setPerPage(perPage) {
      this.perPage = perPage
      this.perPageChanged({ currentPerPage: this.perPage })
    },
  },
  mounted(){
    this.perPageChanged({ currentPerPage: this.perPage })
  }
}
</script>

<style></style>
