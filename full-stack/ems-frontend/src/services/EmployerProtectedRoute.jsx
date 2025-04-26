import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom"
import { validateJWTCookie } from "./EmployeeService";

const EmployerProtectedRoute = () => {

  const [auth, setAuth] = useState(null);
  const [role, setRole] = useState("");

  useEffect(() => {
    validateJWTCookie()
      .then((response) => {
        setAuth(true)
        setRole(response.data)
      })
      .catch(() => {
        setAuth(false)
      });
  }, []);

  if (auth === null) {
    return null
  } else if (auth && role === "employee") {
    return <Navigate to = '/employee/employers'/>
  } else if (auth && role === "employer") {
    return <Outlet/>
  } else {
    return <Navigate to = '/login'/>
  }
};

export default EmployerProtectedRoute