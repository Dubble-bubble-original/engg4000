@ui
Feature: Navbar component automated tests

  Background:
    * configure driver = { type: 'chrome' }

  Scenario: Enter the site and navigate to every page
    # Enter website
    Given driver frontendUrl
    Then match enabled('button[testid=enter-btn]') == false
    When click('input[testid=agree-checkbox]')
    Then match enabled('button[testid=enter-btn]') == true
    And click('button[testid=enter-btn]')
    Then waitFor('nav[testid=navbar]')

    # Navigate to home page
    When click('a[testid=nav-home-btn]')
    Then waitFor('div[testid=home-page]')
    And match text('div[testid=home-title]') == 'Recent posts'

    # Navigate to search page
    When click('a[testid=nav-search-btn]')
    Then waitFor('div[testid=search-page]')
    And match text('div[testid=search-title]') == 'Select tags to search'

    # Navigate to create page
    When click('a[testid=nav-create-btn]')
    Then waitFor('div[testid=create-page]')
    And match text('div[testid=create-title]') == 'Follow these steps to create a new post'

    # Navigate to delete page
    When click('a[id=basic-nav-dropdown]')
    And click('a[testid=nav-delete-btn]')
    Then waitFor('div[testid=delete-page]')
    And match text('div[testid=delete-title]') == 'Delete a post'

    # Open terms and conditions modal
    When click('a[id=basic-nav-dropdown]')
    And click('a[testid=nav-terms-conditions-btn]')
    Then waitFor('div[testid=terms-conditions]')
