import React from 'react';
import RegisterForm from '../../components/Registration/RegisterForm';
import { Container } from 'react-bootstrap';

const RegisterPage = () => {
  return (
    <Container className="mt-5">
      <h2>Register</h2>
      <RegisterForm />
    </Container>
  );
};

export default RegisterPage;
