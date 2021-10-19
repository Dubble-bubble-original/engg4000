Feature: Version endpoint tests

  Background:
    * url baseUrl
    * def auth = callonce read('classpath:utils/authentication.feature')
    * def auth_token = auth.response.token

  Scenario: getting and using an auth token
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