@ui
Feature: Creating a post and then deleting it.

    Background:
      # My attempt at auto-enabling geolocation upon browser start up.
      # The browser was still asking for gerolation even with this line of code
      * configure driver = { type: 'chrome', showDriverLog: true , addOptions: [ 'enable-geolocation' ]}
    
    Scenario: Creating a post then deleting it
      # Enter website
      Given driver frontendUrl
      When click('input[data-testid=agree-checkbox]')
      And click('button[data-testid=enter-btn]')
      Then waitFor('nav[data-testid=navbar]')

      # Navigate to create page
      When click('a[data-testid=nav-create-btn]')
      Then waitFor('div[data-testid=create-page]')
      And match text('div[data-testid=create-page]') == 'Follow the steps below to create a new post'

      # Choose location
      #Then waitFor('button[data-testid=curr-location-btn]')
      #Then click('div[class=gm-style]')
      #Then click('div[data-testid=create-page-map]')
      #Then waitFor('div[data-testid=location-text]')

      # Give avatar name, title & body
      Then input('input[data-testid=name-input]', 'karate name')
      Then input('input[data-testid=title-input]', 'karate title')
      Then input('textarea[data-testid=body-input]', 'karate body')

      # Select Tags
      #Then exists('div[role="alert"]') == true