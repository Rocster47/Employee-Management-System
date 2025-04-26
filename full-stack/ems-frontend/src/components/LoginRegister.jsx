import React, { useState, useEffect } from 'react'
import { registerEmployee, registerEmployer, loginEmployee, loginEmployer } from '../services/EmployeeService'
import { useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'

const LoginRegister = () => {
    const navigator = useNavigate()
    const location = useLocation()

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [employerName, setEmployerName] = useState('')

    const [showPassword, setShowPassword] = useState(false)
    const [isEmployer, setIsEmployer] = useState(false)
    const [isLoggingIn, setIsLoggingIn] = useState(location.pathname === '/login')

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        employerName: ''
    })

    const [apiError, setApiError] = useState('')

    const [title, setTitle] = useState("")

    useEffect(() => {
        toggleChange(isEmployer)
    }, [isLoggingIn])

    useEffect(() => {
        setTitle(isLoggingIn ? (isEmployer ? 'Employer Login' : 'Employee Login') : (isEmployer ? 'Register Employer' : 'Register Employee'))
    }, [isLoggingIn, isEmployer])

    function Submit(e) {
        e.preventDefault();
        setApiError('');

        if (validateForm()) {
            setTimeout(() => {
                if (!isLoggingIn && !isEmployer) {
                    const employee = { firstName, lastName, email, password };
                    registerEmployee(employee)
                        .then(() => {
                            setApiError('');
                            navigator('/employee/employers');
                        })
                        .catch(error => {
                            setApiError('Failed to register. Please try again with a different email.');
                            console.error(error);
                        });
                } else if (!isLoggingIn && isEmployer) {
                    const employer = { firstName, lastName, email, password, employerName };
                    registerEmployer(employer)
                        .then(() => {
                            setApiError('');
                            navigator('/employer/employees');
                        })
                        .catch(error => {
                            setApiError('Failed to register account. Please try again with a different email.');
                            console.error(error);
                        });
                } else if (isLoggingIn && !isEmployer) {
                    const employee = { email, password };
                    loginEmployee(employee)
                        .then(() => {
                            setApiError('');
                            navigator('/employee/employers');
                        })
                        .catch(error => {
                            setApiError(
                                <div>
                                    Error logging in.<br />
                                    Have you entered the correct credentials, or does the account not even exist?
                                </div>
                              );
                            console.error(error);
                        });
                } else {
                    const employer = { email, password };
                    loginEmployer(employer)
                        .then((response) => {
                            setApiError('');
                            navigator('/employer/employees');
                        })
                        .catch(error => {
                            setApiError('Failed to log in. Please check your credentials or register if you don’t have an account.');
                            console.error(error);
                        });
                }
            }, 200);
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

        checkField('email', email);
        checkField('password', password);
    
        if (!isLoggingIn) {
            checkField('firstName', firstName);
            checkField('lastName', lastName);
            checkField('employerName', employerName, isEmployer);
        }
    
        setErrors(updatedErrors);
        return valid;
    }    

    function toggleChange(on) {
        if (on && isLoggingIn) {
            setTitle('Employer Log In');
            setIsEmployer(true);
        } else if (!on && isLoggingIn) {
            setTitle('Employee Log In');
            setIsEmployer(false);
        } else if (on && !isLoggingIn) {
            setTitle('Register Employer');
            setIsEmployer(true);
        } else {
            setTitle('Register Employee');
            setIsEmployer(false);
        }
    }

    function switchScreen() {
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setEmployerName('');

        setErrors({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            employerName: ''
        });

        setApiError('');

        setIsLoggingIn((prevState) => {
            const newState = !prevState;
            navigator(newState ? '/login' : '/register');
            return newState;
        });
    }

    function switchMessage() {
        if (isLoggingIn) {
            return "Don't have an account? Register here.";
        } else {
            return "Already have an account? Log in here.";
        }
    }

    return (
        <div className='container'>
            <div className='row'>
                <div className='card col-md-6 offset-md-3 offset-md-3'>
                    <br />
                    <h2 className='text-center'>{title}</h2>
                    <div className='card-body'>
                        <form onSubmit={Submit}>
                            {!isLoggingIn && (
                                <div className='form-group mb-2'>
                                    <label className='form-label'>First Name:</label>
                                    <input
                                        type='text'
                                        placeholder='Enter First Name'
                                        name='firstName'
                                        value={firstName}
                                        className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                    {errors.firstName && <div className='invalid-feedback'>{errors.firstName}</div>}
                                </div>
                            )}
                            {!isLoggingIn && (
                                <div className='form-group mb-2'>
                                    <label className='form-label'>Last Name:</label>
                                    <input
                                        type='text'
                                        placeholder='Enter Last Name'
                                        name='lastName'
                                        value={lastName}
                                        className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                    {errors.lastName && <div className='invalid-feedback'>{errors.lastName}</div>}
                                </div>
                            )}
                            <div className='form-group mb-2'>
                                <label className='form-label'>Email:</label>
                                <input
                                    type='text'
                                    placeholder='Enter Email'
                                    name='email'
                                    value={email}
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                {errors.email && <div className='invalid-feedback'>{errors.email}</div>}
                            </div>
                            <div className='form-group mb-2'>
                                <label className='form-label'>Password:</label>
                                <div className="input-group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder='Enter Password'
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
                            {!isLoggingIn && isEmployer && (
                                <div className='form-group mb-2'>
                                    <label className='form-label'>Employer Name:</label>
                                    <input
                                        type='text'
                                        placeholder='Enter Employer Name'
                                        name='employerName'
                                        value={employerName}
                                        className={`form-control ${errors.employerName ? 'is-invalid' : ''}`}
                                        onChange={(e) => setEmployerName(e.target.value)}
                                    />
                                    {errors.employerName && <div className='invalid-feedback'>{errors.employerName}</div>}
                                </div>
                            )}

                            {apiError && (
                                <div className="text-danger">
                                    {apiError}
                                </div>
                            )}

                            <br />
                            <div className="form-check form-switch">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id="flexSwitchCheckDefault"
                                    onChange={(e) => toggleChange(e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                                    I am an employer.
                                </label>
                            </div>
                            <br />
                            <div className="d-flex justify-content-between">
                                <button className="btn btn-success" type="submit">Submit</button>
                                <button type='button' className="btn btn-primary" onClick={switchScreen}>
                                    {switchMessage()}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginRegister;
