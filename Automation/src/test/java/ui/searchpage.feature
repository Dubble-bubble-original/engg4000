@ui
Feature: Navbar component automated tests

  Background:
    * configure driver = { type: 'chrome' }

  Scenario: Enter Search page
    # Enter website
    Given driver frontendUrl
    When click('input[data-testid=agree-checkbox]')
    And click('button[data-testid=enter-btn]')
    Then waitFor('nav[data-testid=navbar]')

    # MOve to search page
    When click('a[data-testid=nav-search-btn]')
    Then waitFor('div[data-testid=search-page]')

  Scenario: Search Button Disabled
    # Enter website
    Given driver frontendUrl
    When click('input[data-testid=agree-checkbox]')
    And click('button[data-testid=enter-btn]')
    Then waitFor('nav[data-testid=navbar]')

    # Enter search page and check to see if the search button is disabled
    When click('a[data-testid=nav-search-btn]')
    Then waitFor('div[data-testid=search-page]')
    And match enabled('button[data-testid=search-button]') == false
    And match text('div[data-testid=no-tags-alert]') == ' You must select at least one tag.'

  Scenario: Search Button Enabled
    # Enter Website
    Given driver frontendUrl
    When click('input[data-testid=agree-checkbox]')
    And click('button[data-testid=enter-btn]')
    Then waitFor('nav[data-testid=navbar]')

    # Enter search page
    When click('a[data-testid=nav-search-btn]')
    Then waitFor('div[data-testid=tag-group]')

    # Select a tag
    When click('#tgb-btn-fall')
    Then match enabled('button[data-testid=search-button]') == true

  Scenario: Click search button after selecting some tags
    # Enter Website
    Given driver frontendUrl
    When click('input[data-testid=agree-checkbox]')
    And click('button[data-testid=enter-btn]')
    Then waitFor('nav[data-testid=navbar]')

    # Enter search page
    When click('a[data-testid=nav-search-btn]')
    Then waitFor('div[data-testid=tag-group]')

    # Select some tags
    When click('#tgb-btn-fall')
    And click('#tgb-btn-food')
    And click('#tgb-btn-other')
    Then match enabled('button[data-testid=search-button]') == true

    # Click the search button
    When click('button[data-testid=search-button]')
    Then waitFor('div[data-testid=selcted-tags]')
    And match text('button[data-testid=selected-btn-fall]') == 'fall'
    And match text('button[data-testid=selected-btn-food]') == 'food'
    And match text('button[data-testid=selected-btn-other]') == 'other'

  Scenario: Searching tags with the filter feature
    # Enter Website
    Given driver frontendUrl
    When click('input[data-testid=agree-checkbox]')
    And click('button[data-testid=enter-btn]')
    Then waitFor('nav[data-testid=navbar]')

    # Enter search page
    When click('a[data-testid=nav-search-btn]')
    Then waitFor('div[data-testid=filter-input]')

    # Search for a tag
    When input('#filter-input-field', 'Se')
    Then click('#tgb-btn-desert')
    And click('#tgb-btn-seasonal')
    And match enabled('button[data-testid=search-button]') == true

    # Click the search button
    When click('button[data-testid=search-button]')
    Then waitFor('div[data-testid=selcted-tags]')
    And match text('button[data-testid=selected-btn-desert]') == 'desert'
    And match text('button[data-testid=selected-btn-seasonal]') == 'seasonal'