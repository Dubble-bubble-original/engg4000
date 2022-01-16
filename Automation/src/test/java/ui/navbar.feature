@ui
Feature: Navbar component automated tests

  Background:
    * configure driver = { type: 'chrome' }

  Scenario: Enter the site and navigate to every page
    # Enter website
    Given driver frontendUrl
    When click('input[data-testid=agree-checkbox]')
    And click('button[data-testid=enter-btn]')
    Then waitFor('nav[data-testid=navbar]')

    # Navigate to home page
    When click('a[data-testid=nav-home-btn]')
    Then waitFor('div[data-testid=home-page]')
    And match text('div[data-testid=home-title]') == 'Recent posts'

    # Navigate to search page
    When click('a[data-testid=nav-search-btn]')
    Then waitFor('div[data-testid=search-page]')
    And match text('div[data-testid=search-title]') == 'Select tags to search'

    # Navigate to create page
    When click('a[data-testid=nav-create-btn]')
    Then waitFor('div[data-testid=create-page]')
    And match text('div[data-testid=create-title]') == 'Follow these steps to create a new post'

    # Navigate to delete page
    When click('a[id=basic-nav-dropdown]')
    And click('a[data-testid=nav-delete-btn]')
    Then waitFor('div[data-testid=delete-page]')
    And match text('div[data-testid=delete-title]') == 'Delete a post'

    # Open terms and conditions modal
    When click('a[id=basic-nav-dropdown]')
    And click('a[data-testid=nav-terms-conditions-btn]')
    Then waitFor('div[data-testid=terms-conditions]')
