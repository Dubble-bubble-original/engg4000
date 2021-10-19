@ignore
Feature: Get Authentication Token

  Background:
    * url baseUrl

  Scenario: getting a fresh auth token
    # Get a new auth token
    Given path 'auth'
    When method post
    Then status 200
    And match responseType == 'json'
    And match response contains { token: '#notnull', timestamp: '#notnull' }