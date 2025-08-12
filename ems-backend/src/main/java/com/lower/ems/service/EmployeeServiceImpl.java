package com.lower.ems.service;

import com.lower.ems.dto.*;
import com.lower.ems.entity.Employee;
import com.lower.ems.entity.EmployeeEmployer;
import com.lower.ems.entity.Employer;
import com.lower.ems.exception.AppException;
import com.lower.ems.mapper.EmployeeEmployerMapper;
import com.lower.ems.mapper.EmployeeMapper;
import com.lower.ems.mapper.EmployerMapper;
import com.lower.ems.repository.EmployeeEmployerRepository;
import com.lower.ems.repository.EmployeeRepository;
import com.lower.ems.repository.EmployerRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.CharBuffer;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private EmployeeRepository employeeRepository;
    private EmployeeEmployerRepository employeeEmployerRepository;
    private EmployerRepository employerRepository;
    private PasswordEncoder passwordEncoder;

    @Override
    public EmployeeDto registerEmployee(EmployeeDto employeeDto) {
        if (existsEmployee(employeeDto.getEmail()) || existsEmployer(employeeDto.getEmail())) {
            throw new AppException("Login already exists", HttpStatus.BAD_REQUEST);
        }

        Employee employee = EmployeeMapper.mapToEmployee(employeeDto);
        employee.setPassword(passwordEncoder.encode(CharBuffer.wrap(employeeDto.getPassword())));

        Employee savedEmployee = employeeRepository.save(employee);

        return EmployeeMapper.mapToEmployeeDto(savedEmployee);
    }

    @Override
    public EmployerDto registerEmployer(EmployerDto employerDto) {
        if (existsEmployee(employerDto.getEmail()) || existsEmployer(employerDto.getEmail())) {
            throw new AppException("Login already exists", HttpStatus.BAD_REQUEST);
        }

        Employer employer = EmployerMapper.mapToEmployer(employerDto);
        employer.setPassword(passwordEncoder.encode(CharBuffer.wrap(employerDto.getPassword())));

        Employer savedEmployer = employerRepository.save(employer);

        return EmployerMapper.mapToEmployerDto(savedEmployer);
    }

    @Override
    public EmployeeDto loginEmployee (CredentialsDto credentialsDto) {
        Employee employee = employeeRepository.findByEmail(credentialsDto.getEmail())
                .orElseThrow(() -> new AppException("Unknown user, are you an employer?", HttpStatus.NOT_FOUND));

        if (passwordEncoder.matches(CharBuffer.wrap(credentialsDto.getPassword()), employee.getPassword())) {
            return EmployeeMapper.mapToEmployeeDto(employee);
        }
        throw new AppException("Invalid password", HttpStatus.BAD_REQUEST);
    }

    @Override
    public EmployerDto loginEmployer (CredentialsDto credentialsDto) {
        Employer employer = employerRepository.findByEmail(credentialsDto.getEmail())
                .orElseThrow(() -> new AppException("Unknown user, are you an employee?", HttpStatus.NOT_FOUND));

        if (passwordEncoder.matches(CharBuffer.wrap(credentialsDto.getPassword()), employer.getPassword())) {
            return EmployerMapper.mapToEmployerDto(employer);
        }
        throw new AppException("Invalid password", HttpStatus.BAD_REQUEST);
    }

    @Override
    public Employee findEmployeeByEmail(String email) {
        return employeeRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("Employee not found with email: " + email, HttpStatus.NOT_FOUND));
    }

    @Override
    public Employer findEmployerByEmail(String email) {
        return employerRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("Employer not found with email: " + email, HttpStatus.NOT_FOUND));
    }

    @Override
    public boolean existsEmployee(String email) {
        return employeeRepository.findByEmail(email).isPresent();
    }

    @Override
    public boolean existsEmployer(String email) {
        return employerRepository.findByEmail(email).isPresent();
    }

    @Override
    public EmployeeEmployerDto addEmployee(String email, Long employerId) {
        if(employeeRepository.findByEmail(email).isEmpty()) {
            throw new RuntimeException("No employee account found with email: " + email);
        } else if(employerRepository.findById(employerId).isEmpty()) {
            throw new RuntimeException("No employer account found with id: " + employerId);
        } else if (employeeEmployerRepository.findByEmployeeIdAndEmployerId(employeeRepository.findByEmail(email).get().getId(), employerId).isPresent()) {
            throw new RuntimeException("Employee already exists in your company");
        }

        EmployeeEmployerDto employeeEmployerDto = new EmployeeEmployerDto();
        employeeEmployerDto.setEmployee(employeeRepository.findByEmail(email).get());
        employeeEmployerDto.setEmployer(employerRepository.findById(employerId).get());

        EmployeeEmployer employeeEmployer = EmployeeEmployerMapper.mapToEmployeeEmployer(employeeEmployerDto);
        EmployeeEmployer savedEmployeeEmployer = employeeEmployerRepository.save(employeeEmployer);
        return EmployeeEmployerMapper.mapToEmployeeEmployerDto(savedEmployeeEmployer);
    }

    @Override
    public List<EmployerDto> getEmployersByEmployeeId(Long employeeId) {
        return employeeEmployerRepository.findByEmployeeId(employeeId)
                .stream()
                .map(EmployeeEmployer::getEmployer)
                .map(EmployerMapper::mapToEmployerDto)
                .map(EmployerDto::withoutSensitiveData)
                .collect(Collectors.toList());
    }

    @Override
    public List<EmployeeDto> getEmployeesByEmployerId(Long employerId) {
        return employeeEmployerRepository.findByEmployerId(employerId)
                .stream()
                .map(EmployeeEmployer::getEmployee)
                .map(EmployeeMapper::mapToEmployeeDto)
                .map(EmployeeDto::withoutSensitiveData)
                .collect(Collectors.toList());
    }

    @Override
    public EmployeeDto getEmployeeById(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new AppException("Employee not found with id: " + employeeId, HttpStatus.NOT_FOUND));

        return EmployeeMapper.mapToEmployeeDto(employee);
    }

    @Override
    public EmployerDto getEmployerById(Long employerId) {
        Employer employer = employerRepository.findById(employerId)
                .orElseThrow(() -> new AppException("Employer not found with id: " + employerId, HttpStatus.NOT_FOUND));

        return EmployerMapper.mapToEmployerDto(employer);
    }

    @Override
    public EmployeeDto updateEmployee(Long employeeId, UpdatedEmployeeDto updatedEmployee) {

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new AppException("Employee does not exist with given id : " + employeeId, HttpStatus.NOT_FOUND)
        );

        if (passwordEncoder.matches(CharBuffer.wrap(updatedEmployee.getPassword()), employee.getPassword())) {
            employee.setFirstName(updatedEmployee.getFirstName());
            employee.setLastName(updatedEmployee.getLastName());
            employee.setEmail(updatedEmployee.getEmail());
            if (updatedEmployee.getNewPassword() != null && !updatedEmployee.getNewPassword().isEmpty()) {
                employee.setPassword(passwordEncoder.encode(CharBuffer.wrap(updatedEmployee.getNewPassword())));
            }
            Employee savedEmployee = employeeRepository.save(employee);
            return EmployeeMapper.mapToEmployeeDto(savedEmployee);
        } else {
            throw new AppException("Invalid password", HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public EmployerDto updateEmployer(Long employerId, UpdatedEmployerDto updatedEmployer) {

        Employer employer = employerRepository.findById(employerId).orElseThrow(
                () -> new AppException("Employer does not exist with given id : " + employerId, HttpStatus.NOT_FOUND)
        );

        if (passwordEncoder.matches(CharBuffer.wrap(updatedEmployer.getPassword()), employer.getPassword())) {
            employer.setFirstName(updatedEmployer.getFirstName());
            employer.setLastName(updatedEmployer.getLastName());
            employer.setEmail(updatedEmployer.getEmail());
            employer.setEmployerName(updatedEmployer.getEmployerName());
            if (updatedEmployer.getNewPassword() != null && !updatedEmployer.getNewPassword().isEmpty()) {
                employer.setPassword(passwordEncoder.encode(CharBuffer.wrap(updatedEmployer.getNewPassword())));
            }
            Employer savedEmployer = employerRepository.save(employer);
            return EmployerMapper.mapToEmployerDto(savedEmployer);
        } else {
            throw new AppException("Invalid password", HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public void deleteEmployee(Long employeeId) {
        if (!employeeRepository.existsById(employeeId)) {
            throw new AppException("Employee not found with id: " + employeeId, HttpStatus.NOT_FOUND);
        }

        employeeRepository.deleteById(employeeId);
    }

    @Override
    public void deleteEmployer(Long employerId) {
        if (!employerRepository.existsById(employerId)) {
            throw new AppException("Employer not found with id: " + employerId, HttpStatus.NOT_FOUND);
        }

        employerRepository.deleteById(employerId);
    }

    @Override
    public void removeEmployeeFromEmployer(Long employeeId, Long employerId) {
        if (!employeeEmployerRepository.existsByEmployeeIdAndEmployerId(employeeId, employerId)) {
            throw new AppException("Employer not found with id: " + employerId, HttpStatus.NOT_FOUND);
        }
        employeeEmployerRepository.deleteByEmployeeIdAndEmployerId(employeeId, employerId);
    }
}
