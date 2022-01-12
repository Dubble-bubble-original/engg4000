# TODO: Remove this file once more tests have been created
Feature: Authentication endpoint tests

  Background:
    * url baseUrl

  Scenario: getting and using an auth token
    # Get a new auth token
    Given path 'auth'
    When method post
    Then status 200
    And match responseType == 'json'
    And match response contains { token: '#notnull', timestamp: '#notnull' }
    * def auth_token = response.token