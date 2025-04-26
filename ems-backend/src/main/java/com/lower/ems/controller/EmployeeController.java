package com.lower.ems.controller;

import com.lower.ems.config.UserAuthProvider;
import com.lower.ems.dto.*;
import com.lower.ems.exception.AppException;
import com.lower.ems.service.EmployeeService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.Duration;
import java.time.Instant;
import java.util.List;

@CrossOrigin("*")
@AllArgsConstructor
@RestController
@RequestMapping("/api")
public class EmployeeController {

    private EmployeeService employeeService;

    private UserAuthProvider userAuthenticationProvider;

    @GetMapping("/test-secure")
    public String testSecureConnection() {
        return "HTTPS connection is secure! You're connected to the secure API endpoint.";
    }

    @GetMapping("/validate")
    public ResponseEntity<String> auth(@CookieValue("jwt") String jwt) {
        return ResponseEntity.ok(userAuthenticationProvider.getRole(jwt));
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .sameSite("Strict")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("Logged out successfully.");
    }

    @PostMapping("/employees/register")
    public ResponseEntity<EmployeeDto> registerEmployee(@RequestBody EmployeeDto employeeDto) {
        EmployeeDto savedEmployee = employeeService.registerEmployee(employeeDto);
        String jwt = userAuthenticationProvider.createToken(savedEmployee.getEmail(), savedEmployee.getId(), savedEmployee.getFirstName(), savedEmployee.getLastName(), "null", "employee");

        ResponseCookie cookie = generateJwtCookie(jwt);

        return ResponseEntity.created(URI.create("/employees/" + savedEmployee.getId()))
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(savedEmployee.withoutSensitiveData());
    }

    @PostMapping("/employers/register")
    public ResponseEntity<EmployerDto> registerEmployer(@RequestBody EmployerDto employerDto) {
        EmployerDto savedEmployer = employeeService.registerEmployer(employerDto);
        String jwt = userAuthenticationProvider.createToken(savedEmployer.getEmail(), savedEmployer.getId(), savedEmployer.getFirstName(), savedEmployer.getLastName(), savedEmployer.getEmployerName(), "employer");

        ResponseCookie cookie = generateJwtCookie(jwt);

        return ResponseEntity.created(URI.create("/employers/" + savedEmployer.getId()))
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(savedEmployer.withoutSensitiveData());
    }

    @PostMapping("/employees/login")
    public ResponseEntity<EmployeeDto> loginEmployee(@RequestBody CredentialsDto credentialsDto) {
        EmployeeDto employeeDto = employeeService.loginEmployee(credentialsDto);
        String jwt = userAuthenticationProvider.createToken(employeeDto.getEmail(), employeeDto.getId(), employeeDto.getFirstName(), employeeDto.getLastName(), "null", "employee");

        ResponseCookie cookie = generateJwtCookie(jwt);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(employeeDto.withoutSensitiveData());
    }

    @PostMapping("/employers/login")
    public ResponseEntity<EmployerDto> loginEmployer(@RequestBody CredentialsDto credentialsDto) {
        EmployerDto employerDto = employeeService.loginEmployer(credentialsDto);
        String jwt = userAuthenticationProvider.createToken(employerDto.getEmail(), employerDto.getId(), employerDto.getFirstName(), employerDto.getLastName(), employerDto.getEmployerName(), "employer");

        ResponseCookie cookie = generateJwtCookie(jwt);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(employerDto.withoutSensitiveData());
    }

    private ResponseCookie generateJwtCookie(String jwt) {
        Instant expiration = userAuthenticationProvider.getExpiration(jwt);
        long maxAge = Duration.between(Instant.now(), expiration).getSeconds();

        return ResponseCookie.from("jwt", jwt)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(maxAge)
                .sameSite("Strict")
                .build();
    }

    // Create Employee
    @PostMapping("/employers/manage/{email}")
    public ResponseEntity<String> addEmployee(@PathVariable("email") String email, @CookieValue("jwt") String jwt) {
        EmployeeEmployerDto savedEmployeeEmployer = employeeService.addEmployee(email, userAuthenticationProvider.getUserId(jwt));
        return ResponseEntity.created(URI.create("/employee-employers/" + savedEmployeeEmployer.getId()))
                .body("Added employee to employer.");
    }

