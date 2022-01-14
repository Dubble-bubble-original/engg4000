Feature: User post endpoints tests

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
    And match response.message == 'No Authentication Token Provided'

  Scenario: Try to create a user post with invalid auth token
    # Call create user post endpoint with invalid auth token header
    Given path 'userpost'
    And header token = '12345'
    When method post
    Then status 401
    And match response.message == 'Invalid Authentication Token Provided'

  Scenario: Try to create a user post with empty request body
    # Call create user post endpoint with empty body
    Given path 'userpost'
    And header token = auth_token
    When method post
    Then status 400
    And match response.message == 'No Request Body Provided'

  Scenario: Try to create a user post with missing required field
    # Call create user post endpoint with missing required field
    Given path 'userpost'
    And header token = auth_token
    And request read('../data/userPost_missingTittle.json')
    When method post
    Then status 400
    And match response.message == 'Invalid Request Body Format'

  # Create, get, update, delete user post

  Scenario: Create, get, update, and delete a userPost
    # Call create user post endpoint
    Given path 'userpost'
    And header token = auth_token
    And request read('../data/userPost.json')
    When method post
    Then status 201
    * def post_id = response.post._id
    * def post_access_key = response.post.access_key

    # Call get user post endpoint
    Given path 'userpost/' + post_access_key
    And header token = auth_token
    When method get
    Then status 200
    And match response.access_key == post_access_key
    And match response._id == post_id
    # TODO: update this with DBO-55
    # And match response.author._id == '618981693b4ab71971e9f73e'
    # And match response.author.name == 'Goblin'

    # Call update user post endpoint
    Given path 'userpost/' + post_id
    And header token = auth_token
    And request { update: { title: 'new title' } }
    When method patch
    Then status 200
    And match response.title == 'new title'
    # TODO: update this with DBO-55
    # And match response.author._id == '618981693b4ab71971e9f73e'
    # And match response.author.name == 'Goblin'

    # Call delete user post endpoint
    Given path 'userpost/' + post_id
    And header token = auth_token
    When method delete
    Then status 200
    And match response.message == 'User Post Deleted Successfully'

  # Search userposts

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
    # Load post data
    * def post1_data = read('../data/filter_userPosts_data.json').post1
    * def post2_data = read('../data/filter_userPosts_data.json').post2
    * def post3_data = read('../data/filter_userPosts_data.json').post3
    * def post4_data = read('../data/filter_userPosts_data.json').post4

    # Creating Temporary User Posts
    * def post1 = call read('classpath:utils/global_user_post.feature') { data: '#(post1_data)' }
    * def post2 = call read('classpath:utils/global_user_post.feature') { data: '#(post2_data)' }
    * def post3 = call read('classpath:utils/global_user_post.feature') { data: '#(post3_data)' }
    * def post4 = call read('classpath:utils/global_user_post.feature') { data: '#(post4_data)' }

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
    And match response[*].author.name contains post2.response.post.author.name
    And match response[*].author.name contains post4.response.post.author.name

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
    And match response[*].author.name contains post1.response.post.author.name
    And match response[*].author.name contains post3.response.post.author.name

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
    And match response[*].author.name contains post1.response.post.author.name
    And match response[*].author.name contains post2.response.post.author.name
    And match response[*].author.name contains post4.response.post.author.name

    # Call userposts endpoint with tags and title as search filters
    Given path 'userposts'
    And header token = auth_token
    And request { tags: ["Red-Gray"], title: "Ferrari" }
    When method post
    Then status 200
    And match response[*].tags[*] contains "Red-Gray"
    And match each response contains { title: "Ferrari" }
    And match response[*].author.name contains post4.response.post.author.name

    # Call userposts endpoint with an invalid filter
    Given path 'userposts'
    And header token = auth_token
    And request { authorID: "1234" }
    When method post
    Then status 400
    And match response.message == 'Invalid search filters provided'

    # CALL THE CLEANUP FEATURE TO DELETE POSTS
    * call read('classpath:utils/cleanup.feature') { post_id: '#(post1.response.post._id)' }
    * call read('classpath:utils/cleanup.feature') { post_id: '#(post2.response.post._id)' }
    * call read('classpath:utils/cleanup.feature') { post_id: '#(post3.response.post._id)' }
    * call read('classpath:utils/cleanup.feature') { post_id: '#(post4.response.post._id)' }

  # Exposed Create user posts

  Scenario: Try to upload avatar and post picture with no auth token
    # Call post images endpoint with no auth token header
    Given path 'postimages'
    When method post
    Then status 401
    And match response.message == 'No Authentication Token Provided'

  Scenario: Try to upload avatar and post picture with invalid auth token
    # Call post images endpoint with invalid auth token header
    Given path 'postimages'
    And header token = '12345'
    When method post
    Then status 401
    And match response.message == 'Invalid Authentication Token Provided'

  Scenario: Try to upload avatar and post picture with empty request body
    # Call post images endpoint with empty body
    Given path 'postimages'
    And header token = auth_token
    When method post
    Then status 400
    And match response.message == 'No Images Provided'

  Scenario: Try to upload avatar only
    # Call post images endpoint with avatar only
    Given path 'postimages'
    And header token = auth_token
    And multipart file avatar = { read: '../data/nota-logo.jpg', filename: 'nota-logo.jpg', contentType: 'multipart/form-data' }
    When method post
    Then status 201
    * def avatarId = response.avatarId

    # Call delete image endpoint to delete avatar
    Given path 'image/' + avatarId
    And header token = auth_token
    When method delete
    Then status 200
    And match response.message == 'Image Deleted Successfully'

  Scenario: Try to upload post picture only
    # Call post images endpoint with post picture only
    Given path 'postimages'
    And header token = auth_token
    And multipart file picture = { read: '../data/nota-logo.jpg', filename: 'nota-logo.jpg', contentType: 'multipart/form-data' }
    When method post
    Then status 201
    * def pictureId = response.pictureId

    # Call delete image endpoint to delete post picture
    Given path 'image/' + pictureId
    And header token = auth_token
    When method delete
    Then status 200
    And match response.message == 'Image Deleted Successfully'

  Scenario: Try to upload avatar and post picture
    # Call post images endpoint
    Given path 'postimages'
    And header token = auth_token
    And multipart file avatar = { read: '../data/nota-logo.jpg', filename: 'nota-logo1.jpg', contentType: 'multipart/form-data' }
    And multipart file picture = { read: '../data/nota-logo.jpg', filename: 'nota-logo2.jpg', contentType: 'multipart/form-data' }
    When method post
    Then status 201
    * def avatarId = response.avatarId
    * def pictureId = response.pictureId

    # Call delete image endpoint to delete avatar
    Given path 'image/' + avatarId
    And header token = auth_token
    When method delete
    Then status 200
    And match response.message == 'Image Deleted Successfully'

    # Call delete image endpoint to delete post picture
    Given path 'image/' + pictureId
    And header token = auth_token
    When method delete
    Then status 200
    And match response.message == 'Image Deleted Successfully'

  Scenario: Try to create a user and user post with no auth token
    # Call create user post endpoint with no auth token header
    Given path 'post'
    When method post
    Then status 401
    And match response.message == 'No Authentication Token Provided'

  Scenario: Try to create a user and user post with invalid auth token
    # Call create user post endpoint with invalid auth token header
    Given path 'post'
    And header token = '12345'
    When method post
    Then status 401
    And match response.message == 'Invalid Authentication Token Provided'

  Scenario: Try to create a user and user post with empty request body
    # Call create user post endpoint with empty body
    Given path 'post'
    And header token = auth_token
    When method post
    Then status 400
    And match response.message == 'No Request Body Provided'

  Scenario: Try to create a user and user post with missing user
    # Call create user post endpoint with missing user
    Given path 'post'
    And header token = auth_token
    And request read('../data/user_userPost_missingUser.json')
    When method post
    Then status 400
    And match response.message == 'Missing User'

  Scenario: Try to create a user and user post with missing user post
    # Call create user post endpoint with missing user post
    Given path 'post'
    And header token = auth_token
    And request read('../data/user_userPost_missingUserPost.json')
    When method post
    Then status 400
    And match response.message == 'Missing User Post'

  Scenario: Try to create a user and user post with only an avatar
    # Call create user post endpoint
    Given path 'post'
    And header token = auth_token
    And request read('../data/user_userPost_missingPictureId.json')
    When method post
    Then status 201
    * match response.post !contains { img_url: '#notnull' }
    * def post_id = response.post._id
    * def user_id = response.post.author._id

    # Call delete user post endpoint
    Given path 'userpost/' + post_id
    And header token = auth_token
    When method delete
    Then status 200
    And match response.message == 'User Post Deleted Successfully'

    # Call delete user endpoint
    Given path 'user/' + user_id
    And header token = auth_token
    When method delete
    Then status 200
    And match response.message == 'User Deleted Successfully'

  Scenario: Try to create a user and user post with only a post picture
    # Call create user post endpoint
    Given path 'post'
    And header token = auth_token
    And request read('../data/user_userPost_missingAvatarId.json')
    When method post
    Then status 201
    * match response.post.author !contains { avatar_url: '#notnull' }
    * def post_id = response.post._id
    * def user_id = response.post.author._id

    # Call delete user post endpoint
    Given path 'userpost/' + post_id
    And header token = auth_token
    When method delete
    Then status 200
    And match response.message == 'User Post Deleted Successfully'

    # Call delete user endpoint
    Given path 'user/' + user_id
    And header token = auth_token
    When method delete
    Then status 200
    And match response.message == 'User Deleted Successfully'

  Scenario: Try to create a user and user post with both an avatar and post picture
    # Call create user post endpoint
    Given path 'post'
    And header token = auth_token
    And request read('../data/user_userPost.json')
    When method post
    Then status 201
    * def post_id = response.post._id
    * def user_id = response.post.author._id

    # Call delete user post endpoint
    Given path 'userpost/' + post_id
    And header token = auth_token
    When method delete
    Then status 200
    And match response.message == 'User Post Deleted Successfully'

    # Call delete user endpoint
    Given path 'user/' + user_id
    And header token = auth_token
    When method delete
    Then status 200
    And match response.message == 'User Deleted Successfully'
