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
    Given path 'userpost/' + post_id
    And header token = auth_token
    When method get
    Then status 200
    And match response._id == post_id

    # Call update user post endpoint
    Given path 'userpost/' + post_id
    And header token = auth_token
    And request { update: { title: 'new title' } }
    When method patch
    Then status 200
    And match response.title == 'new title'

    # Call delete user post endpoint
    Given path 'userpost/' + post_access_key
    And header token = auth_token
    When method delete
    Then status 200
    And match response.message == 'User Post Deleted Successfully'

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
    And match response.message == 'Missing Images'

  Scenario: Try to upload avatar and post picture with missing picture
    # Call post images endpoint with missing image
    Given path 'postimages'
    And header token = auth_token
    And multipart file avatar = { read: '../data/nota-logo.jpg', filename: 'nota-logo.jpg', contentType: 'multipart/form-data' }
    When method post
    Then status 400
    And match response.message == 'Missing Images'

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

  Scenario: Try to create a user and user post with missing picture id
    # Call create user post endpoint with missing picture id
    Given path 'post'
    And header token = auth_token
    And request read('../data/user_userPost_missingPictureId.json')
    When method post
    Then status 400
    And match response.message == 'Missing Image IDs'

  Scenario: Try to create a user and user post
    # Call create user post endpoint
    Given path 'post'
    And header token = auth_token
    And request read('../data/user_userPost.json')
    When method post
    Then status 201
    * def post_id = response.post._id
    * def post_access_key = response.post.access_key
    * def user_id = response.post.author._id

    # Call delete user post endpoint
    Given path 'userpost/' + post_access_key
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
