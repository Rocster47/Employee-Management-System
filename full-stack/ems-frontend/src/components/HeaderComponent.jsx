import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { getEmployeeById, getEmployerById, logOut, validateJWTCookie } from '../services/EmployeeService';

const HeaderComponent = () => {
  const navigator = useNavigate();
  const location = useLocation();

  const [role, setRole] = useState(null);
  const [fullName, setFullName] = useState("");

  const checkRoleAndName = async () => {
    try {
      const response = await validateJWTCookie();
      const userRole = response.data;
      setRole(userRole);

      if (userRole === "employee") {
        const res = await getEmployeeById();
        setFullName(`${res.data.firstName} ${res.data.lastName}`);
      } else if (userRole === "employer") {
        const res = await getEmployerById("");
        setFullName(`${res.data.firstName} ${res.data.lastName}`);
      }
    } catch (error) {
      setRole(null);
      setFullName("");
    }
  };

  useEffect(() => {
    checkRoleAndName();

    const handleAccountDeleted = () => {
      setRole(null);
      setFullName("");
    };

    const handleAccountUpdated = () => {
      checkRoleAndName();
    };

    window.addEventListener("accountDeleted", handleAccountDeleted);
    window.addEventListener("updateAccount", handleAccountUpdated);

    return () => {
      window.removeEventListener("accountDeleted", handleAccountDeleted);
      window.removeEventListener("updateAccount", handleAccountUpdated);
    };
  }, [location]);

  const signOut = () => {
    logOut()
      .then(() => {
        setRole(null);
        setFullName("");
        navigator("/login");
      })
      .catch(() => {
        setRole(null);
        setFullName("");
        navigator("/login");
      });
  };

  const employeeOrEmployerEdit = () =>
    role === "employee" ? "/employee/edit" : "/employer/edit";

  return (
    <header>
      <nav className="navbar navbar-dark bg-dark fixed-top">
        <Link className="navbar-brand px-4" to="/">
          Employee Management System
        </Link>
        {role && (
          <div className="d-flex align-items-center">
            <Link
              to={employeeOrEmployerEdit()}
              className="text-light me-3 text-decoration-underline"
              style={{ fontSize: '1.1rem' }}
            >
              {fullName}
            </Link>
            <button className="btn btn-outline-light me-4 ms-2" onClick={signOut}>
              Sign Out
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default HeaderComponent;
