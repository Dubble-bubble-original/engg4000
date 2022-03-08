@ui
Feature: Navbar component automated tests

  Background:
    * configure driver = { type: 'chrome' }

  Scenario: Enter Search page
    # Enter Search Page
    Given driver frontendUrl
    When click('input[data-testid=agree-checkbox]')
    And click('button[data-testid=enter-btn]')
    Then waitFor('nav[data-testid=navbar]')
    And click('a[data-testid=nav-search-btn]')
    Then waitFor('div[data-testid=search-page]')