Feature: Delete post endpoint tests

  Background:
    * url baseUrl
    * def auth = callonce read('classpath:utils/authentication.feature')
    * def post = callonce read('classpath:utils/createPost.feature')
    * def auth_token = auth.response.token
    * def post_ID = post.response.post._id


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

  Scenario: Delete the user post successfully
    Given path 'post/' + post_ID
    And header token = auth_token
    When method delete
    Then status 200
    And match response._id == post_ID