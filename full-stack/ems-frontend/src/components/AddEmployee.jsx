import React, { useState, useEffect } from 'react';
import { addEmployeeToEmployer } from '../services/EmployeeService';

const AddEmployee = () => {

    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({ email: '' });
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [apiError, setApiError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('Employee added successfully.');
    const [errorMessage, setErrorMessage] = useState('');
    const [isErrorVisible, setIsErrorVisible] = useState(false);
    const [emailErrorVisible, setEmailErrorVisible] = useState(false);

    useEffect(() => {
        if (hasSubmitted) {
            addEmployeeToEmployer(email)
                .then(() => {
                    setApiError(false);
                    setSuccess(true);
                    setSuccessMessage('');
                    setTimeout(() => setSuccessMessage('Account details saved successfully.'), 100);
                })
                .catch(() => {
                    setApiError(true);
                    setErrorMessage('Error adding a new employee. Is this account already one of your employees, or does the account not even exist?');
                    triggerErrorReappear();
                });
            setHasSubmitted(false);
        }
    }, [hasSubmitted, email]);

    const addEmployee = (e) => {
        e.preventDefault();
        setSuccess(false);
        setErrorMessage('');

        if (validateForm()) {
            setHasSubmitted(true);
        }
    };

    const validateForm = () => {
        let valid = true;
        const errorsCopy = { ...errors };

        if (email.trim()) {
            errorsCopy.email = '';
        } else {
            errorsCopy.email = 'Email is required.';
            valid = false;
        }

        setErrors(errorsCopy);
        triggerEmailErrorReappear();
        return valid;
    };

    const triggerErrorReappear = () => {
        setIsErrorVisible(false);
        setTimeout(() => {
            setIsErrorVisible(true);
        }, 100);
    };

    const triggerEmailErrorReappear = () => {
        setEmailErrorVisible(false);
        setTimeout(() => {
            setEmailErrorVisible(true);
        }, 100);
    };

    return (
        <div className="container">
            <div className="row">
                <div className="card col-md-6 offset-md-3 offset-md-3">
                    <br />
                    <h2 className="text-center">Add Employee</h2>
                    <div className="card-body">
                        <form>
                            <div className="form-group mb-2">
                                <label className="form-label">Employee email:</label>
                                <input
                                    type="text"
                                    placeholder="Enter Employee Email"
                                    name="email"
                                    value={email}
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                {emailErrorVisible && errors.email && <div className="invalid-feedback">{errors.email}</div>}
                            </div>

                            {isErrorVisible && !errors.email && (
                                <div className="text-danger">
                                    {errorMessage}
                                </div>
                            )}

                            {success && !errors.email && !apiError && (
                                <div className="text-success">
                                    {successMessage}
                                </div>
                            )}

                            <br />
                            <button className="btn btn-success" onClick={addEmployee}>Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddEmployee;
