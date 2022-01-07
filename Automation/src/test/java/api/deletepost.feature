Feature: Delete post endpoint tests

  Background:
    * url baseUrl
    * def baseImageURl = 'https://senior-design-img-bucket.s3.amazonaws.com/'
    * def auth = callonce read('classpath:utils/authentication.feature')
    * def post = callonce read('classpath:utils/createPost.feature')
    * def auth_token = auth.response.token
    * def post_ID = post.response.post._id
    * def user = post.response.author


  Scenario: Try to delete post with no auth token provided
    Given path 'post/' + post_ID
    When method delete
    Then status 401
    And match response.message == 'No Authentication Token Provided'

  Scenario: Try to delete post with an invalid auth token
    Given path 'post/' + post_ID
    And header token = 'Invalid_Token'
    When method delete
    Then status 401
    And match response.message == 'Invalid Authentication Token Provided'

  Scenario: Try to delete post with an invalid post id
    Given path 'post/1234'
    And header token = auth_token
    When method delete
    Then status 400
    And match response.message == 'Invalid Post ID'

  Scenario: Try to delete non existing user post
    Given path 'post/123123123123'
    And header token = auth_token
    When method delete
    Then status 404
    And match response.message == 'User Post Not Found'

  Scenario: Try to delete a post with an invalid post image id
    # Creating a temporary user
    Given path 'user'
    And header token = auth_token
    * def userData = read('../data/user.json')
    * set userData.avatar_url = user.avatar_url
    And request userData
    When method post
    Then status 201
    * def author_id = response.user._id

    # Create a post with an invalid post image
    Given path 'userpost'
    And header token = auth_token
    * def postData = read('../data/userPost.json')
    * set postData.author_ID = author_id
    * set postData.img_URL = baseImageURl + '1234'
    And request postData
    And print postData
    When method post
    Then status 201
    * def invalidPost_ID = response.post._id

    # Calling delete endpoint with new created post
    Given path 'post/' + invalidPost_ID
    And header token = auth_token
    When method delete
    Then status 404
    And match response.message == 'Post Image Does Not Exist'

  Scenario: Delete the user post successfully
    Given path 'post/' + post_ID
    And header token = auth_token
    When method delete
    Then status 200
    And match response._id == post_ID