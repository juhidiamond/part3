import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RegistrationSuccess = () => {
    const navigate = useNavigate(); 

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <>
        <div className="container mt-5 text-center">
            <h2>Registration Successful!</h2>
            <p>Thank you for your registration</p>
            <a className='cusror-pointer' onClick={handleGoHome}>
                Click to Return to Home Page
            </a>
        </div>
        </>
    );
};

export default RegistrationSuccess;
