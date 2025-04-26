import { Navigate, Outlet, useParams } from "react-router-dom"
import { getEmployersByEmployeeId, validateJWTCookie } from "./EmployeeService";
import { useEffect, useState } from "react";

export const EmployeeEmployerProtectedRoute = () => {

  const [auth, setAuth] = useState(null);
  const [role, setRole] = useState("");

  const {id} = useParams();
  const [hasEmployerResult, setHasEmployerResult] = useState(null)
  
  useEffect(() => {
    validateJWTCookie()
      .then((response) => {
        setAuth(true)
        setRole(response.data)
  
        if (response.data === "employee") {
          getEmployersByEmployeeId().then((response) => {
              setHasEmployerResult(response.data.some((employer) => Number(employer.id) === parseInt(id)))
          }).catch(() => {
              setHasEmployerResult(false)
          })
        }
      })
      .catch(() => {
        setAuth(false)
        setHasEmployerResult(false)
      });
  }, []);

  if (hasEmployerResult != null) {
    if (auth && role === "employee" && hasEmployerResult) {
      return <Outlet/>
    } else if (auth && role === "employee") {
      return <Navigate to = '/employee/employers'/>
    } else if (auth && role === "employer") {
      return <Navigate to = '/employer/employees'/>
    } else {
      return <Navigate to = '/login'/>
    }
  } else {
    return null
  }
};

export default EmployeeEmployerProtectedRoute
