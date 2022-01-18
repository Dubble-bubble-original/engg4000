Feature: Get user post endpoints tests

  Background:
    * url baseUrl
    * def auth = callonce read('classpath:utils/authentication.feature')
    * def auth_token = auth.response.token
    * def userpostJSON = read('../data/pagination_post.json')
	
	Scenario: Test Pagination of recentPosts/
    # Create User
    Given path 'user'
    And header token = auth_token
    And request {name: "pagination test", avatar_url:"www.pagination.test", email:"pagination@pagination.test"}
    When method post
    Then status 201
    * def user_id = response.user._id
    * userpostJSON.author = user_id

    # Create 2 Temporary User Posts
    Given path 'userpost'
    And header token = auth_token
    And request userpostJSON
    When method post
    Then status 201
    * def post1_access_key = response.post.access_key
    * def post1_id = response.post._id

    Given path 'userpost'
    And header token = auth_token
    And request userpostJSON
    When method post
    Then status 201
    * def post2_access_key = response.post.access_key
    * def post2_id = response.post._id

    # Test for post_limit of 1
    Given path 'recentposts'
    And header token = auth_token
    And request {post_limit: 1}
    When method post
    Then status 200
    And assert response.length == 1

    # Test for post_limit of 2
    Given path 'recentposts'
    And header token = auth_token
    And request {post_limit: 2}
    When method post
    Then status 200
    And assert response.length == 2

    # Delete posts
    Given path 'userpost/' + post1_id
    And header token = auth_token
    When method delete
    Then status 200

    Given path 'userpost/' + post2_id
    And header token = auth_token
    When method delete
    Then status 200

    # Delete User
    Given path 'user/' + user_id
    And header token = auth_token
    When method delete
    Then status 200

    Scenario: Test Pagination of userPosts/
    # Create User
    Given path 'user'
    And header token = auth_token
    And request {name: "pagination test", avatar_url:"www.pagination.test", email:"pagination@pagination.test"}
    When method post
    Then status 201
    * def user_id = response.user._id
    * userpostJSON.author = user_id

    # Create 2 Temporary User Posts
    Given path 'userpost'
    And header token = auth_token
    And request userpostJSON
    When method post
    Then status 201
    * def post1_access_key = response.post.access_key
    * def post1_id = response.post._id

    Given path 'userpost'
    And header token = auth_token
    And request userpostJSON
    When method post
    Then status 201
    * def post2_access_key = response.post.access_key
    * def post2_id = response.post._id

    # Test for post_limit of 1
    Given path 'userposts'
    And header token = auth_token
    And request {post_limit: 1, title:'pagination test'}
    When method post
    Then status 200
    And assert response.length == 1

    # Test for post_limit of 2
    Given path 'userposts'
    And header token = auth_token
    And request {post_limit: 2, title:'pagination test'}
    When method post
    Then status 200
    And assert response.length == 2

    # Delete posts
    Given path 'userpost/' + post1_id
    And header token = auth_token
    When method delete
    Then status 200

    Given path 'userpost/' + post2_id
    And header token = auth_token
    When method delete
    Then status 200

    # Delete User
    Given path 'user/' + user_id
    And header token = auth_token
    When method delete
    Then status 200
