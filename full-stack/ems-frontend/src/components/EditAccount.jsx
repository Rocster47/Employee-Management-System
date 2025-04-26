import React, { useState, useEffect } from 'react'
import {
    getEmployeeById, getEmployerById,
    deleteEmployerAccount, deleteEmployeeAccount,
    updateEmployee, updateEmployer
} from '../services/EmployeeService'
import { useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'

const EditAccount = () => {

    const navigator = useNavigate()
    const location = useLocation()

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [employerName, setEmployerName] = useState('')

    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const isEmployer = location.pathname === '/employer/edit'
    const [title, setTitle] = useState('')

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        employerName: ''
    })

    const [apiError, setApiError] = useState(false)
    const [deleted, setDeleted] = useState(false)
    const [success, setSuccess] = useState(false)
    const [successMessage, setSuccessMessage] = useState("Account details saved successfully.")

    useEffect(() => {
        if (isEmployer) {
            setTitle("Edit Your Employer Account Details")
            getEmployerById("").then((response) => {
                setFirstName(response.data.firstName);
                setLastName(response.data.lastName);
                setEmail(response.data.email);
                setEmployerName(response.data.employerName);
            });
        } else {
            setTitle("Edit Your Employee Account Details")
            getEmployeeById().then((response) => {
                setFirstName(response.data.firstName);
                setLastName(response.data.lastName);
                setEmail(response.data.email);
            });
        }
    }, [isEmployer])

    function successMessageAction() {
        setSuccessMessage("Account details saved successfully.")
        const event = new Event('updateAccount');
        window.dispatchEvent(event);
    }

    function Submit(e){
        e.preventDefault();
        setSuccess(false)
        setApiError(false)

        if(validateForm()){

            if (!isEmployer) {
                const updatedEmployee = {firstName, lastName, email, password, newPassword}

                updateEmployee(updatedEmployee).then(() => {
                    setApiError(false)
                    setSuccess(true)
                    setSuccessMessage('')
                    setTimeout(successMessageAction, 100);
                }).catch(error => {
                    setApiError(true)
                    console.error(error)
                })
            } else {
                const updatedEmployer = {firstName, lastName, email, password, newPassword, employerName};

                updateEmployer(updatedEmployer).then(() => {
                    setApiError(false)
                    setSuccess(true)
                    setSuccessMessage('')
                    setTimeout(successMessageAction, 100);
                }).catch(error => {
                    setApiError(true)
                    console.error(error)
                })
            }
        }
    }

    function validateForm() {
        let valid = true;
        const updatedErrors = { ...errors };
    
        const getErrorMessage = (field) => {
            switch (field) {
                case 'firstName': return 'First name is required.';
                case 'lastName': return 'Last name is required.';
                case 'email': return 'Email is required.';
                case 'password': return 'Password is required.';
                case 'employerName': return 'Employer Name is required.';
                default: return '';
            }
        };
    
        const blinkError = (field) => {
            updatedErrors[field] = '';
            setErrors({ ...updatedErrors });
            setTimeout(() => {
                updatedErrors[field] = getErrorMessage(field);
                setErrors({ ...updatedErrors });
            }, 100);
        };
    
        const checkField = (field, value, condition = true) => {
            if (condition && !value.trim()) {
                if (errors[field]) {
                    blinkError(field);
                } else {
                    updatedErrors[field] = getErrorMessage(field);
                    setErrors({ ...updatedErrors });
                }
                valid = false;
            } else {
                updatedErrors[field] = '';
            }
        };
    
        checkField('firstName', firstName);
        checkField('lastName', lastName);
        checkField('email', email);
        checkField('password', password);
        checkField('employerName', employerName, isEmployer);
    
        setErrors(updatedErrors);
        return valid;
    }    

    function deleteAccount() {
        setDeleted(true)
        isEmployer ? deleteEmployerAccount() : deleteEmployeeAccount()
        logOut()
            .then(() => {
                const event = new CustomEvent('accountDeleted');
                window.dispatchEvent(event)
            })
            .catch(() => {
                const event = new CustomEvent('accountDeleted');
                window.dispatchEvent(event)
            })
    }

    return (
        <div className='container'>
            <div className='row'>
                <div className='card col-md-6 offset-md-3 offset-md-3'>
                    <br />
                    <h2 className='text-center'> {title} </h2>
                    <div className='card-body'>
                        { !deleted && <form>
                            <div className='form-group mb-2'>
                                <label className='form-label'>First Name: <span className="text-danger">*</span></label>
                                <input
                                    type='text'
                                    placeholder='Enter Current/New First Name (Required)'
                                    name='firstName'
                                    value={firstName}
                                    className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                                { errors.firstName && <div className='invalid-feedback'>{errors.firstName}</div>}
                            </div>
                            <div className='form-group mb-2'>
                                <label className='form-label'>Last Name: <span className="text-danger">*</span></label>
                                <input
                                    type='text'
                                    placeholder='Enter Current/New Last Name (Required)'
                                    name='lastName'
                                    value={lastName}
                                    className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                                { errors.lastName && <div className='invalid-feedback'>{errors.lastName}</div>}
                            </div>
                            <div className='form-group mb-2'>
                                <label className='form-label'>Email: <span className="text-danger">*</span></label>
                                <input
                                    type='text'
                                    placeholder='Enter Current/New Email (Required)'
                                    name='email'
                                    value={email}
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                { errors.email && <div className='invalid-feedback'>{errors.email}</div>}
                            </div>
                            <div className='form-group mb-2'>
                                <label className='form-label'>New Password:</label>
                                <div className="input-group">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder='Enter New Password (Not Required)'
                                        name='newPassword'
                                        value={newPassword}
                                        className='form-control'
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <button type="button" className="btn btn-outline-secondary d-flex align-items-center" onClick={() => setShowNewPassword(!showNewPassword)}>
                                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                            {isEmployer && <div className='form-group mb-2'>
                                <label className='form-label'>Employer Name: <span className="text-danger">*</span></label>
                                <input
                                    type='text'
                                    placeholder='Enter Employer Name (Required)'
                                    name='employerName'
                                    value={employerName}
                                    className={`form-control ${errors.employerName ? 'is-invalid' : ''}`}
                                    onChange={(e) => setEmployerName(e.target.value)}
                                />
                                { errors.employerName && <div className='invalid-feedback'>{errors.employerName}</div>}
                            </div>}
                            <hr className="my-4" />
                            <div className='form-group mb-2'>
                                <label className='form-label'>Enter Your Password to Confirm Your Changes: <span className="text-danger">*</span></label>
                                <div className="input-group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder='Enter Current Password (Required)'
                                        name='password'
                                        value={password}
                                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button 
                                        type="button" 
                                        className="btn btn-outline-secondary d-flex align-items-center" 
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <span className="d-flex align-items-center">
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </span>
                                    </button>
                                    {errors.password && <div className='invalid-feedback'>{errors.password}</div>}
                                </div>
                            </div>
                            {apiError && !success && (
                                <div className="text-danger">
                                    Error saving new details. <br />
                                    Have you entered the correct password? If that doesn't work, try another email.
                                </div>
                            )}
                            {success && (
                                <div className="text-success">
                                    {successMessage}
                                </div>
                            )}
                            <br />
                            <div className="d-flex justify-content-between">
                                <button className="btn btn-success" onClick={Submit}>Submit</button>
                                <button type='button' className="btn btn-danger" onClick={deleteAccount}>Delete Account</button>
                            </div>
                        </form>}
                        {deleted && <div>
                            <div className="text-danger text-center">Account successfully deleted. Thank you for using our services.</div>
                            <br />
                            <button type='button' className="btn btn-primary d-flex justify-content-center align-items-center mx-auto" onClick={() => navigator('/login')}>Login</button>
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditAccount
