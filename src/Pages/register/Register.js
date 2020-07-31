import React from 'react'
import { Container, Form, Button } from 'react-bootstrap'
import {history} from '../../history'
import { Link } from 'react-router-dom'
export default function Register() {
    
    
    return (
        <div>
            <Container>
                <h1>Registre-se</h1>
                <Form>
                    <Form.Group controlId="formEmail">
                        <Form.Control type="email" name="email" placeholder="Enter email" />
                        <Form.Text className="text-muted">
                        </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formPassword">
                        <Form.Control type="password" placeholder="Password" />
                    </Form.Group>

                    <Form.Group controlId="formConfirmPassword">
                        <Form.Control type="password" placeholder="Confirm Password" />
                    </Form.Group>
                    
                    <Link to={'/login'}><Button variant="primary"  >  Login </Button></Link>
                    <Button variant="primary" type="submit"  > Register </Button>
                </Form>
            </Container>
        </div>
    )
}

