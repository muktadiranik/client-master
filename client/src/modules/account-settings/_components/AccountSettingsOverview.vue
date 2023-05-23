<template>
  <div>
    <div class="l-account-settings">
      <router-link :to="{ name: 'Findings' }">
        <button class="u-ml--16 u-mb-20 o-btn o-btn--primary-light o-btn--rounded o-btn--sm u-d-if u-ai-center">
          <i class="fal fa-arrow-left o-btn--icon-sm"></i>
          Back
        </button>
      </router-link>
      <h6 class="o-h6 u-mb-20">My Profile</h6>
      <div class="l-flex u-ai-center  u-jc-sb u-mb-30">
        <div class="l-flex u-ai-end">
          <div class="c-media c-media--md">
            <div class="o-upload-photo">
              <input
                type="file"
                class="o-upload-photo__input u-hide-input"
                id="upload-photo"
                accept="image/*"
                ref="attachment"
                @change="handlePhotoChange($event)"
              />
              <label for="upload-photo" class="o-upload-photo__label">
                <img :src="attachment || currentProfile.profile_picture || defaultUserAvatar" />
              </label>
            </div>
            <div class="c-media__body u-overflow-hidden">
              <h6 class="u-fs-16 u-single-line u-mb-8">{{ fullName }}</h6>
              <div class="o-text u-fs-14 u-mb-8">
                {{ profile.email }}
              </div>
              <div class="o-text--500 o-text--dark u-fs-12" v-if="userIsResearcher()">Researcher</div>
            </div>
          </div>
          <PaymentMethodCard v-if="userIsResearcher()" :profile="profile" :selectedPayment="selectedPayment" />
        </div>
        <div v-if="userIsResearcher()">
          <div>
            <button
              @click.prevent="deleteUserModal = true"
              class="o-btn o-btn--sm o-btn--outline-primary o-btn--rounded"
            >
              Delete Account
            </button>
            <DeleteUserModal
              :form="passwordForm"
              :visible="deleteUserModal"
              @on-close="onPasswordModalClose"
              @on-form-update="onPasswordFormUpdate"
              @on-submit-form="deleteUser"
            />
          </div>
        </div>
      </div>

      <!-- RESEARCHER TAB NAVIGATION -->
      <nav class="c-tab-nav u-mb-20" v-if="userIsResearcher()">
        <ul class="c-tab-nav__list">
          <li @click="currentTab = 'profile'" :class="{ 'is-active': currentTab === 'profile' }">
            <span>General Information</span>
          </li>
          <li @click="currentTab = 'security'" :class="{ 'is-active': currentTab === 'security' }">
            <span>Security</span>
          </li>
          <li @click="currentTab = 'payment-methods'" :class="{ 'is-active': currentTab === 'payment-methods' }">
            <span>Payment Methods</span>
          </li>
          <li @click="currentTab = 'address'" :class="{ 'is-active': currentTab === 'address' }">
            <span>Address</span>
          </li>
        </ul>
      </nav>

      <!-- APP OWNER TAB NAVIGATION -->
      <nav class="c-tab-nav l-flex u-jc-sb u-ai-center u-mb-20" v-if="userIsAppOwner() || userIsProgramManager()">
        <ul class="c-tab-nav__list">
          <li @click="currentTab = 'profile'" :class="{ 'is-active': currentTab === 'profile' }">
            <span>General Information</span>
          </li>
          <li @click="currentTab = 'security'" :class="{ 'is-active': currentTab === 'security' }">
            <span>Security</span>
          </li>
        </ul>
      </nav>

      <div class="c-form__content">
        <ValidationObserver ref="observer" v-slot="{ validate }">
          <!-- PROFILE TAB -->
          <div v-if="currentTab === 'profile'">
            <!-- BASICS -->
            <section class="c-box u-width-50" id="basics">
              <header class="c-box__header">
                <h6 class="c-box__header__text">Personal Details</h6>
              </header>
              <div class="c-box__body l-stack">
                <div class="l-stack l-stack--form l-stack--two-col">
                  <!-- FIRST NAME -->
                  <ValidationProvider name="First Name" :rules="formValidationRules.firstName" v-slot="{ errors }">
                    <div class="c-form__group">
                      <label for="fname" class="c-form__label c-form__label--small">First Name</label>
                      <div class="c-form__input-field">
                        <input
                          type="text"
                          class="o-input"
                          id="fname"
                          name="fname"
                          placeholder="Enter your first name"
                          v-model="form.first_name"
                        />
                      </div>
                      <c-form-errors :errors="errors" />
                    </div>
                  </ValidationProvider>

                  <!-- LAST NAME -->
                  <ValidationProvider name="Last Name" :rules="formValidationRules.lastName" v-slot="{ errors }">
                    <div class="c-form__group">
                      <label for="lname" class="c-form__label c-form__label--small">Last Name</label>
                      <div class="c-form__input-field">
                        <input
                          type="text"
                          class="o-input"
                          name="lname"
                          id="lname"
                          placeholder="Enter your last name"
                          v-model="form.last_name"
                        />
                      </div>
                      <c-form-errors :errors="errors" />
                    </div>
                  </ValidationProvider>
                </div>

                <div class="l-stack l-stack--form l-stack--horizontal">
                  <!-- EMAIL ADDRESS -->
                  <ValidationProvider name="Email Address" :rules="formValidationRules.email" v-slot="{ errors }">
                    <div class="c-form__group">
                      <label for="email" class="c-form__label c-form__label--small">Email Address</label>
                      <input
                        type="text"
                        class="o-input"
                        name="email"
                        id="email"
                        placeholder="Enter your email address"
                        v-model="form.email"
                      />
                      <c-form-errors :errors="errors" />
                    </div>
                  </ValidationProvider>
                </div>
              </div>
            </section>
            <!-- /.c-box -->

            <!-- SOCIAL PROFILES -->
            <section class="c-box u-mt-20 u-width-50" id="social-profiles" v-if="!userIsAppOwner()">
              <header class="c-box__header">
                <h6 class="c-box__header__text">Social Media</h6>
              </header>
              <div class="c-box__body l-stack l-stack--form l-stack--two-col">
                <!-- TWITTER -->
                <ValidationProvider name="Twitter" :rules="validateTwitter" v-slot="{ errors }">
                  <div class="c-form__group">
                    <label for="twitter" class="c-form__label c-form__label--small">Twitter</label>

                    <input
                      type="text"
                      class="o-input"
                      name="twitter"
                      id="twitter"
                      placeholder="Enter your Twitter handle"
                      v-model="form.twitter"
                    />
                  </div>
                  <c-form-errors :errors="errors" />
                </ValidationProvider>

                <!-- LINKEDIN -->
                <ValidationProvider name="LinkedIn" :rules="validateLinkedIn" v-slot="{ errors }">
                  <div class="c-form__group">
                    <label for="linkedin" class="c-form__label c-form__label--small">Linkedin</label>
                    <input
                      type="text"
                      class="o-input"
                      name="linkedin"
                      id="linkedin"
                      placeholder="Enter your LinkedIn handle"
                      v-model="form.linked_in"
                    />
                  </div>
                  <c-form-errors :errors="errors" />
                </ValidationProvider>
              </div>
            </section>
            <!-- /.c-box -->
          </div>
          <!-- END OF PROFILE TAB -->

          <!-- PASSWORD TAB -->
          <div v-if="currentTab === 'security'">
            <section class="c-box u-mt-20 u-width-25" id="password">
              <header class="c-box__header">
                <h6 class="c-box__header__text">Password</h6>
              </header>
              <div class="c-box__body l-stack">
                <div class="l-stack l-stack--form">
                  <!-- OLD PASSWORD -->
                  <div class="c-form__group">
                    <label for="oldpassword" class="c-form__label c-form__label--small">Old Password</label>
                    <input
                      type="password"
                      class="o-input"
                      name="oldpassword"
                      id="oldpassword"
                      placeholder="Enter old password"
                    />
                  </div>
                  <!-- NEW PASSWORD -->
                  <ValidationProvider
                    vid="newpassword"
                    name="New Password"
                    :rules="formValidationRules.newPassword"
                    v-slot="{ errors }"
                  >
                    <div class="c-form__group">
                      <label for="npassword" class="c-form__label c-form__label--small">New Password</label>
                      <input
                        type="password"
                        class="o-input"
                        name="npassword"
                        id="npassword"
                        placeholder="Create new password"
                        v-model="passwordForm.password_1"
                      />
                    </div>
                    <c-form-errors :errors="errors" />
                  </ValidationProvider>

                  <!-- CONFIRM NEW PASSWORD -->
                  <ValidationProvider
                    vid="newpasswordrepeat"
                    name="Confirm Password"
                    :rules="formValidationRules.newPasswordRepeat"
                    v-slot="{ errors }"
                  >
                    <div class="c-form__group">
                      <label for="cnpassword" class="c-form__label c-form__label--small">Confirm New Password</label>
                      <input
                        type="password"
                        class="o-input"
                        name="cnpassword"
                        id="cnpassword"
                        placeholder="Enter new password"
                        v-model="passwordForm.password_2"
                      />
                    </div>
                    <c-form-errors :errors="errors" />
                  </ValidationProvider>
                </div>
              </div>
            </section>
            <!-- /.c-box -->
          </div>
          <!-- END OF PASSWORD TAB -->

          <!-- COMPANY TAB -->
          <div v-if="currentTab === 'company'">
            <!-- BASICS -->
            <section class="c-box u-width-50" id="basics">
              <header class="c-box__header">
                <h6 class="c-box__header__text">Company</h6>
              </header>
              <div class="c-box__body l-stack">
                <div class="l-stack l-stack--form l-stack--two-col">
                  <!-- COMPANY NAME -->
                  <div class="c-form__group">
                    <label for="company" class="c-form__label c-form__label--small">Name</label>
                    <div class="c-form__input-field">
                      <input type="text" class="o-input" id="company" name="company" placeholder="Enter company name" />
                    </div>
                    <c-form-errors :errors="errors" />
                  </div>

                  <!-- STATE -->
                  <div class="c-form__group">
                    <label for="state" class="c-form__label c-form__label--small">State</label>
                    <div class="c-form__input-field">
                      <input type="text" class="o-input" name="state" id="state" placeholder="Enter state" />
                    </div>
                    <c-form-errors :errors="errors" />
                  </div>
                </div>

                <div class="l-stack l-stack--form l-stack--two-col">
                  <!-- STREET ADDRESS -->
                  <div class="c-form__group">
                    <label for="address" class="c-form__label c-form__label--small">Street Address</label>
                    <input type="text" class="o-input" name="address" id="address" placeholder="Enter street address" />
                    <c-form-errors :errors="errors" />
                  </div>
                  <!-- ZIP -->
                  <div class="c-form__group">
                    <label for="zip" class="c-form__label c-form__label--small">ZIP</label>
                    <input type="text" class="o-input" name="zip" id="zip" placeholder="Enter zip code" />
                    <c-form-errors :errors="errors" />
                  </div>
                </div>
                <div class="l-stack l-stack--form l-stack--two-col">
                  <!-- SUITE -->
                  <div class="c-form__group">
                    <label for="suite" class="c-form__label c-form__label--small">Suite</label>
                    <input type="text" class="o-input" name="Suite" id="Suite" placeholder="Enter suite" />
                    <c-form-errors :errors="errors" />
                  </div>
                  <!-- ZIP -->
                  <div class="c-form__group">
                    <label for="country" class="c-form__label c-form__label--small">Country</label>
                    <input type="text" class="o-input" name="country" id="country" placeholder="Enter country" />
                    <c-form-errors :errors="errors" />
                  </div>
                </div>
              </div>
            </section>
            <!-- /.c-box -->
          </div>
          <!-- END OF COMPANY TAB -->

          <!-- PAYMENT METHODS TAB -->
          <section id="payment-methods" v-if="!userIsAppOwner()" v-show="currentTab === 'payment-methods'">
            <div class="c-box u-width-25">
              <header class="c-box__header">
                <h6 class="c-box__header__text">Payment Methods</h6>
              </header>
              <div class="payment-details l-flex u-ai-end u-jc-between">
                <div class="c-box__body l-stack l-stack--gap-20 u-width-full">
                  <p v-if="[3,4,5].includes(selectedPayment)" class="u-fs-10 o-text o-text--sm u-mt-5">
                    Moving forward we will no longer offer support for payment types other than PayPal and Payoneer. You may keep
                    your existing payment type, however, you will not be able to make any changes other than selecting
                    PayPal or Payoneer as your payment type.
                  </p>

                  <!-- PAYPAL -->
                  <div>
                    <div class="c-form__group u-mb-10">
                      <div class="c-custom-control c-custom-control--radio">
                        <input
                          type="radio"
                          name="paymentMethodPaypal"
                          id="paymentMethodPaypal"
                          value="2"
                          v-model="form.default_payment_method"
                        />
                        <label class="u-color-black u-fs-13" for="paymentMethodPaypal">PayPal</label>
                      </div>
                    </div>
                    <ValidationProvider
                      name="PayPal Email Address"
                      :rules="validatePaypalEmailAddress"
                      v-slot="{ errors }"
                    >
                      <div class="c-form__group">
                        <div>
                          <input
                            type="email"
                            class="o-input"
                            name="peaddress"
                            id="peaddress"
                            placeholder="Enter PayPal email address"
                            v-model="form.paypal_email"
                          />
                        </div>
                      </div>
                      <c-form-errors :errors="errors" />
                    </ValidationProvider>
                  </div>

                  <!-- PAYONEER -->
                  <div>
                    <div class="c-form__group u-mb-10">
                      <div class="c-custom-control c-custom-control--radio">
                        <input
                          type="radio"
                          name="paymentMethodPayoneer"
                          id="paymentMethodPayoneer"
                          value="6"
                          v-model="form.default_payment_method"
                        />
                        <label class="u-color-black u-fs-13" for="paymentMethodPayoneer">Payoneer</label>
                      </div>
                    </div>
                    <ValidationProvider
                      name="Payoneer Email Address"
                      :rules="validatePayoneerEmailAddress"
                      v-slot="{ errors }"
                    >
                      <div class="c-form__group">
                        <div>
                          <input
                            type="email"
                            class="o-input"
                            name="payoneer-email"
                            id="payoneer-email"
                            placeholder="Enter Payoneer email address"
                            v-model="form.payoneer_email"
                          />
                        </div>
                      </div>
                      <c-form-errors :errors="errors" />
                    </ValidationProvider>
                  </div>

                  <!-- BTC -->
                  <div v-if="selectedPayment === 3">
                    <div class="c-form__group u-mb-10">
                      <div class="c-custom-control c-custom-control--radio">
                        <input
                          class="o-input"
                          type="radio"
                          name="paymentMethodBtc"
                          id="paymentMethodBtc"
                          value="3"
                          v-model="form.default_payment_method"
                        />
                        <label class="u-color-black u-fs-13" for="paymentMethodBtc">BTC</label>
                      </div>
                    </div>
                    <ValidationProvider name="BTC Wallet Address" :rules="validateBtcWalletAddress" v-slot="{ errors }">
                      <div class="c-form__group">
                        <div>
                          <input
                            type="text"
                            class="o-input"
                            name="btcwalletaddress"
                            id="btcwalletaddress"
                            placeholder="Enter BTC wallet address"
                            v-model="form.btc_wallet_address"
                          />
                        </div>
                      </div>
                      <c-form-errors :errors="errors" />
                    </ValidationProvider>
                  </div>

                  <!-- ETH -->
                  <div v-if="selectedPayment === 4">
                    <div class="c-form__group u-mb-10">
                      <div class="c-custom-control c-custom-control--radio">
                        <input
                          class="o-input"
                          type="radio"
                          name="paymentMethodEth"
                          id="paymentMethodEth"
                          value="4"
                          v-model="form.default_payment_method"
                        />
                        <label class="u-color-black u-fs-13" for="paymentMethodEth">ETH</label>
                      </div>
                    </div>
                    <ValidationProvider name="ETH Wallet Address" :rules="validateEthWalletAddress" v-slot="{ errors }">
                      <div class="c-form__group">
                        <div>
                          <input
                            type="text"
                            class="o-input"
                            name="ethwalletaddress"
                            id="ethwalletaddress"
                            placeholder="Enter ETH wallet address"
                            v-model="form.eth_wallet_address"
                          />
                        </div>
                      </div>
                      <c-form-errors :errors="errors" />
                    </ValidationProvider>
                  </div>

                  <!-- Bank -->
                  <div v-if="selectedPayment === 5">
                    <div class="c-form__group u-mb-10">
                      <div class="c-custom-control c-custom-control--radio">
                        <input
                          class="o-input"
                          type="radio"
                          name="paymentMethodUsdBank"
                          id="paymentMethodUsdBank"
                          value="5"
                          v-model="form.default_payment_method"
                        />
                        <label class="u-color-black u-fs-13" for="paymentMethodUsdBank">USD Bank</label>
                      </div>
                    </div>
                    <ValidationProvider
                      name="Bank Account Number"
                      :rules="validateBankAccountNumber"
                      v-slot="{ errors }"
                    >
                      <div class="c-form__group">
                        <div>
                          <input
                            type="text"
                            class="o-input u-mb-15"
                            name="usdbankaccountnumber"
                            id="usdbankaccountnumber"
                            placeholder="Enter bank account number"
                            v-model="form.usd_bank_account_number"
                          />
                          <input
                            type="text"
                            class="o-input"
                            name="usdbankroutingnumber"
                            id="usdbankroutingnumber"
                            placeholder="Enter bank routing number"
                            v-model="form.usd_bank_routing_number"
                          />
                        </div>
                      </div>
                      <c-form-errors :errors="errors" />
                    </ValidationProvider>
                  </div>
                </div>
              </div>
            </div>

            <div class="u-mt-20">
              <button
                :disabled="![2, 6, '2', '6'].includes(form.default_payment_method)"
                type="button"
                class="o-btn o-btn--primary o-btn--rounded o-btn--sm"
                @click="submitForm(validate)"
              >
                Save
              </button>
            </div>
          </section>
          <!-- <section class="c-box u-mt-20" v-if="userIsResearcher()" v-show="currentTab === 'payment-methods'">
            <header class="c-box__header">
              <h6 class="o-h6">Tax Information</h6>
            </header>
            <div class="c-box__body upload-buttons">
              <button
                v-if="addressForm.country === 'US' || addressForm.country === ''"
                type="button"
                class="u-jc-start o-btn o-btn--long u-mr o-btn--primary o-btn--rounded-sm"
                @click="() => (infoConfirmModalVisible = !infoConfirmModalVisible)"
              >
                <i class="far fa-arrow-up o-btn__icon-left u-mr-30"></i>
                <span> Sign W9 </span>
              </button>
              <button
                v-else
                type="button"
                class="u-jc-start o-btn o-btn--long u-mr-20 o-btn--primary o-btn--rounded-sm"
                @click="() => (infoConfirmModalVisible = !infoConfirmModalVisible)"
              >
                <i class="u-mr-30 far fa-arrow-up o-btn__icon-left"></i>
                <span> Sign W8 </span>
              </button>
              <InfoConfirmModal
                :form="addressForm"
                :submitting="submittingInfoForm"
                :visible="infoConfirmModalVisible"
                @on-close="onInfoConfirmModalClose"
                @on-form-update="onAddressFormUpdate"
                @on-confirm-info-form="initiateForm"
              />
            </div>
          </section> -->
          <!-- /.c-box -->

          <!-- ADDRESS TAB -->
          <AddressTab :form="addressForm" v-show="currentTab === 'address'" @on-form-update="onAddressFormUpdate" />

          <!-- FORM SUBMIT -->
          <div class="u-mt-20" v-if="currentTab !== 'payment-methods'">
            <button type="button" class="o-btn o-btn--primary o-btn--rounded o-btn--sm" @click="submitForm(validate)">
              Save
            </button>
          </div>
          <PasswordConfirmationModal
            :form="passwordForm"
            :visible="passwordModalVisible"
            @on-close="onPasswordModalClose"
            @on-form-update="onPasswordFormUpdate"
            @on-submit-form="submitForm(validate)"
          />
        </ValidationObserver>
      </div>
      <!-- /.c-form__content -->
    </div>
  </div>
