Feature: Delete post endpoint tests

  Background:
    * url baseUrl
    * def baseImageURl = 'https://senior-design-img-bucket.s3.amazonaws.com/'
    * def auth = callonce read('classpath:utils/authentication.feature')
    * def post = callonce read('classpath:utils/createPost.feature')
    * def auth_token = auth.response.token
    * def postID = post.response.post._id
    * def authorID = post.response.post.author._id

  Scenario: Try to delete post with no auth token provided
    Given path 'deletepost/' + postID
    When method delete
    Then status 401
    And match response.message == 'No Authentication Token Provided'

  Scenario: Try to delete post with an invalid auth token
    Given path 'deletepost/' + postID
    And header token = 'Invalid_Token'
    When method delete
    Then status 401
    And match response.message == 'Invalid Authentication Token Provided'

  Scenario: Try to delete post with an invalid post id
    Given path 'deletepost/123'
    And header token = auth_token
    When method delete
    Then status 400
    And match response.message == 'Invalid Post ID Provided'

  Scenario: Try to delete post with an unused post id
    Given path 'deletepost/123123123123'
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
    And print postData
    When method post
    Then status 201
    * def post_id = response.post._id

    Given path 'deletepost/' + post_id
    And header token = auth_token
    When method delete
    Then status 201
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

    Given path 'deletepost/' + post_id
    And header token = auth_token
    When method delete
    Then status 201
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

    Given path 'deletepost/' + post_id
    And header token = auth_token
    When method delete
    Then status 201
    And match response.status.avatar == 'Avatar Image Not Found'
    And match response.status.postImg == 'Post Image Not Found'

  Scenario: Try to fully delete the post
    Given path 'deletepost/' + postID
    And header token = auth_token
    When method delete
    Then status 201
    And match response.status.message == 'Post Deleted Successfully'
    And match response.post._id == postID
    And match response.post.author._id == authorID