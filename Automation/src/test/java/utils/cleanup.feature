@ignore
Feature: Delete Post

  Background:
    * url baseUrl
    * def auth = callonce read('classpath:utils/authentication.feature')
    * def auth_token = auth.response.token

  Scenario: Delete post
    Given path 'deletepost/' + post_id
    And header token = auth_token
    When method delete
    Then status 200
    And match response.status.message == 'Post Deleted Successfully'