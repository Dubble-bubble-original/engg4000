@ui
Feature: Example UI Test

  Background:
    * configure driver = { type: 'chrome' }

  Scenario: Search for cat images on Google
    Given driver 'http://google.com'
    And click('{a}Images')
    And waitFor("input[title='Search']")
    And input("input[title='Search']", 'cat')
    When input('body', Key.ENTER)
    Then waitFor("img")
