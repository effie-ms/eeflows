import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Container } from 'reactstrap';

const AuthLayout = ({ children }) => (
    <>
        <Helmet defaultTitle="Authentication">
            <body className="auth" />
        </Helmet>
        <Container>
            <div className="bg-origin" />
            <div className="login-form">{children}</div>
        </Container>
    </>
);

AuthLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AuthLayout;
