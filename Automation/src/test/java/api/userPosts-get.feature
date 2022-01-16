Feature: Get user post endpoints tests

  Background:
    * url baseUrl
    * def auth = callonce read('classpath:utils/authentication.feature')
    * def auth_token = auth.response.token

  # Get user posts

  Scenario: Try to get a user post with no auth token
    # Call get user post endpoint with no auth token header
    Given path 'userpost/12345'
    When method get
    Then status 401
    And match response.message == 'No Authentication Token Provided'

  Scenario: Try to get a user post with invalid auth token
    # Call get user post endpoint with invalid auth token header
    Given path 'userpost/12345'
    And header token = '12345'
    When method get
    Then status 401
    And match response.message == 'Invalid Authentication Token Provided'

  Scenario: Try to get a user post with invalid access key
    # Call get user post endpoint with invalid access key
    Given path 'userpost/12345'
    And header token = auth_token
    When method get
    Then status 404
    And match response.message == 'User Post Not Found'

  Scenario: Try to get a nonexistent user post
    # Call get user post endpoint with nonexistent access key
    Given path 'userpost/00000000-0000-4000-8900-000000000000'
    And header token = auth_token
    When method get
    Then status 404
    And match response.message == 'User Post Not Found'
