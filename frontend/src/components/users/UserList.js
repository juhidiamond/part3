import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { DeleteUser, getLoggedInUser, UserList } from "../../Db";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentUserId, setcurrentUserId] = useState(null);
  const [error,setError] = useState();

  const navigate = useNavigate();
  const [loggedUser, setLoggedInUser] = useState(null);
  useEffect(() => {
    getLoggedInUser().then(responseData => {
      setLoggedInUser(responseData?.user)
    })
  }, [])

  useEffect(() => {
    if(loggedUser){
      UserList().then((data) => {
        setUsers(data)
      }).catch((error) => {
        if (error.response.status === 403) {
          setUsers([])
        }
      })
    }
  }, [loggedUser]);


  const handleEdit = (index) => {
    navigate(`/users/edit-user/${users[index].id}`);
  };

  const handleUserDeleteModal = (id) => {
    setShowDeleteModal(true);
    setcurrentUserId(id);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setcurrentUserId(null);
  };

  const handleDelete = async() => {
    const updatedUsers = [...users];

    try {
      const userId = parseInt(currentUserId);
      const response = await DeleteUser(userId);
      if (response.error) {
          setError(response.error);
          handleCloseDeleteModal();
      }else{
        let restUsers = updatedUsers.filter((result) => result.id !== parseInt(currentUserId));
          setUsers(restUsers);
          handleCloseDeleteModal();
      }
  } catch (error) {
      setError('Error deleting user');
  }

  };

  return (
    <>
      <div className="container-fluid">
        <h2 className="mt-4">User List</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    className="btn"
                    onClick={() => handleEdit(index)}
                  >
                    Edit
                  </button>
                  {user?.id !== loggedUser?.id && (
                    <button
                      className="btn"
                      onClick={() => handleUserDeleteModal(user.id)}
                    >
                      | Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure to delete this user?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDeleteModal}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default UsersList;
