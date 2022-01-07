@ignore
Feature: Create a complete User Post

  Background:
    * url baseUrl
    * def auth = callonce read('classpath:utils/authentication.feature')
    * def auth_token = auth.response.token
    * def baseImageURl = 'https://senior-design-img-bucket.s3.amazonaws.com/'

Scenario: Create a post
  # Creating a avatar image
  Given path 'image'
  And header token = auth_token
  And multipart file image = { read: '../data/img_avatar.png', filename: 'image', contentType: 'image/png' }
  When method post
  Then status 201
  * def avatar_ID = response.id

  # Create a post image
  Given path 'image'
  And header token = auth_token
  And multipart file image = { read: '../data/post_image.jpeg', filename: 'image', contentType: 'image/jpeg' }
  When method post
  Then status 201
  * def postImage_ID = response.id

  # Creating a temporary user
  Given path 'user'
  And header token = auth_token
  * def userData = read('../data/user.json')
  * set userData.avatar_url = baseImageURl + avatar_ID
  And request userData
  When method post
  Then status 201
  * def author_id = response.user._id
  * def user = response.user

  # Creating a temporary post
  Given path 'userpost'
  And header token = auth_token
  * def postData = read('../data/userPost.json')
  * set postData.author_ID = author_id
  * set postData.img_URL = baseImageURl + postImage_ID
  And request postData
  When method post
  * set response.author = user
  Then status 201