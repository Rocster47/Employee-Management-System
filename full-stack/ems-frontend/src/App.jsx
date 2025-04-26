import './App.css'
import FooterComponent from './components/FooterComponent'
import HeaderComponent from './components/HeaderComponent'
import {BrowserRouter, Routes, Route, Navigate, useLocation} from 'react-router-dom'
import ViewEmployeesAsEmployer from './components/ViewEmployeesAsEmployer'
import ViewEmployeesAsEmployee from './components/ViewEmployeesAsEmployee'
import ViewEmployersAsEmployee from './components/ViewEmployersAsEmployee'
import LoginRegister from './components/LoginRegister'
import { useEffect } from 'react'
import EmployerProtectedRoute from './services/EmployerProtectedRoute'
import EmployeeProtectedRoute from './services/EmployeeProtectedRoute'
import EmployeeEmployerProtectedRoute from './services/EmployeeEmployerProtectedRoute'
import AddEmployee from './components/AddEmployee'
import LoginRegisterProtectedRoutes from './services/LoginRegisterProtectedRoute'
import EditAccount from './components/EditAccount'
import RestInterceptor from './services/RestInterceptor'

function App() {
  return (
    <div className='app-container'>
      <BrowserRouter>
      <RestInterceptor/>
        <HeaderComponent />
        <div className='content'>
          <Routes>
              <Route element = {<LoginRegisterProtectedRoutes/>}>
                {/* // http://localhost:3000/login */}
                <Route path='/login' element = { <LoginRegister /> }></Route>
                {/* // http://localhost:3000/register */}
                <Route path='/register' element = { <LoginRegister /> }></Route>
              </Route>

              <Route element = {<EmployerProtectedRoute/>}>
                {/* // http://localhost:3000/employer/employees */}
                <Route path="/employer/employees" element = { <ViewEmployeesAsEmployer/> }></Route>
                {/* // http://localhost:3000/employer/edit */}
                <Route path="/employer/edit" element = { <EditAccount/> }></Route>
                {/* // http://localhost:3000/employer/add-employee */}
                <Route path='/employer/add-employee' element = { <AddEmployee />}></Route>
              </Route>

              <Route element = {<EmployeeProtectedRoute/>}>
                {/* // http://localhost:3000/employee/employers */}
                <Route path="/employee/employers" element = { <ViewEmployersAsEmployee/> }></Route>
                {/* // http://localhost:3000/employee/edit */}
                <Route path="/employee/edit" element = { <EditAccount/> }></Route>
              </Route>

              <Route element = {<EmployeeEmployerProtectedRoute/>}>
                {/* // http://localhost:3000/employee/employees/id */}
                <Route path="/employee/employees/:id" element = { <ViewEmployeesAsEmployee/> }></Route>
              </Route>

              <Route path='*' element = { <Navigate to="/login" /> }></Route>
          </Routes>
        </div>
        <FooterComponent />
      </BrowserRouter>
    </div>
  )
}

export default App
