import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLoggedInUser } from '../../Db.js';

const LoginSuccess = () => { 
    const navigate = useNavigate();
    const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    getLoggedInUser().then(responseData => {
      setLoggedInUser(responseData?.user)
    })
  }, [])

    return (
        <>
            <div className="container mt-5 text-center">
                <h2>Login Successful</h2>
                <p><b>Welcome</b> ! {loggedInUser?.email}!</p>          
            </div>
        </>
    );
};

export default LoginSuccess;
