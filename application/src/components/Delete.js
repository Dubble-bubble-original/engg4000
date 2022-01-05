// React
import { Container, Form, Row, Col, Button } from 'react-bootstrap';

function Delete() {

  return (
    <div>
      {/* Temporary content (change me) */}
      <Container className="outer-container">
        <Form>
          <div className="h4">Delete a post</div>
          <div>To delete a post you must use the access code that was given to you when you created the post.</div>
          <br/>
          <Row className="align-items-end">
            <Col>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Access code</Form.Label>
                <Form.Control type="email" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
              </Form.Group>
            </Col>
            <Col>
              <Button>Search</Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </div>
  )
}

export default Delete;