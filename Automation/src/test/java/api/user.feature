Feature: User endpoints tests

  Background:
    * url baseUrl
    * def auth = callonce read('classpath:utils/authentication.feature')
    * def auth_token = auth.response.token

  # Create users

  Scenario: Try to create a user with no auth token
    # Call create user endpoint with no auth token header
    Given path 'user'
    When method post
    Then status 401
    And match response.message == 'No Authentication Token Provided'

  Scenario: Try to create a user with invalid auth token
    # Call create user endpoint with invalid auth token header
    Given path 'user'
    And header token = '12345'
    When method post
    Then status 401
    And match response.message == 'Invalid Authentication Token Provided'

  Scenario: Try to create a user with empty request body
    # Call create user endpoint with empty body
    Given path 'user'
    And header token = auth_token
    When method post
    Then status 400
    And match response.message == 'No Request Body Provided'

  Scenario: Try to create a user with missing required field
    # Call create user endpoint with missing required field
    Given path 'user'
    And header token = auth_token
    And request read('../data/user_missingName.json')
    When method post
    Then status 400
    And match response.message == 'Invalid Request Body Format'

  # Delete users

  Scenario: Try to delete a user with no auth token
    # Call delete user endpoint with no auth token header
    Given path 'user/12345'
    When method delete
    Then status 401
    And match response.message == 'No Authentication Token Provided'

  Scenario: Try to delete a user with invalid auth token
    # Call delete user endpoint with invalid auth token header
    Given path 'user/12345'
    And header token = '12345'
    When method delete
    Then status 401
    And match response.message == 'Invalid Authentication Token Provided'

  Scenario: Try to delete a user with invalid id
    # Call delete user endpoint with invalid user id
    Given path 'user/12345'
    And header token = auth_token
    When method delete
    Then status 400
    And match response.message == 'Invalid User ID'
  
  Scenario: Try to delete a nonexistent user
    # Call delete user endpoint with nonexistent user id
    Given path 'user/53cb6b9b4f4ddef1ad47f943'
    And header token = auth_token
    When method delete
    Then status 404
    And match response.message == 'User Not Found'

  Scenario: Try to delete a user
    # Call create user endpoint with
    Given path 'user'
    And header token = auth_token
    And request read('../data/user.json')
    When method post
    Then status 201
    * def user_id = response.user._id

    # Call delete user endpoint
    Given path 'user/' + user_id
    And header token = auth_token
    When method delete
    Then status 200
    And match response.message == 'User Deleted Successfully'

  # Get users

  Scenario: Try to get a user with no auth token
    # Call get user endpoint with no auth token header
    Given path 'user/12345'
    When method get
    Then status 401
    And match response.message == 'No Authentication Token Provided'

  Scenario: Try to get a user with invalid auth token
    # Call get user endpoint with invalid auth token header
    Given path 'user/12345'
    And header token = '12345'
    When method get
    Then status 401
    And match response.message == 'Invalid Authentication Token Provided'

  Scenario: Try to get a user with invalid id
    # Call get user endpoint with invalid user id
    Given path 'user/12345'
    And header token = auth_token
    When method get
    Then status 400
    And match response.message == 'Invalid User ID'

  Scenario: Try to get a nonexistent user
    # Call get user endpoint with nonexistent user id
    Given path 'user/53cb6b9b4f4ddef1ad47f943'
    And header token = auth_token
    When method get
    Then status 404
    And match response.message == 'User Not Found'

  # Create, get, delete user

  Scenario: Create, get, and delete a user
    # Call create user endpoint
    Given path 'user'
    And header token = auth_token
    And request read('../data/user.json')
    When method post
    Then status 201
    * def user_id = response.user._id

    # Call get user endpoint
    Given path 'user/' + user_id
    And header token = auth_token
    When method get
    Then status 200
    And match response._id == user_id

    # Call delete user endpoint
    Given path 'user/' + user_id
    And header token = auth_token
    When method delete
    Then status 200
    And match response.message == 'User Deleted Successfully'
