export const undefinedUser = {
  active: false,
  email_confirmed: false,
  token: '',
  user_type: '',
}

export const undefinedProfile = {
  assigned_programs: [],
  btc_wallet: '',
  email: '',
  filename: null,
  first_name: '',
  followed_programs: [],
  followed_submissions: [],
  last_name: '',
  linked_in: '',
  paypal_email: null,
  profile_picture: '',
  shirt_size: '',
  twitter: '',
  user_name: '',
  user_type: '',
  uuid: '',
}

export let initialState = {
  user: { ...undefinedUser },
  profile: {},
  entryRedirect: '',
}
