Feature: Recent Posts endpoint tests

  Background:
    * url baseUrl
    * def auth = callonce read('classpath:utils/authentication.feature')
    * def auth_token = auth.response.token
    * def Collections = Java.type('java.util.Collections')

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
    # Creating 2 Temporary User Posts

    Given path 'userpost'
    And header token = auth_token
    And request read('../data/filter_userPosts_data.json').post1
    When method post
    Then status 201
    * def post1_access_key = response.post.access_key
    * def post1_id = response.post._id

    Given path 'userpost'
    And header token = auth_token
    And request read('../data/filter_userPosts_data.json').post2
    When method post
    Then status 201
    * def post2_access_key = response.post.access_key
    * def post2_id = response.post._id

    # Calling recentPosts endpoint (with two new added posts)

    Given path 'recentposts'
    And header token = auth_token
    When method post
    Then status 200
    * def before = $response[*].date_created
    * copy after = before
    * Collections.sort(after, Collections.reverseOrder())
    And match before == after
    And match response[*]._id contains post1_id
    And match response[*]._id contains post2_id
    And match response[*].author._id contains '6189828380b43f0744d0a035'
    And match response[*].author.name contains 'Ghoul'
    * def totalPosts = response.length

    # Creating 2 more Temporary User Posts

    Given path 'userpost'
    And header token = auth_token
    And request read('../data/filter_userPosts_data.json').post3
    When method post
    Then status 201
    * def post3_access_key = response.post.access_key
    * def post3_id = response.post._id

    Given path 'userpost'
    And header token = auth_token
    And request read('../data/filter_userPosts_data.json').post4
    When method post
    Then status 201
    * def post4_access_key = response.post.access_key
    * def post4_id = response.post._id

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
    And match response[*]._id contains post3_id
    And match response[*]._id contains post4_id
    And match response[*].author._id contains '6189828380b43f0744d0a035'
    And match response[*].author.name contains 'Ghoul'

    # Delete Added Posts

    Given path 'userpost/' + post1_id
    And header token = auth_token
    When method delete
    Then status 200

    Given path 'userpost/' + post2_id
    And header token = auth_token
    When method delete
    Then status 200

    Given path 'userpost/' + post3_id
    And header token = auth_token
    When method delete
    Then status 200

    Given path 'userpost/' + post4_id
    And header token = auth_token
    When method delete
    Then status 200

  Scenario: Calling recentposts endpoint with starting date
    # Creating 2 Temporary User Post

    Given path 'userpost'
    And header token = auth_token
    And request read('../data/filter_userPosts_data.json').post1
    When method post
    Then status 201
    * def post1_access_key = response.post.access_key
    * def post1_id = response.post._id

    Given path 'userpost'
    And header token = auth_token
    And request read('../data/filter_userPosts_data.json').post2
    When method post
    Then status 201
    * def post2_access_key = response.post.access_key
    * def post2_id = response.post._id
    * def post2_date = response.post.date_created

    # Calling recentPosts endpoint with a starting date

    Given path 'recentposts'
    And header token = auth_token
    And request { date: '#(post2_date)' }
    When method post
    Then status 200
    * def before = $response[*].date_created
    * copy after = before
    * Collections.sort(after, Collections.reverseOrder())
    And match before == after
    * def result = true
    * def checkOrder = function(post) { if(post.date_created >= post2_date) { result = false } }
    * karate.forEach(response, checkOrder)
    And assert result
    And match response[*]._id contains post1_id
    And match response[*]._id !contains post2_id
    And match response[*].author._id contains '6189828380b43f0744d0a035'
    And match response[*].author.name contains 'Ghoul'

    # Delete Added Posts

    Given path 'userpost/' + post1_id
    And header token = auth_token
    When method delete
    Then status 200

    Given path 'userpost/' + post2_id
    And header token = auth_token
    When method delete
    Then status 200