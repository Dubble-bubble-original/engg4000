@ui
Feature: UI tests for the Delete component

  Background:
    * configure driver = { type: 'chrome' }
  
  Scenario: Search empty access code
    # Enter website
    Given driver frontendUrl
    When click('input[data-testid=agree-checkbox]')
    And click('button[data-testid=enter-btn]')
    Then waitFor('nav[data-testid=navbar]')

    # Navigate to delete page
    When click('a[id=basic-nav-dropdown]')
    And click('a[data-testid=nav-delete-btn]')
    Then waitFor('div[data-testid=delete-page]')

    # Press search button
    When click('button[data-testid=search]')
    # No result should appear
    Then delay(100)
    And match exists('#post-found') == false
    And match exists('#post-not-found') == false

  Scenario: Search invalid access code
    # Enter website
    Given driver frontendUrl
    When click('input[data-testid=agree-checkbox]')
    And click('button[data-testid=enter-btn]')
    Then waitFor('nav[data-testid=navbar]')

    # Navigate to delete page
    When click('a[id=basic-nav-dropdown]')
    And click('a[data-testid=nav-delete-btn]')
    Then waitFor('div[data-testid=delete-page]')
    
    # Enter invalid access code
    When input('input[data-testid=access-key]', 'this is not valid')
    # Press search button
    And click('button[data-testid=search]')
    # No result should appear
    Then delay(100)
    And match exists('#post-found') == false
    And match exists('#post-not-found') == false

  Scenario: Search access code that doesn't exist
    # Enter website
    Given driver frontendUrl
    When click('input[data-testid=agree-checkbox]')
    And click('button[data-testid=enter-btn]')
    Then waitFor('nav[data-testid=navbar]')

    # Navigate to delete page
    When click('a[id=basic-nav-dropdown]')
    And click('a[data-testid=nav-delete-btn]')
    Then waitFor('div[data-testid=delete-page]')
    
    # Enter valid access code
    When input('input[data-testid=access-key]', 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa')
    # Press search button
    And click('button[data-testid=search]')
    # Post not found should appear
    Then waitFor('#post-not-found')
    