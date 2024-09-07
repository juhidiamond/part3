import React, { useState, useEffect } from "react";
import { Modal, Button, Table, Alert } from "react-bootstrap";
import { AddDocument, DeleteDocument, DocumentList, getLoggedInUser, UpdateDocument } from "../../Db";

const Documents = () => {
  const [loggedUser, setLoggedInUser] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [fileLabel, setfileLabel] = useState("");
  const [fileInput, setFileInput] = useState(null);
  const [editfileLabel, setEditfileLabel] = useState("");
  const [currentFileId, setCurrentFileId] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    getLoggedInUser().then(responseData => {
      setLoggedInUser(responseData?.user)
    })
  }, [])

  useEffect(() => {
    if(loggedUser){
      DocumentList().then((data) => {
        setDocuments(data)
      }).catch((error) => {
        if (error.response.status === 403) {
          setDocuments([])
        }
      })
    }
  }, [loggedUser]);

  const handleUpload = async() => {
    if (fileLabel.trim() === "" || !fileInput) {
      setErrorMessage("Please fill in the file description and select a file.");
      setShowError(true);
      return;
    }

    try {
      const newDocument = await AddDocument(fileLabel, fileInput);
      if(newDocument){
        const updatedDocuments = [...documents, newDocument];
        setDocuments(updatedDocuments);
        setfileLabel("");        
        setFileInput(null);
        setShowUploadModal(false);
        setShowError(false);
      }
    } catch (error) {
      setErrorMessage(error);
      setShowError(true);
    }
    
  };

  const handleDelete = async() => {
    const updatedDocuments = documents.filter(
      (upload) => upload.id !== currentFileId
    );
    try {
      const response = await DeleteDocument(currentFileId);
      if(response){
        setDocuments(updatedDocuments);
        setShowDeleteModal(false);
      }
    } catch (error) {
      setErrorMessage(error);
      setShowError(true);
    }
    
  };

  const handleEditSave = async() => {
    if (editfileLabel.trim() === "") {
      setErrorMessage("Please enter the label.");
      setShowError(true);
      return;
    }

    try {
      const updatedDocument = await UpdateDocument(currentFileId,{label:editfileLabel});
      if (updatedDocument) {
        setDocuments((oldDocuments) =>
          oldDocuments.map(upload =>
              upload.id === currentFileId ? { ...upload, label: editfileLabel } : upload
          )
      );
      setShowEditModal(false);
      setShowError(false);
      }

    } catch (error) {
      setErrorMessage(error);
      setShowError(true);
    }
  };

  return (
    <>
      <div className="container-fluid">
        <h1 className="text-center mt-3 mb-3">My Documents</h1>

        <Table striped hover id="documentListTable">
          <thead>
            <tr>
              <th>Label</th>
              <th>Filename</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody id="documentListTableBody">
            {documents.map((upload) => (
              <tr key={upload.id}>
                <td>{upload.label}</td>
                <td>{upload.file_name}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setShowEditModal(true);
                      setCurrentFileId(upload.id);
                      setEditfileLabel(upload.label);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      setShowDeleteModal(true);
                      setCurrentFileId(upload.id);
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Button variant="primary" onClick={() => setShowUploadModal(true)}>
          + Add Upload
        </Button>

        <Modal
          show={showUploadModal}
          onHide={() => setShowUploadModal(false)}
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>Upload</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className="mb-3">
              <div className="form-group">
                <label htmlFor="fileLabel">File Label</label>
                <input
                  type="text"
                  className="form-control"
                  id="fileLabel"
                  value={fileLabel}
                  onChange={(e) => setfileLabel(e.target.value)}
                  placeholder="Label"
                />
              </div>
              <div className="form-group">
                <label htmlFor="fileInput">File</label>
                <br />
                <input
                  type="file"
                  className="form-control-file"
                  id="fileInput"
                  onChange={(e) => setFileInput(e.target.files[0])}
                />
              </div>
            </form>
            {showError && (
              <Alert
                variant="danger"
                onClose={() => setShowError(false)}
                dismissible
              >
                {errorMessage}
              </Alert>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleUpload}>
              Upload
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowUploadModal(false)}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className="mb-3">
              <div className="form-group">
                <label htmlFor="edit_document_fileLabel">
                  File Label
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="edit_document_fileLabel"
                  value={editfileLabel}
                  onChange={(e) => setEditfileLabel(e.target.value)}
                  placeholder="File Label"
                />
              </div>
            </form>
            {showError && (
              <Alert
                variant="danger"
                onClose={() => setShowError(false)}
                dismissible
              >
                {errorMessage}
              </Alert>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleEditSave}>
              Save
            </Button>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>Delete File</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure to delete this file?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Close
            </Button>
            <Button variant="primary" onClick={handleDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default Documents;
