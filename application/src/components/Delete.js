// React
import { useState } from 'react';
import { Switch, Case, Default, If, Then } from 'react-if';
import { Container, Form, Row, Col, Button, Alert } from 'react-bootstrap';

// Resources
import { MdOutlineCheckCircle, MdOutlineCancel } from 'react-icons/md';
import Post from './post/Post.js';
import ConfirmationModal from './ConfirmationModal.js'

// API
import { getPostByAccessKey, deletePostByID } from '../api/api.js';

function Delete() {
  const [accessKey, setAccessKey] = useState('');
  const [validated, setValidated] = useState(false);
  const [postData, setPostData] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handleSubmit = (event) => {
    // Clear previous search result
    setSearchResult(null);
    setPostData(null);

    // Apply validation CSS on submit
    setValidated(true);

    // Prevent default form submission
    event.preventDefault();
    event.stopPropagation();
    
    // Make api call if valid
    const form = event.currentTarget;
    if (form.checkValidity()) searchPost();
  }

  const searchPost = async () => {
    let result = await getPostByAccessKey(accessKey);

    // Show feedback based on result
    if (!result) {
      setSearchResult('not-found');
    }
    else {
      setSearchResult('found');
      setPostData(result);
    }
  }

  const deletePost = async () => {
    let result = await deletePostByID(postData._id);

    // Show feedback based on result
    if (!result) {
      setSearchResult('not-deleted');
    }
    else {
      setSearchResult('deleted');
    }
  }

  return (
    <>
      <Container className="outer-container">
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <div className="h4">Delete a post</div>
          <div>To delete a post you must enter the access code that was given to you when you created the post.</div>
          <br/>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Access code</Form.Label>
            <Row xs={1} sm={2} style={{rowGap: '0.75rem'}}>
              <Col style={{maxWidth: '400px'}} className="flex-grow-1">
                <Form.Control 
                  required
                  type="text"
                  /* Example: f01466b4-478a-4f8f-ae8c-cae5fd40a6e5 */
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  pattern="^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$"
                  maxLength="36"
                  value={accessKey}
                  onChange={(e)=> {setAccessKey(e.target.value)}}
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid access code.
                </Form.Control.Feedback>
              </Col>
              <Col xs="auto" sm="auto">
                <Button type="submit">Search</Button>
              </Col>
            </Row>
          </Form.Group>
        </Form>
      </Container>

      <Switch>
        <Case condition={searchResult === 'found' || searchResult === 'not-deleted'}>
          <Container className="outer-container" id="post-found">
            <Row>
              <Col>
                <div className="h4 green">Post found <MdOutlineCheckCircle/></div>
                <div>The post is shown below.</div>
              </Col>
              <Col xs="auto">
                <Button onClick={() => {setShowConfirmationModal(true)}}>Delete Post</Button>
              </Col>
            </Row>
            <If condition={searchResult === 'not-deleted'}>
              <Then>
                <Row>
                  <Col>
                    <Alert variant="danger" className="mb-0 mt-3" dismissible onClose={() => setSearchResult('found')}>
                      Post could not be deleted. Please try again later.
                    </Alert>
                  </Col>
                </Row>
              </Then>
            </If>
          </Container>
          <If condition={postData}>
            <Then>
              <Post postData={postData} />
            </Then>
          </If>
        </Case>

        <Case condition={searchResult === 'not-found'}>
          <Container className="outer-container" id="post-not-found">
            <div className="h4 red">Post not found <MdOutlineCancel/></div>
            <div>The access key you entered does not match any existing post.</div>
          </Container>
        </Case>

        <Case condition={searchResult === 'deleted'}>
          <Container className="outer-container">
            <Alert variant="success" className="mb-0" dismissible onClose={() => setSearchResult(null)}>
              Post deleted successfully
            </Alert>
          </Container>
        </Case>

        <Default></Default>
      </Switch>

      <ConfirmationModal
        title="Confirmation"
        acceptString="Delete"
        cancelString="Cancel"
        acceptCallback={deletePost}
        show={showConfirmationModal}
        setShow={setShowConfirmationModal}
      >
        Do you really want to delete this post?<br/>
        This cannot be undone.
      </ConfirmationModal>
    </>
  )
}

export default Delete;