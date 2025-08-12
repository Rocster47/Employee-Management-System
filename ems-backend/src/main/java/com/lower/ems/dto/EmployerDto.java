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
public class EmployerDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String employerName;
    private List<EmployeeEmployer> employeeEmployers;

    public EmployerDto withoutSensitiveData() {
        this.password = null;
        this.employeeEmployers = null;
        return this;
    }
}
