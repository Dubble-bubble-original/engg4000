@ignore
Feature: Create Post

  Background:
    * url baseUrl
    * def auth = callonce read('classpath:utils/authentication.feature')
    * def auth_token = auth.response.token

  Scenario: Create a global post with a user
    # Creating a temporary post with a user
    Given path 'post'
    And header token = auth_token
    And request data
    When method post
    Then status 201
    * match response.post._id == '#notpresent'
    * match response.post.author._id == '#notpresent'