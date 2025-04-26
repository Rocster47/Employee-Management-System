package com.lower.ems.dto;

import com.lower.ems.entity.Employee;
import com.lower.ems.entity.Employer;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeEmployerDto {
    Long Id;
    Employee employee;
    Employer employer;
}
