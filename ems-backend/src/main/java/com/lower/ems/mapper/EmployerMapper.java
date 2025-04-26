package com.lower.ems.mapper;

import com.lower.ems.dto.EmployeeDto;
import com.lower.ems.dto.EmployerDto;
import com.lower.ems.entity.Employee;
import com.lower.ems.entity.Employer;

public class EmployerMapper {
    public static EmployerDto mapToEmployerDto(Employer employer){
        return new EmployerDto(
                employer.getId(),
                employer.getFirstName(),
                employer.getLastName(),
                employer.getEmail(),
                employer.getPassword(),
                employer.getEmployerName(),
                employer.getEmployeeEmployers()
        );
    }

    public static Employer mapToEmployer(EmployerDto employerDto){
        return new Employer(
                employerDto.getId(),
                employerDto.getFirstName(),
                employerDto.getLastName(),
                employerDto.getEmail(),
                employerDto.getPassword(),
                employerDto.getEmployerName(),
                employerDto.getEmployeeEmployers()
        );
    }
}
