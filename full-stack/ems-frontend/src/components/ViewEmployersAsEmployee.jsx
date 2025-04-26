import React, {useEffect, useState} from 'react'
import { getEmployeeById, getEmployersByEmployeeId, removeEmployeeFromEmployer } from '../services/EmployeeService'
import { useNavigate } from 'react-router-dom'

const ViewEmployersAsEmployee = () => {
  
    const [employers, setEmployers] = useState([])

    const [title, setTitle] = useState("");

    const navigator = useNavigate();

    useEffect(() => {
        getAllEmployers();
        getTitle();
    }, [])

    function getTitle(){
        getEmployeeById().then((response) => {
            setTitle("Hello, " + response.data.firstName + ". Here is a list of the employers you work for:")
        })
    }

    function getAllEmployers(){
        getEmployersByEmployeeId().then((response) => {
            setEmployers(response.data)
        }).catch(error => {
            console.error(error)
        })
    }

    function viewEmployeesOfEmployer(id){
        navigator(`/employee/employees/${id}`)
    }

    function removeEmployee(id){
        removeEmployeeFromEmployer(id).then((_)=> {
            getAllEmployers();
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
                        <th>Employer Id</th>
                        <th>Employer Company Name</th>
                        <th>Employer First Name</th>
                        <th>Employer Last Name</th>
                        <th>Employer Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        employers.map(employer =>
                            <tr key={employer.id}>
                                <td>{employer.id}</td>
                                <td>{employer.employerName}</td>
                                <td>{employer.firstName}</td>
                                <td>{employer.lastName}</td>
                                <td>{employer.email}</td>
                                <td>
                                    <button className='btn btn-info' onClick={() => viewEmployeesOfEmployer(employer.id)}
                                        style = {{marginLeft: '10px'}}
                                    >View Employees</button>
                                    <button className='btn btn-danger' onClick={() => removeEmployee(employer.id)}
                                        style = {{marginLeft: '10px'}}
                                    >Leave</button>
                                </td>
                            </tr>)
                    }
                </tbody>
            </table>
        </div>
    )
}

export default ViewEmployersAsEmployee
