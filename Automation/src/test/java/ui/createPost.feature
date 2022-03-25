@ui
Feature: UI tests for the Create component

  Background:
    * configure driver = { type: 'chrome' }

  Scenario: Navigate to create page, check error messages
    # Enter website
    Given driver frontendUrl
    When click('input[data-testid=agree-checkbox]')
    And click('button[data-testid=enter-btn]')
    Then waitFor('nav[data-testid=navbar]')

    # Navigate to create page
    When click('a[data-testid=nav-create-btn]')
    Then waitFor('div[data-testid=create-page]')
    # Check title message
    And match text('div[data-testid=create-page]') == 'Follow the steps below to create a new post'
    # Error messages should be shown
    And match attribute('div[data-testid=location-error]', 'hidden') == null
    And match attribute('div[data-testid=tags-error]', 'hidden') == null
    And match attribute('div[data-testid=preview-error]', 'hidden') == null
    And match attribute('input[data-testid=name-input]', 'class') contains 'is-invalid'
    And match attribute('input[data-testid=title-input]', 'class') contains 'is-invalid'
    And match attribute('textarea[data-testid=body-input]', 'class') contains 'is-invalid'

  Scenario: Enter whitespace in create page field
    # Enter website
    Given driver frontendUrl
    When click('input[data-testid=agree-checkbox]')
    And click('button[data-testid=enter-btn]')
    Then waitFor('nav[data-testid=navbar]')

    # Navigate to create page
    When click('a[data-testid=nav-create-btn]')
    Then waitFor('div[data-testid=create-page]')

    # Enter whitespace in name, title, body
    When input('input[data-testid=name-input]', '    ')
    And input('input[data-testid=title-input]', '     ')
    And input('textarea[data-testid=body-input]', '  \n\n   \t  \n')
    # Errors should still be shown
    Then match attribute('input[data-testid=name-input]', 'class') contains 'is-invalid'
    And match attribute('input[data-testid=title-input]', 'class') contains 'is-invalid'
    And match attribute('textarea[data-testid=body-input]', 'class') contains 'is-invalid'

  Scenario: Select more than 5 tags in create page
    # Enter website
    Given driver frontendUrl
    When click('input[data-testid=agree-checkbox]')
    And click('button[data-testid=enter-btn]')
    Then waitFor('nav[data-testid=navbar]')

    # Navigate to create page
    When click('a[data-testid=nav-create-btn]')
    Then waitFor('div[data-testid=create-page]')

    # Select 6 tags
    When click('label[data-testid=tags]:nth-child(2)')
    When click('label[data-testid=tags]:nth-child(4)')
    When click('label[data-testid=tags]:nth-child(6)')
    When click('label[data-testid=tags]:nth-child(8)')
    When click('label[data-testid=tags]:nth-child(10)')
    When click('label[data-testid=tags]:nth-child(12)')
    # Error should be shown
    Then match attribute('div[data-testid=tags-error]', 'hidden') == null
    And match text('div[data-testid=tags-error]') contains "You cannot select more than 5 tags."
  
  Scenario: Create and delete a post
    # Enter website
    Given driver frontendUrl
    When click('input[data-testid=agree-checkbox]')
    And click('button[data-testid=enter-btn]')
    Then waitFor('nav[data-testid=navbar]')

    # Navigate to create page
    When click('a[data-testid=nav-create-btn]')
    Then waitFor('div[data-testid=create-page]')

    # Select position (click on the map)
    When click('div[data-testid=location-picker-map] > div > div > div > div:nth-child(2) > div:nth-child(2)')
    # Enter name, title, body
    And input('input[data-testid=name-input]', 'karate name')
    And input('input[data-testid=title-input]', 'karate title')
    And input('textarea[data-testid=body-input]', 'karate body')
    # Select 1 tag
    And click('label[data-testid=tags]:nth-child(2)')
    # Wait for preview to appear
    Then waitFor('div[data-testid=preview-post]')
    # Make sure error messages are gone
    And match attribute('div[data-testid=location-error]', 'hidden') == ''
    And match attribute('div[data-testid=tags-error]', 'hidden') == ''
    And match attribute('div[data-testid=preview-error]', 'hidden') == ''
    And match attribute('input[data-testid=name-input]', 'class') !contains 'is-invalid'
    And match attribute('input[data-testid=title-input]', 'class') !contains 'is-invalid'
    And match attribute('textarea[data-testid=body-input]', 'class') !contains 'is-invalid'
    
    # Accept terms
    When click('input[data-testid=agree-checkbox]')
    # Submit
    And click('button[data-testid=publish]')
    # Wait for modal to appear
    Then waitFor('body > div.fade.modal.show')

    # Confirm
    When click('button[data-testid=accept]')
    # Wait for feedback section to appear
    Then waitFor('div[data-testid=feedback-section]')
    # Check for success message
    And match text('div[data-testid=feedback-success]') contains "Post created successfully."
    # Copy the access key
    And def accessKey = text('span[data-testid=access-key]')

    # Navigate to delete page
    When click('a[id=basic-nav-dropdown]')
    And click('a[data-testid=nav-delete-btn]')
    Then waitFor('div[data-testid=delete-page]')

    # Enter the access key
    When input('input[data-testid=access-key]', accessKey)
    # Press search button
    And click('button[data-testid=search]')
    # Wait for preview to appear
    Then waitFor('div[data-testid=delete-preview]')

    # Click delete
    When click('button[data-testid=delete-post]')
    # Wait for modal to appear
    Then waitFor('body > div.fade.modal.show')

    # Confirm
    When click('button[data-testid=accept]')
    # Wait for feedback section to appear
    Then waitFor('div[data-testid=feedback-section]')
    # Check for sucess message
    And match text('div[data-testid=feedback-success]') contains "Post deleted successfully."