describe("Time tracking", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');
  const getPlaceholderNumber = () => cy.get('[placeholder="Number"]');
  const closeIssueDetailsModal = () => cy.get('[data-testid="icon:close"]');
  const getIssueDetailTracking = () => cy.get('[data-testid="modal:tracking"]');
  const stopWatch = () => cy.get('[data-testid="icon:stopwatch"]');
  const timeSpent = 2;
  const timeRemaining = 5;

  it("Should add, edit and delete time estimation", () => {
    //Add estimation
    getIssueDetailsModal().within(() => {
      getPlaceholderNumber().should("exist").clear().click().type("10");
      closeIssueDetailsModal();
    });

    //Update estimation
    cy.contains("10").should("be.visible");
    getPlaceholderNumber().should("be.visible").clear().type("20");
    closeIssueDetailsModal();

    //Remove estimation
    cy.contains("20").should("be.visible");
    getPlaceholderNumber().should("be.visible").clear();
    closeIssueDetailsModal();

    //Make sure all changes were successfully made
    getIssueDetailsModal().within(() => {
      getPlaceholderNumber().should("be.visible");
    });
  });

  it("Should add and remove logged time", () => {
    //Log time
    getIssueDetailsModal().within(() => {
      stopWatch().should("exist").click();
    });

    getIssueDetailTracking().within(() => {
      getPlaceholderNumber().eq(0).clear().type(timeSpent);
      getPlaceholderNumber().eq(1).type(timeRemaining);

      getPlaceholderNumber().eq(0).should("have.value", timeSpent);
      getPlaceholderNumber().eq(1).should("have.value", timeRemaining);
      cy.contains("button", "Done").click();
    });

    //Remove logged time
    getIssueDetailsModal().within(() => {
      stopWatch().should("exist").click();
    });

    getIssueDetailTracking().within(() => {
      getPlaceholderNumber().eq(0).clear();
      getPlaceholderNumber().eq(1).clear();
      cy.contains("button", "Done").click();
    });

    //Make sure all changes were successfully made
    getIssueDetailsModal().within(() => {
      getPlaceholderNumber().should("be.visible");
    });
  });
});
