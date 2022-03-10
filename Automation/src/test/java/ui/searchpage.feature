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

  Scenario: Search Button Disabled
    Given driver frontendUrl
    When click('input[data-testid=agree-checkbox]')
    And click('button[data-testid=enter-btn]')
    Then waitFor('nav[data-testid=navbar]')
    And click('a[data-testid=nav-search-btn]')
    Then waitFor('div[data-testid=search-page]')
    Then match enabled('button[data-testid=search-button]') == false
    Then match text('div[data-testid=no-tags-alert]') == ' You must select at least one tag.'

  Scenario: Search Button Enabled
    Given driver frontendUrl
    When click('input[data-testid=agree-checkbox]')
    And click('button[data-testid=enter-btn]')
    Then waitFor('nav[data-testid=navbar]')
    And click('a[data-testid=nav-search-btn]')
    Then waitFor('div[data-testid=tag-group]')
    And click('input[data-testid=fall]')
    Then match enabled('button[data-testid=search-button]') == true