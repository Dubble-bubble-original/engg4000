Feature: Delete user post endpoint tests

  Background:
    * url baseUrl
    * def auth = callonce read('classpath:utils/authentication.feature')
    * def baseImageURl = 'https://senior-design-img-bucket.s3.amazonaws.com/'
    * def auth_token = auth.response.token

  Scenario: Try to delete a user post with no auth token
    # Call delete user post endpoint with no auth token header
    Given path 'userpost/12345'
    And request {}
    When method delete
    Then status 401
    And match response.message == 'No Authentication Token Provided'

  Scenario: Try to delete a user post with invalid auth token
    # Call delete user post endpoint with invalid auth token header
    Given path 'userpost/12345'
    And header token = '12345'
    And request {}
    When method delete
    Then status 401
    And match response.message == 'Invalid Authentication Token Provided'

  Scenario: Try to delete a nonexistent user post
    # Call delete user post endpoint with valid id that doesn't exist
    Given path 'userpost/507f1f77bcf86cd799439011'
    And header token = auth_token
    And request {}
    When method delete
    Then status 404
    And match response.message == 'User Post Not Found'

  Scenario: Try to delete a user post with invalid id
    # Call create user post endpoint with empty body
    Given path 'userpost'
    And header token = auth_token
    And request read('../data/userPost.json')
    When method post
    Then status 201
    * def post_id = response.post._id

    # Call delete user post endpoint with invalid access key
    Given path 'userpost/12345'
    And header token = auth_token
    When method delete
    Then status 400
    And match response.message == 'Invalid User Post ID'

    # Call delete user post endpoint
    Given path 'userpost/' + post_id
    And header token = auth_token
    When method delete
    Then status 200
    And match response.message == 'User Post Deleted Successfully'

  # TESTS FOR (EXPOSED) DELETE POST ENDPOINT

  Scenario: Try to delete post with no auth token provided
    Given path 'post/123'
    When method delete
    Then status 401
    And match response.message == 'No Authentication Token Provided'

  Scenario: Try to delete post with an invalid auth token
    Given path 'post/123'
    And header token = 'Invalid_Token'
    When method delete
    Then status 401
    And match response.message == 'Invalid Authentication Token Provided'

  Scenario: Try to delete post with an invalid post id
    Given path 'post/123'
    And header token = auth_token
    When method delete
    Then status 400
    And match response.message == 'Invalid Post ID Provided'

  Scenario: Try to delete post with an unused post id
    Given path 'post/123123123123'
    And header token = auth_token
    When method delete
    Then status 404
    And match response.message == 'User Post Not Found'

  Scenario: Try to delete post with a valid post id and an unused/invalid user id
    # Creating a temporary post
    Given path 'userpost'
    And header token = auth_token
    * def postData = read('../data/userPost.json')
    * set postData.author = 123123123123
    And request postData
    When method post
    Then status 201
    * def post_id = response.post._id

    Given path 'post/' + post_id
    And header token = auth_token
    When method delete
    Then status 200
    And match response.status.user == 'No User Provided'
    And match response.post._id == post_id

  Scenario: Try to delete a post with no avatar and post image
    # Creating a temporary user
    Given path 'user'
    And header token = auth_token
    And request read('../data/user_userPost_missingImages.json').user
    When method post
    Then status 201
    * def author_id = response.user._id

    # Creating a temporary post
    Given path 'userpost'
    And header token = auth_token
    * def postData = read('../data/user_userPost_missingImages.json').post
    * set postData.author = author_id
    And request postData
    When method post
    Then status 201
    * def post_id = response.post._id

    Given path 'post/' + post_id
    And header token = auth_token
    When method delete
    Then status 200
    And match response.status.message == 'Post Deleted Successfully'
    And match response.post._id == post_id
    And match response.post.author._id == author_id

  Scenario: Try to delete a post with an invalid avatar and post image
    # Creating a temporary user
    Given path 'user'
    And header token = auth_token
    And request read('../data/user.json')
    When method post
    Then status 201
    * def author_id = response.user._id

    # Creating a temporary post
    Given path 'userpost'
    And header token = auth_token
    * def postData =  read('../data/userPost.json')
    * set postData.author = author_id
    And request postData
    When method post
    Then status 201
    * def post_id = response.post._id

    Given path 'post/' + post_id
    And header token = auth_token
    When method delete
    Then status 200
    And match response.status.avatar == 'Avatar Image Not Found'
    And match response.status.postImg == 'Post Image Not Found'

  Scenario: Try to delete a full user post
    # Creating avatar and post image
    Given path 'postimages'
    And header token = auth_token
    And multipart file avatar = { read: '../data/img_avatar.png', filename: 'avatar_image', contentType: 'multipart/form-data' }
    And multipart file picture = { read: '../data/post_image.jpeg', filename: 'post_image', contentType: 'multipart/form-data' }
    When method post
    Then status 201
    * def avatarId = response.avatarId
    * def pictureId = response.pictureId

    # Creating a temporary post with a user
    Given path 'post'
    And header token = auth_token
    * def postData = read('../data/user_userPost.json')
    * set postData.avatarId = avatarId
    * set postData.pictureId = pictureId
    And request postData
    When method post
    Then status 201
    * def post_id = response.post._id
    * def author_id = response.post.author._id

    # Successfully Delete the created post
    Given path 'post/' + post_id
    And header token = auth_token
    When method delete
    Then status 200
    And match response.status.message == 'Post Deleted Successfully'
    And match response.post._id == post_id
    And match response.post.author._id == author_id
