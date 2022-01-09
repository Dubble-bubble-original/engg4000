Feature: Delete post endpoint tests

  Background:
    * url baseUrl
    * def baseImageURl = 'https://senior-design-img-bucket.s3.amazonaws.com/'
    * def auth = callonce read('classpath:utils/authentication.feature')
    * def auth_token = auth.response.token

  Scenario: Try to delete post with no auth token provided
    Given path 'deletepost'
    When method delete
    Then status 401
    And match response.message == 'No Authentication Token Provided'

  Scenario: Try to delete post with an invalid auth token
    Given path 'deletepost'
    And header token = 'Invalid_Token'
    When method delete
    Then status 401
    And match response.message == 'Invalid Authentication Token Provided'

  Scenario: Try to delete post with no request body provided
    Given path 'deletepost'
    And header token = auth_token
    When method delete
    Then status 400
    And match response.message == 'No Request Body Provided'

  Scenario: Try to delete post with a valid post id and an invalid user id
    Given path 'deletepost'
    And header token = auth_token
    And request { postId: postId, authorId: '123' }
    When method delete
    Then status 400
    And match response.message == 'Invalid ID Provided'

  Scenario: Try to delete post with a invalid post id and an valid user id
    Given path 'deletepost'
    And header token = auth_token
    And request { postId: '123', authorId: author_ID }
    When method delete
    Then status 400
    And match response.message == 'Invalid ID Provided'

  Scenario: Try to delete a post with a valid post id and an unused user id
    # Create a temp post
    Given path 'userpost'
    And header token = auth_token
    And request read('../data/userPost.json')
    When method post
    Then status 201
    * def postId = response.post._id

    # Call the delete post endpoint
    Given path 'deletepost'
    And header token = auth_token
    And request { postId: '#(postId)', authorId: '123123123123' }
    When method delete
    Then status 404
    And match response.message == 'Post deleted without User'
    And match response.post._id == postId

  Scenario: Try to delete a post with a valid user id and an unused post id
    # Creating a temporary user
    Given path 'user'
    And header token = auth_token
    And request  read('../data/user.json')
    When method post
    Then status 201
    * def authorId = response.user._id

    # Call the delete post endpoint
    Given path 'deletepost'
    And header token = auth_token
    And request { postId: '123123123123', authorId: '#(authorId)' }
    When method delete
    Then status 404
    And match response.message == 'User deleted without Post'
    And match response.user._id == authorId

  Scenario: Try to delete a post with a valid user and post id
    # Creating a temporary user
    Given path 'user'
    And header token = auth_token
    And request read('../data/user.json')
    When method post
    Then status 201
    * def author_ID = response.user._id

    # Creating a temporary post
    Given path 'userpost'
    And header token = auth_token
    * def postData = read('../data/userPost.json')
    * set postData.author_ID = author_ID
    And request postData
    When method post
    Then status 201
    * def post_ID = response.post._id

    # Delete the created post and user
    Given path 'deletepost'
    And header token = auth_token
    And request { postId: '#(post_ID)', authorId: '#(author_ID)' }
    When method delete
    Then status 200
    And match response.post._id == post_ID
    And match response.user._id == author_ID

  Scenario: Try to delete post with an invalid post id
    Given path 'deletepost'
    And header token = auth_token
    And request { postId: '1234' }
    When method delete
    Then status 400
    And match response.message == 'Invalid Post ID'

  Scenario: Try to delete post with an unused post id
    Given path 'deletepost'
    And header token = auth_token
    And request { postId: '123123123123' }
    When method delete
    Then status 404
    And match response.message == 'User Post Not Found'

  Scenario: Try to delete post with a valid post id
    # Create a temp post
    Given path 'userpost'
    And header token = auth_token
    And request read('../data/userPost.json')
    When method post
    Then status 201
    * def postId = response.post._id

    # Delete the created temp post
    Given path 'deletepost'
    And header token = auth_token
    And request { postId: '#(postId)' }
    When method delete
    Then status 200
    And match response._id == postId

  Scenario: Try to delete post with an invalid user id
    Given path 'deletepost'
    And header token = auth_token
    And request { authorId: '1234' }
    When method delete
    Then status 400
    And match response.message == 'Invalid Author ID'

  Scenario: Try to delete post with an unused post id
    Given path 'deletepost'
    And header token = auth_token
    And request { authorId: '123123123123' }
    When method delete
    Then status 404
    And match response.message == 'User Not Found'

  Scenario: Try to delete post with a valid post id
    # Creating a temporary user
    Given path 'user'
    And header token = auth_token
    And request  read('../data/user.json')
    When method post
    Then status 201
    * def authorId = response.user._id

    # Delete the created temp user
    Given path 'deletepost'
    And header token = auth_token
    And request { authorId: '#(authorId)' }
    When method delete
    Then status 200
    And match response._id == authorId