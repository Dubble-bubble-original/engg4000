@ignore
Feature: Create a global user and post

  Background:
    * url baseUrl
    * def auth = callonce read('classpath:utils/authentication.feature')
    * def auth_token = auth.response.token

  Scenario: Create a global post with a user
    # Creating a global user
    Given path 'user'
    And header token = auth_token
    And request read('../data/user.json')
    When method post
    Then status 201
    * def author_id = response.user._id
    * def user = response.user

    # Creating a global post
    Given path 'userpost'
    And header token = auth_token
    * def postData = read('../data/userPost.json')
    * set postData.author = author_id
    And request postData
    When method post
    Then status 201
    * set response.author = user