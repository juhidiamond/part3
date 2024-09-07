import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import Nav from "../components/Nav";
import { useState,useEffect } from "react";
import { getLoggedInUser } from "../Db.js";

export const UserRoutesLayout = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setLoggedInUser] = useState();

  const guestRoutes = ["/login", "/register", "/register-success", "/"]
  const location = useLocation().pathname;

  useEffect(() => {
    getLoggedInUser().then(responseData => {
      setLoggedInUser(responseData?.user)
    })
  }, [])

  useEffect(() => {
    if (!isLoggedIn) navigate("/");
    else{
      if(guestRoutes.includes(location)) navigate("/users")
    }

  }, [isLoggedIn]);

  return (
    <div>
      {isLoggedIn ? (
        <>
          <Nav />
          <main>
            <Outlet />
          </main>
        </>
      ) : (
        <>
          <main>
            <Outlet />
          </main>
        </>
      )}
    </div>
  );
};
