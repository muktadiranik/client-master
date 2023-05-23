export default {
  'Log in page loads and presents log in form'(client) {
    client
      .url(client.globals.BASE_URL + '/#/log-in')
      .waitForElementVisible('.content')
      .expect.element('.form-container form').to.be.present

    client.end()
  },
}
