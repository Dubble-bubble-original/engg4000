Feature: Tests for making sure _id's and access_key are not returned

  Background:
    * url baseUrl
    * def auth = callonce read('classpath:utils/authentication.feature')
    * def auth_token = auth.response.token
    * def post = read('../data/filter_userPosts_data.json')

  # Test for POST '/userpost'
  Scenario: Call create userpost endpoint
    # Call create user post endpoint
    Given path 'userpost'
    And header token = auth_token
    And request read('../data/userPost.json')
    When method post
    Then status 201
    * match response.post._id == '#notpresent'
    * def post_access_key = response.post.access_key

    # Delete created user post
    * call read('classpath:utils/deletePost.feature') { access_key: '#(post_access_key)' }

  # Test for PATCH '/userpost'
  Scenario: Call update user post endpoint
    # Create a user post
    * def post1_data = call read('classpath:utils/createPost.feature') { data: '#(post.post1)' }
    * def access_key = post1_data.response.post.access_key
    * def post1 = call read('classpath:utils/getPost.feature') { access_key: '#(access_key)' }
    * def post_id = post1.response._id

    # Call the PATCH '/userpost' endpoint
    Given path 'userpost/' + post_id
    And header token = auth_token
    And request { update: { title: 'new title' } }
    When method patch
    Then status 200
    * match each response..['access_key'] == '#notpresent'
    * match each response..['_id'] == '#notpresent'

    # Delete created user post
    * call read('classpath:utils/deletePost.feature') { access_key: '#(access_key)' }

  # Test for POST '/userposts'
  Scenario: Call userposts endpoint
    # Create a user post
    * def post1_data = call read('classpath:utils/createPost.feature') { data: '#(post.post1)' }
    * def access_key = post1_data.response.post.access_key
    * def post1 = call read('classpath:utils/getPost.feature') { access_key: '#(access_key)' }
    * def post_id = post1.response._id

    # Call '/userposts endpoint'
    Given path 'userposts'
    And header token = auth_token
    And request { title: "Mclaren F1" }
    When method post
    Then status 200
    * match each response..['access_key'] == '#notpresent'
    * match each response..['_id'] == '#notpresent'

    # Delete created user post
    * call read('classpath:utils/deletePost.feature') { access_key: '#(access_key)' }

  # Test for '/recentpost' endpoint
  Scenario: Calling recentposts endpoint
    # Calling recentPosts endpoint with a starting date
    Given path 'recentposts'
    And header token = auth_token
    When method post
    Then status 200
    * match each response..['access_key'] == '#notpresent'
    * match each response..['_id'] == '#notpresent'

  # Test for GET '/user' endpoint
  Scenario: Test for get user endpoint
    # Call create user endpoint
    Given path 'user'
    And header token = auth_token
    And request read('../data/user.json')
    When method post
    Then status 201
    * def author_id = response.user._id

    # Call get user endpoint
    Given path 'user/' + author_id
    And header token = auth_token
    When method get
    Then status 200
    * match response._id == '#notpresent'

    # Call delete user endpoint
    Given path 'user/' + author_id
    And header token = auth_token
    When method delete
    Then status 200
    And match response.message == 'User Deleted Successfully'
