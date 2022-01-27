Feature: Get user post endpoints tests

  Background:
    * url baseUrl
    * def auth = callonce read('classpath:utils/authentication.feature')
    * def auth_token = auth.response.token
    * def userpostJSON = read('../data/pagination_post.json')
	
	Scenario: Test Pagination of recentPosts/
    # Create 2 Userpost
    Given path 'post'
    And header token = auth_token
    And request userpostJSON
    When method post
    Then status 201
    * def post_id1 = response.post._id

    Given path 'post'
    And header token = auth_token
    And request userpostJSON
    When method post
    Then status 201
    * def post_id2 = response.post._id

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
    Given path 'deletepost/' + post_id1
    And header token = auth_token
    When method delete
    Then status 200

    Given path 'deletepost/' + post_id2
    And header token = auth_token
    When method delete
    Then status 200

    Scenario: Test Pagination of userPosts/
    # Create 2 Userpost
    Given path 'post'
    And header token = auth_token
    And request userpostJSON
    When method post
    Then status 201
    * def post_id1 = response.post._id

    Given path 'post'
    And header token = auth_token
    And request userpostJSON
    When method post
    Then status 201
    * def post_id2 = response.post._id

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
    Given path 'deletepost/' + post_id1
    And header token = auth_token
    When method delete
    Then status 200

    Given path 'deletepost/' + post_id2
    And header token = auth_token
    When method delete
    Then status 200
