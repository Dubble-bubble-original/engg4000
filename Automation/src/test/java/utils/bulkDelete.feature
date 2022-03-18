@ignore
Feature: Bulk Delete

  Background:
    * url baseUrl
    * def auth = callonce read('classpath:utils/authentication.feature')
    * def auth_token = auth.response.token

  Scenario: Call bulkdelete endpoint
    # Call bulk delete
    Given path 'bulkdelete'
    And header token = auth_token
    When method delete
    Then status 200

