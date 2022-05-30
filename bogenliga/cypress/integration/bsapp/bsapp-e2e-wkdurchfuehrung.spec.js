/**
 * Tests for offline functionality
 */
describe('Wkdurchfuehrung tests', function () {
  it('Login erfolgreich', function () {
    cy.visit('http://localhost:4200/#/home')
    cy.get('[data-cy=login-button]').click()
    cy.url().should('include', '#/user/login')
    cy.get('[data-cy=login-als-admin-button]').click()
    cy.url().should('include', '#/home')
  })

  /**
   * This test opens the sidebar and clicks on the "WKDURCHFUEHRUNG" tab and checks if the url has changed successfully
   */
  it('Anzeige Wkdurchfuehrung', function () {
    cy.get('[data-cy=sidebar-wkdurchfuehrung-button]').click()
    cy.url().should('include', '#/wkdurchfuehrung')
  })

  /**
   * This test checks if Veranstaltungen in wkdurchfuehrung load correctly
   */
  it('Anzeige Veranstaltung und Jahre in wkdurchfuehrung', function () {
    cy.get('[data-cy=sidebar-wkdurchfuehrung-button]').click()
    cy.wait(1000)
    cy.get('[data-cy=wkduchfuehrung-jahr-dropdown]').click()
    cy.get('.dropdown-item:nth-child(1').click()
    cy.get('[data-cy=wkduchfuehrung-veranstaltung-list]')
    cy.get('option:nth-child(1)').should('be.visible')
  })

  /**
   * This test checks if Wettkampftage of Veranstaltungen in wkdurchfuehrung load correctly
   */
  it('Anzeige Wettkampftage in wkdurchfuehrung', function () {
    cy.get('[data-cy=wkduchfuehrung-veranstaltung-list]')
    cy.get('[data-cy=bla-selection-list]').select('1: 0')
    cy.get('[data-cy=wkdurchfuehrung-wettkampftage-list]')
    cy.get('[data-cy="TABLE.ACTIONS.VIEW"]').should('be.visible')

  })

  /**
   * This test checks if Matches of Wettkampftage in wkdurchfuehrung load correctly
   */
  it('Anzeige Matches in wkdurchfuehrung', function () {
    cy.get('[data-cy="TABLE.ACTIONS.VIEW"]').first().click()
    cy.get('[data-cy="wkdurchfuehrung-match-list"]')
    cy.get('[data-cy="TABLE.ACTIONS.EDIT"]').should('be.visible')
  })
})

describe("offline-fähigkeit", {browser: "!firefox"}, () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  /**
   * This test checks if going offline works
   */
  it('Offline gehen in wkdurchfuehrung', function () {
    cy.get('[data-cy="wkdurchfuehrung-btn-offlinegehen"]').click()
    cy.get('.modal-dialog-header').should('be.visible').should('contain.text', ' Offline-Modus aktiviert')
    cy.get('.modal-dialog-ok').find('bla-button').click()
    cy.get('.modal-content').should('not.be.visible')
  })

  it('Offline wkdurchfuehrung Daten anzeigen',function() {
    cy.get('[data-cy=sidebar-ligatabelle-button]').click()
    cy.url().should('include', '#/ligatabelle')
    cy.get('[data-cy=sidebar-wkdurchfuehrung-button]').click()
    cy.url().should('include', '#/wkdurchfuehrung')
    cy.get('[data-cy=wkduchfuehrung-veranstaltung-list]')
      .find('select').find('option').should('be.visible')
  })

  it('Offline Veranstaltung Tabelle anzeigen', function(){
    cy.get('[data-cy=wkduchfuehrung-veranstaltung-list]')
      .find('select').find('option').should('be.visible')
  })

  it('Offline Wettkampftage Tabelle anzeigen', function(){
    cy.get('[data-cy=wkdurchfuehrung-wettkampftage-list]')
      .find('[data-cy="TABLE.ACTIONS.VIEW"]').should('be.visible')
  })

  it('Offline Match Tabelle anzeigen', function(){
    cy.get('[data-cy="wkdurchfuehrung-match-list"]')
      .find('[data-cy="TABLE.ACTIONS.EDIT"]').should('be.visible')
  })


})
