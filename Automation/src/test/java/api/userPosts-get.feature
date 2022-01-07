Feature: Get user post endpoints tests

  Background:
    * url baseUrl
    * def auth = callonce read('classpath:utils/authentication.feature')
    * def auth_token = auth.response.token

  # Get user posts

  Scenario: Try to get a user post with no auth token
    # Call get user post endpoint with no auth token header
    Given path 'userpost/12345'
    When method get
    Then status 401
    And match response.message == 'No Authentication Token Provided'

  Scenario: Try to get a user post with invalid auth token
    # Call get user post endpoint with invalid auth token header
    Given path 'userpost/12345'
    And header token = '12345'
    When method get
    Then status 401
    And match response.message == 'Invalid Authentication Token Provided'

  Scenario: Try to get a user post with invalid id
    # Call get user post endpoint with invalid user post id
    Given path 'userpost/12345'
    And header token = auth_token
    When method get
    Then status 400
    And match response.message == 'Invalid User Post ID'

  Scenario: Try to get a nonexistent user post
    # Call get user post endpoint with nonexistent user post id
    Given path 'userpost/53cb6b9b4f4ddef1ad47f943'
    And header token = auth_token
    When method get
    Then status 404
    And match response.message == 'User Post Not Found'

  # POST userposts endpoint

  Scenario: Try to get posts with no auth token provided
    Given path 'userposts'
    When method post
    Then status 401
    And match response.message == 'No Authentication Token Provided'

  Scenario: Try to get posts with an invalid auth token
    Given path 'userposts'
    And header token = 'Invalid_Token'
    When method post
    Then status 401
    And match response.message == 'Invalid Authentication Token Provided'

  Scenario: Calling userposts endpoint
    # Creating Temporary User Posts

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

    # Call userPosts with no filters

    Given path 'userposts'
    And header token = auth_token
    When method post
    Then status 400
    And match response.message == 'No Request Body Provided'

    # Call userPosts endpoint with title as filter

    Given path 'userposts'
    And header token = auth_token
    And request { title: "Ferrari" }
    When method post
    Then status 200
    And match each response contains { title: "Ferrari" }

    # Call userPosts endpoint with an unused title as filter

    Given path 'userposts'
    And header token = auth_token
    And request { title: "Unused Title" }
    When method post
    Then status 200
    And match response == '#[0]'

    # Call usePosts endpoint with empty tag as filter

    Given path 'userposts'
    And header token = auth_token
    And request { tags: [] }
    When method post
    Then status 400
    And match response.message == 'Invalid search filters provided'

    # Call userPosts endpoint with a valid tag as filter

    Given path 'userposts'
    And header token = auth_token
    And request { tags: ["Test Tag 1"] }
    When method post
    Then status 200
    And match response[*].tags[*] contains "Test Tag 1"

    # Call userPosts endpoint with a unused tag as filter

    Given path 'userposts'
    And header token = auth_token
    And request { tags: ["Unused Tag"] }
    When method post
    Then status 200
    And match response == '#[0]'

    # Call userPosts endpoint with multiple tags as filter

    Given path 'userposts'
    And header token = auth_token
    And request { tags: ["Two Seater", "Ferrari"] }
    When method post
    Then status 200
    And match response[*].tags[*] contains "Ferrari"
    And match response[*].tags[*] contains "Two Seater"

    # Call userposts endpoint with tags and title as search filters

    Given path 'userposts'
    And header token = auth_token
    And request { tags: ["Red-Gray"], title: "Ferrari" }
    When method post
    Then status 200
    And match response[*].tags[*] contains "Red-Gray"
    And match each response contains { title: "Ferrari" }

    # Call userposts endpoint with an invalid filter

    Given path 'userposts'
    And header token = auth_token
    And request { authorID: "1234" }
    When method post
    Then status 400
    And match response.message == 'Invalid search filters provided'

    # Delete Added Posts

    Given path 'userpost/' + post1_access_key
    And header token = auth_token
    When method delete
    Then status 200
    And match response.message == 'User Post Deleted Successfully'

    Given path 'userpost/' + post2_access_key
    And header token = auth_token
    When method delete
    Then status 200
    And match response.message == 'User Post Deleted Successfully'

    Given path 'userpost/' + post3_access_key
    And header token = auth_token
    When method delete
    Then status 200
    And match response.message == 'User Post Deleted Successfully'

    Given path 'userpost/' + post4_access_key
    And header token = auth_token
    When method delete
    Then status 200
    And match response.message == 'User Post Deleted Successfully'
