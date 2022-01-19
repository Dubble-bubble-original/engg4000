@ignore
Feature: Delete Post

  Background:
    * url baseUrl
    * def auth = callonce read('classpath:utils/authentication.feature')
    * def auth_token = auth.response.token

  Scenario: Call userpost endpoint
    # Call get userpost endpoint to get the post id
    Given path 'userpost/' + access_key
    And header token = auth_token
    When method get
    Then status 200
    * def post_id = response._id