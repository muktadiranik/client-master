<template>
  <ca-modal :visible="visible" class="c-modal">
    <template slot="modal-content">
      <ValidationObserver ref="observer" v-slot="{ invalid, handleSubmit, validate, valid }">
        <div class="c-modal__inner u-br-3">
          <div class="c-modal__header">
            <h6 class="o-h6 u-color-white u-font-16">Address Confirmation</h6>
            <button class="u-fs-20 u-cursor-pointer" @click="closeModal">
              <i class="fal fa-times"></i>
            </button>
          </div>
          <div class="c-modal__body">
            <p>Please confirm or update your address.</p>

            <div class="c-box__body l-stack">
              <!-- ADDRESS -->
              <div class="c-form__group">
                <label for="input-address" class="c-form__label c-form__label--small">Address</label>
                <div class="c-input-icon c-input-icon--left">
                  <input
                    type="text"
                    class="o-input"
                    :value="form.address1"
                    @input="onFieldChange('address1', $event.target.value)"
                    placeholder="Enter your permanent address"
                  />
                  <i class="fas fa-address-card c-input-icon__element"></i>
                </div>
              </div>
              <!-- /.c-form__group -->

              <!-- APARTMENT, SUITE NUMBER -->
              <div class="c-form__group">
                <label for="input-apartment" class="c-form__label c-form__label--small">Apartment, suite, etc</label>
                <div class="c-input-icon c-input-icon--left">
                  <input
                    type="text"
                    class="o-input"
                    :value="form.address2"
                    @input="onFieldChange('address2', $event.target.value)"
                    placeholder="Enter your apartment, suite number"
                  />
                  <i class="fas fa-building c-input-icon__element"></i>
                </div>
              </div>
              <!-- /.c-form__group -->

              <div class="l-stack l-stack--form l-stack--horizontal">
                <!-- CITY -->
                <div class="c-form__group">
                  <label for="input-city" class="c-form__label c-form__label--small">City</label>
                  <div class="c-input-icon c-input-icon--left">
                    <input
                      type="text"
                      class="o-input"
                      :value="form.city"
                      @input="onFieldChange('city', $event.target.value)"
                      placeholder="Enter your city name"
                    />
                    <i class="fas fa-car-building c-input-icon__element"></i>
                  </div>
                </div>
                <!-- /.c-form__group -->

                <!-- STATE/PROVINCE -->
                <div class="c-form__group">
                  <label for="input-state" class="c-form__label c-form__label--small">State/Province</label>
                  <div class="c-input-icon c-input-icon--left">
                    <input
                      type="text"
                      class="o-input"
                      :value="form.state"
                      @input="onFieldChange('state', $event.target.value)"
                      placeholder="Enter your state name"
                    />

                    <i class="fas fa-car-building c-input-icon__element"></i>
                  </div>
                </div>
                <!-- /.c-form__group -->
              </div>

              <div class="l-stack l-stack--form l-stack--horizontal">
                <!-- COUNTRY -->
                <div class="c-form__group">
                  <label for="input-country" class="c-form__label c-form__label--small">Country</label>
                  <div class="c-input-icon c-input-icon--left">
                    <select
                      name="country-select"
                      class="c-form__select-dropdown o-input"
                      @change="onFieldChange('country', $event.target.value)"
                    >
                      <option
                        v-for="(option, index) in countries"
                        :key="`option-${index}`"
                        :value="option.code"
                        :selected="form.country === option.code"
                        >{{ option.name }}</option
                      >
                    </select>
                    <i class="fas fa-car-building c-input-icon__element"></i>
                  </div>
                </div>
                <!-- /.c-form__group -->

                <!-- POSTAL CODE -->
                <div class="c-form__group">
                  <label for="input-postal-code" class="c-form__label c-form__label--small">ZIP/Postal Code</label>
                  <div class="c-input-icon c-input-icon--left">
                    <input
                      type="text"
                      class="o-input"
                      :value="form.zip_code"
                      @input="onFieldChange('zip_code', $event.target.value)"
                      placeholder="Enter your postal code"
                    />
                    <i class="fas fa-envelope-open-text c-input-icon__element"></i>
                  </div>
                </div>
              </div>
              <!-- /.c-form__group -->
            </div>
          </div>
          <div v-if="submitting" class="u-mb-20">
            <Spinner size="medium" />
          </div>
          <div class="c-modal__footer">
            <div class="u-d-f u-jc-fe">
              <button
                type="button"
                class="o-btn o-btn--primary o-btn--rounded-sm o-btn--sm"
                @click="$emit('on-confirm-info-form')"
                :disabled="!valid"
              >
                Confirm and Save
              </button>
            </div>
          </div>
        </div>
      </ValidationObserver>
    </template>
  </ca-modal>
</template>

<script>
import CaModal from '@/modules/core/_components/ca-modal/CaModal'
import { CommonMixin } from '@/mixins/common/'
import Spinner from 'vue-simple-spinner'

export default {
  name: 'InformationConfirmationModal',
  mixins: [CommonMixin],
  components: {
    CaModal,
    Spinner,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true,
    },
    form: {
      type: Object,
      required: true,
    },
    submitting: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    closeModal() {
      this.$emit('on-close')
    },
    onFieldChange(field, value) {
      this.$emit('on-form-update', { field, value })
    },
  },
}
</script>
