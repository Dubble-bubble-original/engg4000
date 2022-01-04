Feature: User post endpoints tests

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
    And match response contains 'No Authentication Token Provided'

  Scenario: Try to get posts with an invalid auth token
    Given path 'recentposts'
    And header token = 'Invalid_Token'
    When method post
    Then status 401
    And match response contains 'Invalid Authentication Token Provided'

  Scenario: Calling recentposts endpoint
    # Creating 2 Temporary User Posts

    Given path 'userpost'
    And header token = auth_token
    And request read('../data/filter_userPosts_data.json').post1
    When method post
    Then status 201
    * def post1_access_key = response.post.access_key

    Given path 'userpost'
    And header token = auth_token
    And request read('../data/filter_userPosts_data.json').post2
    When method post
    Then status 201
    * def post2_access_key = response.post.access_key

    # Calling recentPosts endpoint (with two new added posts)

    Given path 'recentposts'
    And header token = auth_token
    When method post
    Then status 200
    * def before = $response[*].date_created
    * copy after = before
    * Collections.sort(after, Collections.reverseOrder())
    Then match before == after
    * def totalPosts = response.length

    # Creating 2 more Temporary User Posts

    Given path 'userpost'
    And header token = auth_token
    And request read('../data/filter_userPosts_data.json').post3
    When method post
    Then status 201
    * def post3_access_key = response.post.access_key

    Given path 'userpost'
    And header token = auth_token
    And request read('../data/filter_userPosts_data.json').post4
    When method post
    Then status 201
    * def post4_access_key = response.post.access_key

    # Calling recentPosts endpoint (with two more posts added)

    Given path 'recentposts'
    And header token = auth_token
    When method post
    Then status 200
    Then assert response.length >= totalPosts
    * def before = $response[*].date_created
    * copy after = before
    * Collections.sort(after, Collections.reverseOrder())
    Then match before == after

    # Delete Added Posts

    Given path 'userpost/' + post1_access_key
    And header token = auth_token
    When method delete
    Then status 200

    Given path 'userpost/' + post2_access_key
    And header token = auth_token
    When method delete
    Then status 200

    Given path 'userpost/' + post3_access_key
    And header token = auth_token
    When method delete
    Then status 200

    Given path 'userpost/' + post4_access_key
    And header token = auth_token
    When method delete
    Then status 200