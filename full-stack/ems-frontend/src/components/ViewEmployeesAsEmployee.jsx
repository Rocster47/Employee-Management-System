import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import { getEmployeesByEmployerId, getEmployerById } from '../services/EmployeeService';

const ViewEmployeesAsEmployee = () => {
  
    const [employees, setEmployees] = useState([])
    const [title, setTitle] = useState("");
    
    const {id} = useParams();

    useEffect(() => {
        getAllEmployees();
        getTitle();
    }, [])

    function getTitle(){
        getEmployerById(id).then((response) => {
            setTitle("Including yourself, these are the employees of " + response.data.employerName + " you work with:")
        })
    }

    function getAllEmployees(){
        getEmployeesByEmployerId(id).then((response) => {
            setEmployees(response.data)
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
                            </tr>)
                    }
                </tbody>
            </table>
        </div>
    )
}

export default ViewEmployeesAsEmployee
