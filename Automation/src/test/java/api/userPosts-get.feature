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

  Scenario: Try to get a user post with invalid id
    # Call get user post endpoint with invalid user post id
    Given path 'userpost/12345'
    And header token = auth_token
    When method get
    Then status 400
    And match response.message == 'Invalid User Post ID'

  Scenario: Try to get a nonexistent user post
    # Call get user post endpoint with nonexistent user post id
    Given path 'userpost/53cb6b9b4f4ddef1ad47f943'
    And header token = auth_token
    When method get
    Then status 404
    And match response.message == 'User Post Not Found'
