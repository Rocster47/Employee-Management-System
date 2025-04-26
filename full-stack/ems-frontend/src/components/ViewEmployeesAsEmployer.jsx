import React, {useEffect, useState} from 'react'
import { getEmployeesByEmployerId, getEmployerById, removeEmployeeFromEmployer } from '../services/EmployeeService'
import { useNavigate } from 'react-router-dom'

const ViewEmployeesAsEmployer = () => {

    const [employees, setEmployees] = useState([])
    const [title, setTitle] = useState("")

    const navigator = useNavigate();

    useEffect(() => {
        getAllEmployees();
        getTitle();
    }, [])

    function getAllEmployees(){
        getEmployeesByEmployerId("").then((response) => {
            setEmployees(response.data)
        }).catch(error => {
            console.error(error)
        })
    }

    function getTitle(){
        getEmployerById("").then((response) => {
            setTitle("Welcome, " + response.data.firstName + ". Here is the list of your employees at " + response.data.employerName + ":")
        })
    }
    
    function addNewEmployee(){
        navigator('/employer/add-employee')
    }

    function removeEmployee(id){
        removeEmployeeFromEmployer(id).then(() => {
            getAllEmployees();
        }).catch(error => {
            console.error(error);
        })
    }
    
    return (
        <div className='container'>
            <h2 className='text-center'>{title}</h2>
            <br/>
            <table className='table table-striped table-bordered'>
                <thead>
                    <tr>
                        <th>Employee Id</th>
                        <th>Employee First Name</th>
                        <th>Employee Last Name</th>
                        <th>Employee Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        employees.map(employee =>
                            <tr key={employee.id}>
                                <td>{employee.id}</td>
                                <td>{employee.firstName}</td>
                                <td>{employee.lastName}</td>
                                <td>{employee.email}</td>
                                <td>
                                    <button className='btn btn-danger' onClick={() => removeEmployee(employee.id)}
                                        style = {{marginLeft: '10px'}}
                                    >Delete</button>
                                </td>
                            </tr>)
                    }
                </tbody>
            </table>
            <button className='btn btn-primary btn-sm mb-2' onClick={addNewEmployee}>Add Employee</button>
        </div>
    )
}

export default ViewEmployeesAsEmployer
