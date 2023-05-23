<template>
  <ca-modal :visible="visible" class="c-modal">
    <template slot="modal-content">
      <ValidationObserver ref="observer" v-slot="{ invalid, handleSubmit, validate, valid }">
        <div class="c-modal__inner u-br-3">
          <div class="c-modal__header">
            <h6 class="o-h6 u-color-white u-font-16">Password Confirmation</h6>
            <button class="u-fs-20 u-cursor-pointer" @click="closeModal">
              <i class="fal fa-times"></i>
            </button>
          </div>
          <div class="c-modal__body">
            <p class="u-mb-20">Please provide your current password to save these changes to your profile.</p>
            <ValidationProvider name="Password" :rules="formValidationRules.password" v-slot="{ errors }">
              <div class="c-form__group">
                <label for="cpassword" class="c-form__label c-form__label--small">Current Password</label>
                <div class="c-input-icon c-input-icon--left">
                  <input
                    type="password"
                    class="o-input"
                    name="cpassword"
                    id="cpassword"
                    placeholder="Enter your password"
                    v-model="passwordModel"
                  />
                  <i class="fas fa-lock c-input-icon__element"></i>
                </div>
              </div>
              <c-form-errors :errors="errors" />
            </ValidationProvider>
          </div>
          <div class="c-modal__footer">
            <div class="u-d-f u-jc-fe">
              <button
                type="button"
                class="o-btn o-btn--primary o-btn--rounded-sm o-btn--sm"
                @click="submitForm(validate)"
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
import CFormErrors from '@/modules/core/_components/c-form/c-form-errors'

export default {
  name: 'AddressTab',
  components: {
    CaModal,
    CFormErrors,
  },
  props: {
    form: {
      type: Object,
      default: () => {},
      required: true,
    },
    visible: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  data() {
    return {
      formValidationRules: {
        password: { required: true },
      },
    }
  },
  computed: {
    passwordModel: {
      get() {
        return this.form.old_password
      },
      set(val) {
        this.$emit('on-form-update', { field: 'old_password', value: val })
      },
    },
  },
  methods: {
    closeModal() {
      this.$emit('on-close')
    },
    onFieldChange(field, value) {
      this.$emit('on-form-update', { field, value })
    },
    async submitForm(validate) {
      const valid = await validate()
      if (valid) {
        this.$emit('on-submit-form')
      }
    },
  },
}
</script>
