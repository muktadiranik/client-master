<template>
  <div class="c-submissions__featured">
    <h6 class="o-h6">Featured</h6>
    <div class="c-submissions__featured-slick">
      <VueSlickCarousel v-if="programs.length > 0" v-bind="slickSettings">
        <div class="c-program-card" v-for="(program, index) in programs" :key="`featured-submission-${index}`">
          <div class="c-program-card__header">
            <router-link :to="{ name: 'Program', params: { uuid: program.uuid } }" class="c-program-card__logo-box">
              <img :src="program.image || defaultProgramImage" :alt="program.title" class="c-program-card__logo-img" />
            </router-link>

            <div class="c-program-card__bookmark u-ml-10">
              <span><i :class="toggleFollowed(program.uuid) ? 'fas fa-bookmark' : 'far fa-bookmark'"></i></span>
            </div>
          </div>

          <div class="c-program-card__main">
            <router-link :to="{ name: 'Program', params: { uuid: program.uuid } }" class="c-program-card__title">
              {{ program.title }}
            </router-link>
            <div class="c-program-card__byline u-mt-10" v-if="program.company_name">by {{ program.company_name }}</div>
          </div>

          <div class="c-program-card__footer">
            <router-link :to="{ name: 'Program', params: { uuid: program.uuid } }" class="c-program-card__footer-link">
              <span>Show details</span>
              <i class="far fa-angle-right"></i>
            </router-link>
          </div>
        </div>
      </VueSlickCarousel>
    </div>
  </div>
</template>

<script>
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
export default {
  name: 'SubmissionsFeatured',
  components: { VueSlickCarousel },
  data() {
    return {
      isMobile: false,
      slickSettings: {
        arrows: false,
        dots: true,
        slidesToShow: 1,
        swipeToSlide: true,
        slidesToScroll: 3,
        variableWidth: true,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              rows: 1,
            },
          },
        ],
      },
      defaultProgramImage: DEFAULT_COMPANY_IMAGE,
    }
  },
  props: {
    programs: {
      type: Array,
      default: () => [],
      required: true,
    },
    followedPrograms: {
      type: Array,
      default: () => [],
      required: true,
    },
  },
  methods: {
    toggleFollowed(programUuid) {
      return this.followedProgramsUuid.includes(programUuid)
    },
  },
  computed: {
    followedProgramsUuid() {
      return this.followedPrograms.map(({ uuid }) => uuid)
    },
  },
}
</script>

<style lang="scss">
</style>
