package com.lower.ems.service;

import com.lower.ems.dto.*;
import com.lower.ems.entity.Employee;
import com.lower.ems.entity.Employer;
import org.springframework.boot.autoconfigure.ldap.embedded.EmbeddedLdapProperties;

import java.util.List;

public interface EmployeeService {
    EmployeeDto registerEmployee (EmployeeDto employeeDto);

    EmployerDto registerEmployer (EmployerDto employerDto);

    EmployeeDto loginEmployee (CredentialsDto credentialsDto);

    EmployerDto loginEmployer (CredentialsDto credentialsDto);

    Employee findEmployeeByEmail(String email);

    Employer findEmployerByEmail(String email);

    boolean existsEmployee(String email);

    boolean existsEmployer(String email);

    EmployeeEmployerDto addEmployee(String email, Long employeeId);

    List<EmployerDto> getEmployersByEmployeeId(Long employeeId);

    List<EmployeeDto> getEmployeesByEmployerId(Long employerId);

    EmployeeDto getEmployeeById(Long employeeId);

    EmployerDto getEmployerById(Long employerId);

    EmployeeDto updateEmployee(Long employeeId, UpdatedEmployeeDto updatedEmployee);

    EmployerDto updateEmployer(Long employerId, UpdatedEmployerDto updatedEmployer);

    void deleteEmployee(Long employeeId);

    void deleteEmployer(Long employerId);

    void removeEmployeeFromEmployer(Long employeeId, Long employerId);
}
