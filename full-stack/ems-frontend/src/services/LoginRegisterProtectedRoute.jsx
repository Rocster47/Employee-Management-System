import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { validateJWTCookie } from './EmployeeService';

const LoginRegisterProtectedRoute = () => {

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

  if (auth == null) {
    return null
  } else if (auth && role == "employee") {
    return <Navigate to = '/employee/employers'/>
  } else if (auth && role == "employer") {
    return <Navigate to = '/employer/employees'/>
  } else {
    return <Outlet/>
  }
};

export default LoginRegisterProtectedRoute;