</template>

<script>
import { AccountMixin } from '@/mixins/account'
import { AccountSettingsMixin } from '@/modules/account-settings/_mixins/account-settings'
import { BreadcrumbsMixin } from '@/mixins/breadcrumbs'
import CFormErrors from '@/modules/core/_components/c-form/c-form-errors'
import VueScrollTo from 'vue-scrollto'
import AddressTab from '@/modules/account-settings/_components/AddressTab'
import PasswordConfirmationModal from '@/modules/account-settings/_components/PasswordConfirmationModal'
import DeleteUserModal from '@/modules/account-settings/_components/DeleteUserModal'
import PaymentMethodCard from '@/modules/account-settings/_components/PaymentMethodCard'
// import InfoConfirmModal from '@/modules/account-settings/_components/InfoConfirmationModal'

export default {
  name: 'AccountSettingsOverview',
  mixins: [AccountMixin, AccountSettingsMixin, BreadcrumbsMixin],
  components: {
    PasswordConfirmationModal,
    PaymentMethodCard,
    CFormErrors,
    AddressTab,
    DeleteUserModal,
  },
  data() {
    return {
      loading: false,
      currentTab: 'profile',
      currentProfile: {
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        default_payment_method: '',
        paypal_email: '',
        btc_wallet_address: '',
        eth_wallet_address: '',
        usd_bank_account_number: '',
        usd_bank_routing_number: '',
        usd_bank_type: '',
        attachment: '',
        filename: '',
        linked_in: '',
        twitter: '',
      },
      addressForm: {
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip_code: '',
        country: '',
      },
      defaultAddressForm: {
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip_code: '',
        country: '',
      },
      form: {
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        default_payment_method: '',
        paypal_email: '',
        payoneer_email: '',
        btc_wallet_address: '',
        eth_wallet_address: '',
        usd_bank_account_number: '',
        usd_bank_routing_number: '',
        usd_bank_type: '',
        linked_in: '',
        twitter: '',
      },
      passwordForm: {
        old_password: '',
        password_1: '',
        password_2: '',
      },
      formValidationRules: {
        email: {
          required: true,
          email: true,
        },
        firstName: {
          required: true,
        },
        lastName: {
          required: true,
        },
        newPassword: {
          password: '@newpasswordrepeat',
        },
        newPasswordRepeat: {
          required_if: 'newpassword',
        },
        twitter: {
          required: false,
        },
        linkedIn: {
          required: false,
        },
        defaultPaymentMethod: {
          required: true,
        },
      },
      defaultUserAvatar: '/static/images/avatar-person.svg',
      attachment: '',
      filename: '',
      passwordModalVisible: false,
      infoConfirmModalVisible: false,
      submittingInfoForm: false,
      modalOpen: false,
      deleteUserModal: false,
    }
  },
  computed: {
    addressDisplay() {
      if (!this.currentProfile || !this.currentProfile.address) {
        return {}
      }
      const address = this.currentProfile.address
      const parts = [address.city, address.state, address.zip_code, address.country]
      let line3 = ''
      parts.forEach((x, i) => {
        const delimiter = i < parts.length - 1 ? ', ' : ''
        line3 += x ? x + delimiter : ''
      })
      return {
        line1: address.address1,
        line2: address.address2,
        line3: line3,
      }
    },
    currentPasswordValidationRules() {
      const form = {
        defaultMethod: `${this.form.default_payment_method}`,
        btc: this.form.btc_wallet_address || null,
        eth: this.form.eth_wallet_address || null,
        bankAccountNumber: this.form.usd_bank_account_number || null,
        bankRoutingNumber: this.form.usd_bank_routing_number || null,
        bankType: this.form.usd_bank_type || null,
      }

      const profile = {
        defaultMethod: `${this.currentProfile.default_payment_method}`,
        btc: this.profile.btc_wallet_address || null,
        eth: this.profile.eth_wallet_address || null,
        bankAccountNumber: this.profile.usd_bank_account_number || null,
        bankRoutingNumber: this.profile.usd_bank_routing_number || null,
        bankType: this.profile.usd_bank_type || null,
      }

      const formStr = JSON.stringify(form)
      const profileStr = JSON.stringify(profile)
      return {
        required: formStr !== profileStr,
      }
    },
    validatePaypalEmailAddress() {
      return {
        required: this.form.default_payment_method === '2',
      }
    },
    validatePayoneerEmailAddress() {
      return {
        required: this.form.default_payment_method === '6',
      }
    },
    validateBtcWalletAddress() {
      return {
        required: this.form.default_payment_method === '3',
        regex: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/,
      }
    },
    validateEthWalletAddress() {
      return {
        required: this.form.default_payment_method === '4',
        regex: /^0x[a-fA-F0-9]{40}$/,
      }
    },
    validateBankAccountNumber() {
      return {
        required: this.form.default_payment_method === '5',
      }
    },
    validateBankRoutingNumber() {
      return {
        required: this.form.default_payment_method === '5',
        regex: /^[0-9]{9}$/,
      }
    },
    validateUsdBankType() {
      return {
        required: this.form.default_payment_method === '5',
      }
    },
    validateLinkedIn() {
      return {
        required: false,
        regex: /^[a-z0-9_-]+$/i,
      }
    },
    validateTwitter() {
      return {
        required: false,
        regex: /^[a-z0-9_-]+$/i,
      }
    },
    fullName() {
      if (!this.profile || !this.profile.first_name) {
        return ''
      }
      if (!this.profile.last_name) {
        return `${this.profile.first_name}`
      }

      return `${this.profile.first_name} ${this.profile.last_name}`
    },
    userUsername() {
      return this.profile && this.profile.user_name ? this.profile.user_name : ''
    },
    userTypeDisplay() {
      if (!this.profile) {
        return ''
      }

      const userType = this.profile.user_type
      switch (userType) {
        case 'application_owner':
          return 'Application Owner'
        case 'program_manager':
          return 'Program Manager'
        case 'researcher':
          return 'Researcher'
        default:
          return ''
      }
    },
    selectedPayment() {
      return this.profile.default_payment_method
    },
  },
  methods: {
    requiresPassword() {
      if (this.passwordForm.password_1 && this.passwordForm.password_2) {
        return true
      }

      const form = {
        defaultMethod: `${this.form.default_payment_method}`,
        btc: this.form.btc_wallet_address || null,
        eth: this.form.eth_wallet_address || null,
        bankAccountNumber: this.form.usd_bank_account_number || null,
        bankRoutingNumber: this.form.usd_bank_routing_number || null,
        bankType: this.form.usd_bank_type || null,
        paypalEmail: this.form.paypal_email || null,
        email: this.form.email || null,
      }

      const profile = {
        defaultMethod: `${this.currentProfile.default_payment_method}`,
        btc: this.profile.btc_wallet_address || null,
        eth: this.profile.eth_wallet_address || null,
        bankAccountNumber: this.profile.usd_bank_account_number || null,
        bankRoutingNumber: this.profile.usd_bank_routing_number || null,
        bankType: this.profile.usd_bank_type || null,
        paypalEmail: this.profile.paypal_email || null,
        email: this.profile.email || null,
      }

      const formStr = JSON.stringify(form)
      const profileStr = JSON.stringify(profile)
      return formStr !== profileStr
    },
    onPasswordModalClose() {
      this.passwordModalVisible = false
      this.deleteUserModal = false
      this.passwordForm.old_password = ''
    },
    onInfoConfirmModalClose() {
      this.infoConfirmModalVisible = false
    },
    onAddressFormUpdate({ field, value }) {
      this.addressForm[field] = value
    },
    onPasswordFormUpdate({ field, value }) {
      this.passwordForm[field] = value
    },
    handlePhotoChange(e) {
      const file = e.target.files[0] || null
      if (!file || !file.name || !/\.(jpe?g|png|gif)$/i.test(file.name)) {
        return
      }

      const reader = new FileReader()
      reader.onload = e => {
        this.filename = file.name
        this.attachment = reader.result
      }

      reader.readAsDataURL(file)
    },
    async saveProfile() {
      try {
        this.$solar.show()
        const profile = await this.actionEditProfile({
          ...this.form,
          ...this.passwordForm,
          address: this.addressForm,
          filename: this.filename,
          attachment: this.attachment,
        })
        this.currentProfile = profile
        this.$caAlert.success('Profile saved.')
      } catch (e) {
        const error = e.data && e.data.error ? e.data.error : 'Failed to update profile'
        this.$caAlert.error(error)
      } finally {
        this.$solar.hide()
        await this.resetForm()
      }
    },
    async submitForm(validate) {
      if (this.requiresPassword() && !this.passwordForm.old_password) {
        this.passwordModalVisible = true
        return
      }

      this.passwordModalVisible = false
      const valid = await validate()
      if (!valid) {
        const selector = '.c-form-validation.active'
        const el = this.$el.querySelector(selector)
        if (el) {
          VueScrollTo.scrollTo(selector, 500, {
            el: selector,
            offset: -200,
            force: true,
          })
        }
        return
      }

      await this.saveProfile()
    },
    async resetForm() {
      try {
        const profile = this.currentProfile
        if (!profile) {
          return
        }
        this.form = Object.assign({}, profile)
        Object.assign(this.addressForm, profile.address || this.defaultAddressForm)
        const defaultPasswordForm = {
          old_password: '',
          password_1: '',
          password_2: '',
        }
        Object.assign(this.passwordForm, defaultPasswordForm)
        await this.actionLoadProfile()
      } catch (e) {
        this.$caAlert.error('Failed to reset form')
      }
    },
    async initialize() {
      try {
        this.$solar.show()
        const profile = await this.actionLoadAccountSettingsProfile()
        this.currentProfile = profile
        await this.resetForm()
      } catch (e) {
      } finally {
        this.$solar.hide()
      }
    },
    async initiateForm() {
      this.submittingInfoForm = true
      // determine form based on researchers country
      const form = this.addressForm.country === 'US' || this.addressForm.country === '' ? 'w9' : 'w8'
      try {
        // update profile with confirmed details
        const profile = await this.actionEditProfile({
          ...this.form,
          ...this.passwordForm,
          address: this.addressForm,
          filename: this.filename,
          attachment: this.attachment,
        })
        this.currentProfile = profile
        // send appropriate tax form via docusign
        await this.actionInitiateTaxForm({
          form,
          user: this.currentProfile.uuid,
        })
        this.infoConfirmModalVisible = false
        this.$caAlert.success(
          `${form.toUpperCase()} signing initiated. Check email for further instructions on completing form.`
        )
      } catch (error) {
        this.$caAlert.error(`${form.toUpperCase()} signing process failed. Please try again.`)
      } finally {
        this.submittingInfoForm = false
      }
    },
    toggleDeleteAccountModal() {
      this.modalOpen = !this.modalOpen
    },
    async deleteUser() {
      try {
        this.deleteUserModal = false
        await this.actionDeleteUser({ confirmation_password: this.passwordForm.old_password })
        this.modalOpen = false
        this.$caAlert.success('Account successfully deleted')
        await this.actionLogOut
        this.$store.dispatch('RESET_ALL_STORES')
        this.$router.push({ name: 'LogIn' })
      } catch (e) {
        this.passwordForm.old_password = ''
        this.$caAlert.error(e.data.error ? e.data.error : 'Action could not be completed')
      }
    },
  },

  async mounted() {
    await this.initialize()
    this.actionSetBreadcrumbs({
      parent: {
        route: this.$router.resolve({ name: 'AccountSettings' }).route,
        title: 'My Profile',
      },
      child: {
        title: 'Overview',
        route: this.$route,
      },
    })
  },
}
</script>
