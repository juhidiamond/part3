// App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import Welcome from "./components/Welcome";
import Register from "./components/auth/Register";
import RegistrationSuccess from "./components/auth/RegistrationSuccess";
import Login from "./components/auth/Login";
import LoginSuccess from "./components/auth/LoginSuccess";
import UserList from "./components/users/UserList";
import Documents from "./components/documents/Documents";
import Chats from "./components/chats/Chats";
import EditUser from "./components/users/EditUser";
import { UserRoutesLayout } from "./layouts/layouts";

import { FallBack } from "./pages/fallback";

function App() {
  const isLoggedIn = localStorage.getItem("loggedUser");
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserRoutesLayout />}>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-success" element={<RegistrationSuccess />} />

          <Route path="/documents" element={<Documents />} />
          <Route path="/login-success" element={<LoginSuccess />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/users/edit-user/:id" element={<EditUser />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="*" element={<FallBack/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
