Feature: Version endpoint tests

  Background:
    * url baseUrl
    * def auth = callonce read('classpath:utils/authentication.feature')
    * def auth_token = auth.response.token

  # Create user posts

  Scenario: Try to create a user post with no auth token
    # Call create user post endpoint with no auth token header
    Given path 'userpost'
    When method post
    Then status 401
    And match response contains 'No Authentication Token Provided'

  Scenario: Try to create a user post with invalid auth token
    # Call create user post endpoint with invalid auth token header
    Given path 'userpost'
    And header token = '12345'
    When method post
    Then status 401
    And match response contains 'Invalid Authentication Token Provided'

  Scenario: Try to create a user post with empty request body
    # Call create user post endpoint with empty body
    Given path 'userpost'
    And header token = auth_token
    And request {}
    When method post
    Then status 400
    And match response contains 'No Authentication Token Provided'

  Scenario: Try to create a user post with missing required field
    # Call create user post endpoint with missing required field
    Given path 'userpost'
    And header token = auth_token
    And request read('../data/userPost_missingTittle.json')
    When method post
    Then status 400
    And match response contains 'No Authentication Token Provided'

  # Delete user posts

  Scenario: Try to delete a user post with no auth token
    # Call delete user post endpoint with no auth token header
    Given path 'userpost/12345'
    And request {}
    When method delete
    Then status 401
    And match response contains 'No Authentication Token Provided'

  Scenario: Try to delete a user post with invalid auth token
    # Call delete user post endpoint with invalid auth token header
    Given path 'userpost/12345'
    And header token = '12345'
    And request {}
    When method delete
    Then status 401
    And match response contains 'Invalid Authentication Token Provided'

  Scenario: Try to delete a nonexistent user post
    # Call delete user post endpoint with invalid user post id
    Given path 'userpost/12345' 
    And header token = auth_token
    And request {}
    When method delete
    Then status 404
    And match response contains 'User Post Not Found'

  Scenario: Try to delete a user post without invalid access key
    # Call create user post endpoint with empty body
    Given path 'userpost'
    And header token = auth_token
    And request read('../data/userPost.json')
    When method post
    Then status 201
    * def post_id = response._id
    * def post_access_key = response.access_key
    
    # Call delete user post endpoint with no access key
    Given path 'userpost/' + post_id
    And header token = auth_token
    And request {}
    When method delete
    Then status 400
    And match response contains 'Client Body Does NOT Contain an Access-Key'

    # Call delete user post endpoint with invalid access key
    Given path 'userpost/' + post_id
    And header token = auth_token
    And request {access_key: '12345'}
    When method delete
    Then status 403
    And match response contains 'Client Access-Key Does NOT Match User Post'

    # Call delete user post endpoint
    Given path 'userpost/' + post_id
    And header token = auth_token
    And request {access_key: post_access_key}
    When method delete
    Then status 200

  # Get user posts

  Scenario: Try to get a user post with no auth token
    # Call get user post endpoint with no auth token header
    Given path 'userpost/12345'
    When method get
    Then status 401
    And match response contains 'No Authentication Token Provided'

  Scenario: Try to get a user post with invalid auth token
    # Call get user post endpoint with invalid auth token header
    Given path 'userpost/12345'
    And header token = '12345'
    When method get
    Then status 401
    And match response contains 'Invalid Authentication Token Provided'

  Scenario: Try to get a nonexistent user post
    # Call get user post endpoint with invalid user post id
    Given path 'userpost/12345' 
    And header token = auth_token
    When method get
    Then status 404
    And match response contains 'User Post Not Found'

  # Update User posts
  #TODO

  # Create, get, update, delete user posts

  Scenario: Create, get, update, and delete a userPost
    # Call create user post endpoint
    Given path 'userpost'
    And header token = auth_token
    And request read('../data/userPost.json')
    When method post
    Then status 201
    * def post_id = response._id
    * def post_access_key = response.access_key

    # Call get user post endpoint
    Given path 'userpost/' + post_id
    And header token = auth_token
    When method get
    Then status 200
    And match response._id == post_id

    # Call update user post endpoint
    #TODO

    # Call delete user post endpoint
    Given path 'userpost/' + post_id
    And header token = auth_token
    And request {access_key: post_access_key}
    When method delete
    Then status 200