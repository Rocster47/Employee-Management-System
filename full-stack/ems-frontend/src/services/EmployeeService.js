import axios from "axios";

axios.defaults.headers.post["Content-Type"] = 'application/json';

axios.defaults.withCredentials = true;

const REST_API_BASE_URL = 'https://localhost:443/api';

export const request = (method, url, data) => {
    return axios({
        method: method,
        url: url,
        data: data
    });
}

export const validateJWTCookie = () =>
    request('GET', REST_API_BASE_URL + "/validate")

export const logOut = () =>
    request('POST', REST_API_BASE_URL + "/logout")

export const registerEmployee = (employee) => 
    request('POST', REST_API_BASE_URL + "/employees/register", employee);

export const registerEmployer = (employer) => 
    request('POST', REST_API_BASE_URL + "/employers/register", employer);

export const loginEmployee = (credentials) => 
    request('POST', REST_API_BASE_URL + "/employees/login", credentials);

export const loginEmployer = (credentials) => 
    request('POST', REST_API_BASE_URL + "/employers/login", credentials);

export const addEmployeeToEmployer = (email) => 
    request('POST', REST_API_BASE_URL + "/employers/manage/" + email);

export const getEmployersByEmployeeId = () => 
    request('GET', REST_API_BASE_URL + "/employers/get");

export const getEmployeesByEmployerId = (employerId) => 
    request('GET', REST_API_BASE_URL + "/employees/get/" + employerId);

export const getEmployeeById = () => 
    request('GET', REST_API_BASE_URL + "/employees");

export const getEmployerById = (id) => 
    request('GET', REST_API_BASE_URL + "/get/employer/" + id);

export const updateEmployee = (employee) => 
    request('PUT', REST_API_BASE_URL + "/employees", employee);

export const updateEmployer = (employer) => 
    request('PUT', REST_API_BASE_URL + "/employers", employer);

export const deleteEmployeeAccount = () => 
    request('DELETE', REST_API_BASE_URL + "/employees");

export const deleteEmployerAccount = () => 
    request('DELETE', REST_API_BASE_URL + "/employers");

export const removeEmployeeFromEmployer = (id) => 
    request('DELETE', REST_API_BASE_URL + "/employers/employees/" + id);
