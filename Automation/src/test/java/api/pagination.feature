Feature: Get user post endpoints tests

  Background:
    * url baseUrl
    * def auth = callonce read('classpath:utils/authentication.feature')
    * def auth_token = auth.response.token
    * def userpostJSON = read('../data/pagination_post.json')
	
	Scenario: Test Pagination of recentPosts/
    # Create 2 Userpost
    * def post1 = call read('classpath:utils/createPost.feature') { data: '#(userpostJSON)' }
    * def post2 = call read('classpath:utils/createPost.feature') { data: '#(userpostJSON)' }

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

    # Delete the created posts
    * call read('classpath:utils/deletePost.feature') { access_key: '#(post1.response.post.access_key)' }
    * call read('classpath:utils/deletePost.feature') { access_key: '#(post2.response.post.access_key)' }

    Scenario: Test Pagination of userPosts/
    # Create 2 Userpost
    * def post1 = call read('classpath:utils/createPost.feature') { data: '#(userpostJSON)' }
    * def post2 = call read('classpath:utils/createPost.feature') { data: '#(userpostJSON)' }

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

    # Delete the created posts
    * call read('classpath:utils/deletePost.feature') { access_key: '#(post1.response.post.access_key)' }
    * call read('classpath:utils/deletePost.feature') { access_key: '#(post2.response.post.access_key)' }
