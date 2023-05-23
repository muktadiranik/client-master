<template>
  <!-- ADDRESS TAB -->
  <section class="c-box u-width-50">
    <div class="c-box__header">
      <h6 class="c-box__header__text">Address</h6>
    </div>

    <div class="c-box__body l-stack l-stack--form l-stack--two-col">
      <!-- ADDRESS -->
      <div class="c-form__group">
        <label for="input-address" class="c-form__label c-form__label--small">Address</label>
        <input
          type="text"
          class="o-input"
          id="input-address"
          :value="form.address1"
          @input="onFieldChange('address1', $event.target.value)"
          placeholder="Enter your address"
        />
      </div>
      <!-- /.c-form__group -->

      <!-- APARTMENT, SUITE NUMBER -->
      <div class="c-form__group">
        <label for="input-apartment" class="c-form__label c-form__label--small">Apartment</label>
        <input
          type="text"
          class="o-input"
          id="input-apartment"
          :value="form.address2"
          @input="onFieldChange('address2', $event.target.value)"
          placeholder="Enter your apartment number"
        />
      </div>
      <!-- /.c-form__group -->

      <!-- CITY -->
      <div class="c-form__group">
        <label for="input-city" class="c-form__label c-form__label--small">City</label>

        <input
          type="text"
          class="o-input"
          id="input-city"
          :value="form.city"
          @input="onFieldChange('city', $event.target.value)"
          placeholder="Enter your city"
        />
      </div>
      <!-- /.c-form__group -->

      <!-- STATE/PROVINCE -->
      <div class="c-form__group">
        <label for="input-state" class="c-form__label c-form__label--small">State/Province</label>

        <input
          type="text"
          class="o-input"
          id="input-state"
          :value="form.state"
          @input="onFieldChange('state', $event.target.value)"
          placeholder="Enter your province"
        />
      </div>
      <!-- /.c-form__group -->

      <!-- COUNTRY -->
      <div class="c-form__group">
        <label for="input-country" class="c-form__label c-form__label--small">Country</label>

        <div class="c-dropdown c-dropdown--select" v-click-outside="hideDropdownMenu">
          <div
            class="c-dropdown__toggle o-btn o-btn--sm o-btn--rounded o-btn--select"
            tabindex="0"
            :class="[{ 'is-open': expanded }]"
            @click="toggleDropdownMenu"
          >
            <span>{{ form.country || 'Select your country' }}</span>
          </div>
          <ul class="c-dropdown__menu" :class="{ 'is-visible': expanded }">
            <li
              class="u-text-center l-flex u-jc-center"
              v-for="(country, index) in countries"
              :key="`country-${index}`"
              @click="selectCountry(country.name)"
            >
              {{ country.name }}
            </li>
          </ul>
        </div>
        <!-- <select
          name="country-select"
          class="c-form__select-dropdown o-input"
          @change="onFieldChange('country', $event.target.value)"
        >
          <option
            v-for="(option, index) in countries"
            :key="`option-${index}`"
            :value="option.code"
            :selected="form.country === option.code"
          >
            {{ option.name }}
          </option>
        </select> -->
      </div>
      <!-- /.c-form__group -->
      <!-- POSTAL CODE -->
      <div class="c-form__group">
        <label for="input-postal-code" class="c-form__label c-form__label--small">ZIP</label>
        <input
          type="text"
          class="o-input"
          id="input-postal-code"
          :value="form.zip_code"
          @input="onFieldChange('zip_code', $event.target.value)"
          placeholder="Enter your ZIP"
        />
      </div>
      <!-- /.c-form__group -->
    </div>
  </section>
</template>

<script>
import { clickOutside } from '@/directives/click-outside'
import { CommonMixin } from '@/mixins/common/'

export default {
  name: 'AddressTab',
  directives: {
    clickOutside,
  },
  mixins: [CommonMixin],
  props: {
    form: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  data() {
    return {
      expanded: false,
    }
  },
  computed: {
    countryModel: {
      get() {
        return this.form.country
      },
      set(val) {
        this.$emit('on-form-update', { field: 'country', value: val })
      },
    },
  },
  methods: {
    onFieldChange(field, value) {
      this.$emit('on-form-update', { field, value })
    },
    toggleDropdownMenu(event) {
      this.expanded = !this.expanded
    },
    hideDropdownMenu() {
      this.expanded = false
    },
    selectCountry(country) {
      this.onFieldChange('country', country)
      this.expanded = false
    },
  },
  async mounted() {
    try {
      this.$solar.show()
      await this.actionLoadCountries()
    } catch (e) {
    } finally {
      this.$solar.hide()
    }
  },
}
</script>
