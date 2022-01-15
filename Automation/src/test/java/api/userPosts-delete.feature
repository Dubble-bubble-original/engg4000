Feature: Delete user post endpoint tests

  Background:
    * url baseUrl
    * def auth = callonce read('classpath:utils/authentication.feature')
    * def auth_token = auth.response.token

  Scenario: Try to delete a user post with no auth token
    # Call delete user post endpoint with no auth token header
    Given path 'userpost/12345'
    And request {}
    When method delete
    Then status 401
    And match response.message == 'No Authentication Token Provided'

  Scenario: Try to delete a user post with invalid auth token
    # Call delete user post endpoint with invalid auth token header
    Given path 'userpost/12345'
    And header token = '12345'
    And request {}
    When method delete
    Then status 401
    And match response.message == 'Invalid Authentication Token Provided'

  Scenario: Try to delete a nonexistent user post
    # Call delete user post endpoint with valid id that doesn't exist
    Given path 'userpost/507f1f77bcf86cd799439011'
    And header token = auth_token
    And request {}
    When method delete
    Then status 404
    And match response.message == 'User Post Not Found'

  Scenario: Try to delete a user post with invalid id
    # Call create user post endpoint with empty body
    Given path 'userpost'
    And header token = auth_token
    And request read('../data/userPost.json')
    When method post
    Then status 201
    * def post_id = response.post._id

    # Call delete user post endpoint with invalid access key
    Given path 'userpost/12345'
    And header token = auth_token
    When method delete
    Then status 400
    And match response.message == 'Invalid User Post ID'

    # Call delete user post endpoint
    Given path 'userpost/' + post_id
    And header token = auth_token
    When method delete
    Then status 200
    And match response.message == 'User Post Deleted Successfully'
