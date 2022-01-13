@ui
Feature: Navbar component automated tests

  Background:
    * configure driver = { type: 'chrome' }

  Scenario: Enter the site and navigate to every page
    # Enter website
    Given driver frontendUrl
    When click('input[testid=agree-checkbox]')
    And click('button[testid=enter-btn]')
    Then waitFor("nav[testid='navbar']")

    # Navigate to home page
    When click('a[testid=nav-home-btn]')
    Then waitFor("div[testid=home-page]")

    # Navigate to search page
    When click('a[testid=nav-search-btn]')
    Then waitFor("div[testid=search-page]")

    # Navigate to create page
    When click('a[testid=nav-create-btn]')
    Then waitFor("div[testid=create-page]")

    # Navigate to delete page
    When click('a[id=basic-nav-dropdown]')
    And click('a[testid=nav-delete-btn]')
    Then waitFor("div[testid=delete-page]")

    # Open terms and conditions modal
    When click('a[id=basic-nav-dropdown]')
    And click('a[testid=nav-terms-conditions-btn]')
    Then waitFor("div[testid=terms-conditions]")
