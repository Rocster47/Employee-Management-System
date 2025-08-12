package com.lower.ems.dto;

import com.lower.ems.entity.EmployeeEmployer;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private List<EmployeeEmployer> employeeEmployers;

    public EmployeeDto withoutSensitiveData() {
        this.password = null;
        this.employeeEmployers = null;
        return this;
    }
}
