@ignore
Feature: Delete Post

  Background:
    * url baseUrl
    * def auth = callonce read('classpath:utils/authentication.feature')
    * def auth_token = auth.response.token

  Scenario: Delete post
    # Get the post id from the provided a
    Given path 'userpost/' + access_key
    And header token = auth_token
    When method get
    Then status 200
    * def post_id = response._id

    # Call deletepost endpoint to delete the post
    Given path 'deletepost/' + post_id
    And header token = auth_token
    When method delete
    Then status 200
    * match response.post._id == '#notpresent'