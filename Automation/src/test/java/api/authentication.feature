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

    # Call version endpoint with no auth token header
    Given path 'version'
    When method get
    Then status 401
    And match response contains 'No Authentication Token Provided'

    # Call version endpoint with invalid auth token header
    Given path 'version'
    And header token = '12345'
    When method get
    Then status 401
    And match response contains 'Invalid Authentication Token Provided'

    # Call version endpoint with valid auth token header
    Given path 'version'
    And header token = auth_token
    When method get
    Then status 200