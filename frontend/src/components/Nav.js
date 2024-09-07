import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { deleteLoggedInUser } from "../Db.js";

const Nav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    deleteLoggedInUser();
    navigate("/");
  };

  const getLinkclassName = (path) => {
    return location.pathname === path ? "nav-link active" : "nav-link";
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary pd-0">
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className={getLinkclassName("/chats")} to="/chats">
                Group Chat
              </Link>
            </li>
            <li className="nav-item">
              <Link className={getLinkclassName("/users")} to="/users">
                Manage Users
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={getLinkclassName("/documents")}
                to="/documents"
              >
                Manage Documents
              </Link>
            </li>
            <li className="nav-item">
              <span
                onClick={handleLogout}
                className="nav-link"
                style={{ cursor: "pointer" }}
              >
                Logout
              </span>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
