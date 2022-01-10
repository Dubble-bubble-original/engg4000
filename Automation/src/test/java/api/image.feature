Feature: image endpoints tests

  Background:
    * url baseUrl
    * def auth = callonce read('classpath:utils/authentication.feature')
    * def auth_token = auth.response.token

  Scenario: Try to post image with no auth token provided
    Given path 'image'
    When method post
    Then status 401
    And match response.message contains 'No Authentication Token Provided'

  Scenario: Try to post image with an invalid auth token
    Given path 'image'
    And header token = 'Invalid_Token'
    When method post
    Then status 401
    And match response.message contains 'Invalid Authentication Token Provided'

  Scenario: Try to post image without a file
    Given path 'image'
    And header token = auth_token
    When method post
    Then status 400
    And match response.message contains 'No Image Provided'

  Scenario: Try to get image with invalid ID
    Given path 'image/invalidID'
    And header token = auth_token
    When method get
    Then status 404
    And match response.message contains 'Image Does Not Exist'

  Scenario: Try to delete image with invalid ID
    Given path 'image/invalidID'
    And header token = auth_token
    When method delete
    Then status 404
    And match response.message contains 'Image Does Not Exist'

  Scenario: Post, Get image, Get URL & Delete image
    # Post the new image
    Given path 'image'
    And header token = auth_token
    And multipart file image = { read: '../data/image-default.png', filename: 'karate_test.png', contentType: 'multipart/form-data'}
    When method post
    Then status 201
    * def img_id = response.id

    # Get the image without auth_token
    Given path 'image/' + img_id
    When method get
    Then status 401
    And match response.message contains 'No Authentication Token Provided'

    # Delete the image without auth_token
    Given path 'image/' + img_id
    When method delete
    Then status 401
    And match response.message contains 'No Authentication Token Provided'

    # Get the image with invalid auth_token
    Given path 'image/' + img_id
    And header token = 'Invalid_Token'
    When method get
    Then status 401
    And match response.message contains 'Invalid Authentication Token Provided'

    # Get the new image (Compare the image and response as byte arrays)
    Given path 'image/' + img_id
    And header token = auth_token
    And bytes img_data = read('../data/image-default.png')
    When method get
    Then status 200
    And match responseBytes == img_data

    # Delete the image with invalid auth_token
    Given path 'image/' + img_id
    And header token = 'Invalid_Token'
    When method delete
    Then status 401
    And match response.message contains 'Invalid Authentication Token Provided'

    # Delete the image
    Given path 'image/' + img_id
    And header token = auth_token
    When method delete
    Then status 200
    And match response.message == 'Image Deleted Successfully'