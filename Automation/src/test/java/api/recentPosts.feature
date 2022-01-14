Feature: Recent Posts endpoint tests

  Background:
    * url baseUrl
    * def auth = callonce read('classpath:utils/authentication.feature')
    * def auth_token = auth.response.token
    * def Collections = Java.type('java.util.Collections')
    # Load post data
    * def post1_data = read('../data/filter_userPosts_data.json').post1
    * def post2_data = read('../data/filter_userPosts_data.json').post2
    * def post3_data = read('../data/filter_userPosts_data.json').post3
    * def post4_data = read('../data/filter_userPosts_data.json').post4

  # Test Cases for POST recentposts endpoint

  Scenario: Try to get posts with no auth token provided
    Given path 'recentposts'
    When method post
    Then status 401
    And match response.message contains 'No Authentication Token Provided'

  Scenario: Try to get posts with an invalid auth token
    Given path 'recentposts'
    And header token = 'Invalid_Token'
    When method post
    Then status 401
    And match response.message contains 'Invalid Authentication Token Provided'

  Scenario: Calling recentposts endpoint with no starting date
    # Create two temp post
    * def post1 = call read('classpath:utils/global_user_post.feature') { data: '#(post1_data)' }
    * def post2 = call read('classpath:utils/global_user_post.feature') { data: '#(post2_data)' }

    # Calling recentPosts endpoint (with two new added posts)
    Given path 'recentposts'
    And header token = auth_token
    When method post
    Then status 200
    * def before = $response[*].date_created
    * copy after = before
    * Collections.sort(after, Collections.reverseOrder())
    And match before == after
    And match response[*].title contains post1.response.post.title
    And match response[*].title contains post2.response.post.title
    And match response[*].author.name contains post1.response.post.author.name
    And match response[*].author.name contains post2.response.post.author.name
    * def totalPosts = response.length

    # Creating 2 more Temporary User Posts
    * def post3 = call read('classpath:utils/global_user_post.feature') { data: '#(post3_data)' }
    * def post4 = call read('classpath:utils/global_user_post.feature') { data: '#(post4_data)' }

    # Calling recentPosts endpoint (with two more posts added)
    Given path 'recentposts'
    And header token = auth_token
    When method post
    Then status 200
    And assert response.length >= totalPosts
    * def before = $response[*].date_created
    * copy after = before
    * Collections.sort(after, Collections.reverseOrder())
    And match before == after
    And match response[*].title contains post3.response.post.title
    And match response[*].title contains post4.response.post.title
    And match response[*].author.name contains post3.response.post.author.name
    And match response[*].author.name contains post4.response.post.author.name

    # CALL THE CLEANUP FEATURE TO DELETE POSTS
    * call read('classpath:utils/cleanup.feature') { post_id: '#(post1.response.post._id)' }
    * call read('classpath:utils/cleanup.feature') { post_id: '#(post2.response.post._id)' }
    * call read('classpath:utils/cleanup.feature') { post_id: '#(post3.response.post._id)' }
    * call read('classpath:utils/cleanup.feature') { post_id: '#(post4.response.post._id)' }

  Scenario: Calling recentposts endpoint with starting date
    # Create two temp post
    * def post1 = call read('classpath:utils/global_user_post.feature') { data: '#(post1_data)' }
    * def post2 = call read('classpath:utils/global_user_post.feature') { data: '#(post2_data)' }

    # Calling recentPosts endpoint with a starting date

    Given path 'recentposts'
    And header token = auth_token
    And request { date: '#(post2.response.post.date_created)' }
    When method post
    Then status 200
    * def before = $response[*].date_created
    * copy after = before
    * Collections.sort(after, Collections.reverseOrder())
    And match before == after
    * def result = true
    * def checkOrder = function(post) { if(post.date_created >= post2.response.post.date_created) { result = false } }
    * karate.forEach(response, checkOrder)
    And assert result
    And match response[*].title contains post1.response.post.title
    And match response[*] !contains post2.response.post
    And match response[*].author.name contains post1.response.post.author.name

    # CALL THE CLEANUP FEATURE TO DELETE POSTS
    * call read('classpath:utils/cleanup.feature') { post_id: '#(post1.response.post._id)' }
    * call read('classpath:utils/cleanup.feature') { post_id: '#(post2.response.post._id)' }