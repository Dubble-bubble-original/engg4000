Feature: Delete post endpoint tests

  Background:
    * url baseUrl
    * def auth = callonce read('classpath:utils/authentication.feature')
    * def post = callonce read('classpath:utils/createPost.feature')
    * def auth_token = auth.response.token
    * def post_ak = post.response.post.access_key


#  Scenario: Create a post
#    # Creating a avatar image
#    Given path 'image'
#    And header token = auth_token
#    And multipart file image = { read: '../data/img_avatar.png', filename: 'image', contentType: 'image/png' }
#    When method post
#    Then status 201
#    * def avatar_ID = response.id
#
#    # Create a post image
#    Given path 'image'
#    And header token = auth_token
#    And multipart file image = { read: '../data/post_image.jpeg', filename: 'image', contentType: 'image/jpeg' }
#    When method post
#    Then status 201
#    * def postImage_ID = response.id
#
#    # Creating a temporary user
#    Given path 'user'
#    And header token = auth_token
#    * def userData = read('../data/user.json')
#    * set userData.avatar_url = baseImageURl + '/' + avatar_ID
#    And request userData
#    When method post
#    Then status 201
#    * def author_id = response.user._id
#
#    # Creating a temporary post
#    Given path 'userpost'
#    And header token = auth_token
#    * def postData = read('../data/userPost.json')
#    * set postData.author_ID = author_id
#    * set postData.img_URL = baseImageURl + '/' + postImage_ID
#    And request postData
#    When method post
#    Then status 201
#    * set post_ak = response.access_key

  Scenario: Try to delete post with no auth token provided
    Given path 'post/' + post_ak
    When method delete
    Then status 401
    And print post_ak
    And match response.message == 'No Authentication Token Provided'

  Scenario: Try to delete post with an invalid auth token
    Given path 'post/' + post_ak
    And header token = 'Invalid_Token'
    When method delete
    Then status 401
    And match response.message == 'Invalid Authentication Token Provided'