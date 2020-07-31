import React from 'react';
// import * as yup from 'yup';
import { Form, Button, Container } from 'react-bootstrap';
import styled from 'styled-components';
import history from '../../history'
import { Link } from 'react-router-dom';

export default function Login() {
    // const handleSubmit = values => console.log(values);

    // const validations = yup.object().shape({
    //     email: yup.string().email().required(),
    //     password: yup.string().min(8).required()
    // });

   

    return (
        <StyledLogin>
            <Container>
                <h1>Login</h1>
                <Form>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Control type="email" name="email" placeholder="Enter email" />
                        <Form.Text className="text-muted">
                        </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Control type="password" placeholder="Password" />
                    </Form.Group>

                    <Button variant="primary"  type="submit" > Login </Button>
                    <Link to={'/register'}><Button variant="secondary" >  Registre-se </Button></Link> 
                </Form>
            </Container>
        </StyledLogin>
    )

}

const StyledLogin = styled.div`
.container{
    width:70vw;
    margin-top:30vh;
    border: 2px solid #eee;
    border-radius: 10px;
    padding: 2vw;
}
h1{
    text-align:center;
}
.btn{
    width: 47%;
    margin: 1.5%;
    
}

`;
