Feature: Recent Posts endpoint tests

  Background:
    * url baseUrl
    * def auth = callonce read('classpath:utils/authentication.feature')
    * def auth_token = auth.response.token
    * def Collections = Java.type('java.util.Collections')
    # Load post data
    * def post = read('../data/filter_userPosts_data.json')

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
    * def post1 = call read('classpath:utils/createPost.feature') { data: '#(post.post1)' }
    * def post2 = call read('classpath:utils/createPost.feature') { data: '#(post.post2)' }

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
    * def post3 = call read('classpath:utils/createPost.feature') { data: '#(post.post3)' }
    * def post4 = call read('classpath:utils/createPost.feature') { data: '#(post.post4)' }

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

    # CALL THE CLEANUP FEATURE
    * call read('classpath:utils/deletePost.feature') { access_key: '#(post1.response.post.access_key)' }
    * call read('classpath:utils/deletePost.feature') { access_key: '#(post2.response.post.access_key)' }
    * call read('classpath:utils/deletePost.feature') { access_key: '#(post3.response.post.access_key)' }
    * call read('classpath:utils/deletePost.feature') { access_key: '#(post4.response.post.access_key)' }

  Scenario: Calling recentposts endpoint with starting date
    # Create two temp post
    * def post1 = call read('classpath:utils/createPost.feature') { data: '#(post.post1)' }
    * def post2 = call read('classpath:utils/createPost.feature') { data: '#(post.post2)' }

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

    # CALL THE CLEANUP FEATURE
    * call read('classpath:utils/deletePost.feature') { access_key: '#(post1.response.post.access_key)' }
    * call read('classpath:utils/deletePost.feature') { access_key: '#(post2.response.post.access_key)' }