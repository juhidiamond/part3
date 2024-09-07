import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UpdateUser, UserById,getLoggedInUser } from "../../Db.js";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [fullnameError, setFullnameError] = useState("");
  const [disabled, setDisabled] = useState();
  const [error, setError] = useState('');
  const [loggedUser, setLoggedInUser] = useState(null);
  useEffect(() => {
    getLoggedInUser().then(responseData => {
      setLoggedInUser(responseData?.user)
    })
  }, [])

  useEffect(() => {
    UserById(id).then((data) => {
      setFullname(data.name);
      setEmail(data.email);
    }).catch((error) => {
      if (error.response.status === 403) {
        setError('No user found');
        navigate("/users");
      }
    })
    
  }, [id, navigate]);

  const handleSaveChanges = async(e) => {
    e.preventDefault();

    let formErrors = {};

    if (!fullname) {
      formErrors.fullname = "Please enter your fullname.";
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      formErrors.email = "Please enter a valid email address.";
    }

    setFullnameError(formErrors.fullname);
    setEmailError(formErrors.email);

    if (Object.keys(formErrors).length === 0) {
      try {
        const UpdatedUser = {name: fullname, email: email}
        const response = await UpdateUser(id,UpdatedUser);
        if(response.error){
          setError(response.error);
        }else{
          navigate("/users");
        }
      } catch (error) {
        setError('Server Error.');
      }
    }
  };

  const myID = loggedUser?.email;

  return (
    <div className="container">
      <div className="mt-5">
        <div className="card">
          <div className="card-header">Edit User Information</div>
          <div className="card-body">
            <form
              onSubmit={handleSaveChanges}
              className="needs-validation"
              noValidate
            >
              <div className="mb-3">
                <label htmlFor="fullname" className="form-label">
                  Fullname
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    fullnameError ? "is-invalid" : ""
                  }`}
                  id="fullname"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                />
                {fullnameError && (
                  <div className="invalid-feedback">{fullnameError}</div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className={`form-control ${emailError ? "is-invalid" : ""}`}
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={email === myID}
                />
                {emailError && (
                  <div className="invalid-feedback">{emailError}</div>
                )}
              </div>
              <button type="submit" className="btn btn-primary">
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
