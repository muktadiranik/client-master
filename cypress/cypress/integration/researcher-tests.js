describe("dev.cespp.com", function () {
  it("Login", function () {
    // clear cookies and set cookie whitelist
    cy.clearCookie("INSPECTIV_USER");
    Cypress.Cookies.defaults({ whitelist: "INSPECTIV_USER" });

    // load site, set username and password, then click login button
    var username = "researcher1";
    var password = "abc123456";
    cy.visit("http://dev.inspectiv.io");
    cy.get("#input_field_email").type(username);
    cy.get("#input_field_password").type(password);
    cy.get("#log-in-button").click();

    // look for featured programs header
    cy.contains("Featured Programs", { timeout: 10000 }).should("be.visible");
  });

  it("Programs list", function () {
    // programs``
    var items = [
      "CESPPA Active Program",
      "CESPPA Frozen Program",
      "CESPPA Private Program",
    ];
    for (var i = 0; i < items.length; i++) {
      cy.contains(items[i]).should("be.visible");
    }

    // test search box
    cy.get(".form__control").should("be.visible").type("Active");
    cy.contains("CESPPA Active Program", { timeout: 10000 }).should(
      "be.visible"
    );
    cy.get(".fa-times-circle").click();
    cy.contains("CESPPA Frozen Program").should("be.visible");
  });

  it("Submission list", function () {
    cy.visit("http://dev.inspectiv.io/#/submissions");

    // featured programs header
    cy.contains("All Submissions", { timeout: 10000 }).should("be.visible");

    // make sure there are 15 submissions in the list
    cy.get(".c-report__title");

    // look for row layout items
    cy.get(".fa-comments-alt").should("be.visible");
    cy.get(".fa-usd-circle").should("be.visible");
    cy.get(".fa-tasks-alt").should("be.visible");

    // make sure table headers are shown
    cy.contains("Created");
    cy.contains("Submission");
    cy.contains("Status");
    cy.contains("Severity");
    cy.contains("Bounty");

    // load submission
    cy.get(".c-report__title > a:first", { timeout: 10000 }).click();
  });

  it("Submission detail", function () {
    // check layout
    cy.get(".c-report__header", { timeout: 10000 }).should("be.visible");
    cy.get(".c-report__title-bar").should("be.visible");
    cy.contains("Status");
    cy.contains("Severity");
    cy.contains("Bounty");
    cy.contains("Vulnerability");

    // test messages
    cy.get("textarea[class=form__control]:last").type("deadbeef{enter}");
    cy.contains("deadbeef");

    // edit button
    cy.get("a[class=c-report__edit]").click();
    cy.get("#create-submission-form-header").should("be.visible");
    cy.contains("Cancel").click();
  });

  it("Create submission", function () {
    // open programs page
    cy.visit("http://dev.inspectiv.io/#/programs");

    // click active program
    cy.contains("CESPPA Active Program").click();

    // check layout
    cy.get(".content-copy").should("be.visible");

    // click create button
    cy.get(".o-btn--outline-primary").click();

    // fill out form
    cy.get("#submission_title").type("foo");
    cy.get("textarea[name=submission_details]")
      .click({ force: true })
      .type("{selectall}{backspace}asdfg", { force: true });

    // click submit button
    cy.get("#submit-submission-button").click();

    // check for new submission
    cy.contains("foo");
  });

  it("Bank", function () {
    // visit bank
    cy.visit("http://dev.inspectiv.io/#/bank/my-payments");

    // check header
    cy.contains("Pending Transactions").should("be.visible");

    // check transaction list
    cy.get(".transaction-detail");
  });

  it("User profile", function () {
    // visit account profile
    cy.visit("http://dev.inspectiv.io/#/account");

    // check header
    cy.contains("Info").should("be.visible");

    // fill out form
    cy.get("#fname").type("abc");
    cy.get("#lname").type("abc");
    cy.get("#eaddress").click();

    // click save
    cy.get("#ca-alert-button-1").click();
  });
});
