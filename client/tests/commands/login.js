exports.command = function(username, password, callback) {
  var self = this
  this.url(this.globals.BASE_URL)
    .setValue('#input_field_email', username)
    .setValue('#input_field_password', password)
    .click('#log-in-button')

  if (typeof callback === 'function') {
    callback.call(self)
  }

  return this
}