    // Getting employers using employee ID.
    @GetMapping("/employers/get")
    public ResponseEntity<List<EmployerDto>> getEmployersByEmployeeId(@CookieValue("jwt") String jwt) {
        List<EmployerDto> employers = employeeService.getEmployersByEmployeeId(userAuthenticationProvider.getUserId(jwt));
        return ResponseEntity.ok(employers);
    }

    // Getting employees using employer ID.
    @GetMapping({"/employees/get/", "/employees/get/{empId}"})
    public ResponseEntity<List<EmployeeDto>> getEmployeesByEmployerId(@PathVariable(value = "empId", required = false) Long empId, @CookieValue("jwt") String jwt) {
        Long param;

        if (userAuthenticationProvider.getRole(jwt).equals("employer")) {
            param = userAuthenticationProvider.getUserId(jwt);
        } else {
            param = empId;
        }

        List<EmployeeDto> employees = employeeService.getEmployeesByEmployerId(param);
        return ResponseEntity.ok(employees);
    }

    // Getting employee using their ID - used in updating data etc.
    @GetMapping("/employees")
    public ResponseEntity<EmployeeDto> getEmployeeById(@CookieValue("jwt") String jwt) {
        EmployeeDto employeeDto = employeeService.getEmployeeById(userAuthenticationProvider.getUserId(jwt));
        return ResponseEntity.ok(employeeDto.withoutSensitiveData());
    }

    // Getting employer using their ID - used in updating data etc.
    @GetMapping({"/get/employer/{id}", "/get/employer/"})
    public ResponseEntity<EmployerDto> getEmployerById(@PathVariable(value = "id", required = false) Long empId, @CookieValue("jwt") String jwt) {
        Long param;

        if (userAuthenticationProvider.getRole(jwt).equals("employer")) {
            param = userAuthenticationProvider.getUserId(jwt);
        } else {
            param = empId;
        }

        EmployerDto employerDto = employeeService.getEmployerById(param);
        return ResponseEntity.ok(employerDto.withoutSensitiveData());
    }

    // Update employee by ID.
    @PutMapping("/employees")
    public ResponseEntity<EmployeeDto> updateEmployee(@CookieValue("jwt") String jwt,
                                                      @RequestBody UpdatedEmployeeDto updatedEmployee) {
        EmployeeDto updated = employeeService.updateEmployee(userAuthenticationProvider.getUserId(jwt), updatedEmployee);
        return ResponseEntity.ok(updated.withoutSensitiveData());
    }

    // Update employer by ID.
    @PutMapping("/employers")
    public ResponseEntity<EmployerDto> updateEmployer(@CookieValue("jwt") String jwt,
                                                   @RequestBody UpdatedEmployerDto updatedEmployer) {
        EmployerDto updated = employeeService.updateEmployer(userAuthenticationProvider.getUserId(jwt), updatedEmployer);
        return ResponseEntity.ok(updated.withoutSensitiveData());
    }

    // Delete employee by ID. (Deletes junction table entries too)
    @DeleteMapping("/employees")
    public ResponseEntity<String> deleteEmployee(@CookieValue("jwt") String jwt) {
        employeeService.deleteEmployee(userAuthenticationProvider.getUserId(jwt));
        return ResponseEntity.ok("Employee deleted successfully.");
    }

    // Delete employer by ID. (Deletes junction table entries too)
    @DeleteMapping("/employers")
    public ResponseEntity<String> deleteEmployer(@CookieValue("jwt") String jwt) {
        employeeService.deleteEmployer(userAuthenticationProvider.getUserId(jwt));
        return ResponseEntity.ok("Employer deleted successfully.");
    }

    @DeleteMapping("/employers/employees/{id}")
    public ResponseEntity<String> removeEmployeeFromEmployer(@PathVariable("id") Long id, @CookieValue("jwt") String jwt) {
        Long employeeId;
        Long employerId;

        if (userAuthenticationProvider.getRole(jwt).equals("employee")) {
            employeeId = userAuthenticationProvider.getUserId(jwt);
            employerId = id;
        } else {
            employeeId = id;
            employerId = userAuthenticationProvider.getUserId(jwt);
        }

        employeeService.removeEmployeeFromEmployer(employeeId, employerId);
        return ResponseEntity.ok("Employee removed from employer successfully.");
    }
}
