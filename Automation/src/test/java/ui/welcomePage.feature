@ui
Feature: Welcome page component automated tests

  Background:
    * configure driver = { type: 'chrome' }

  Scenario: Enter the site
    # Enter website
    Given driver frontendUrl
    Then match enabled('button[data-testid=enter-btn]') == false
    When click('input[data-testid=agree-checkbox]')
    Then match enabled('button[data-testid=enter-btn]') == true
    And click('button[data-testid=enter-btn]')
    Then waitFor('nav[data-testid=navbar]')
