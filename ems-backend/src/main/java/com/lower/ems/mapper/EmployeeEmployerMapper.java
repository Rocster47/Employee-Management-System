package com.lower.ems.mapper;

import com.lower.ems.dto.EmployeeEmployerDto;
import com.lower.ems.entity.EmployeeEmployer;

public class EmployeeEmployerMapper {

    public static EmployeeEmployerDto mapToEmployeeEmployerDto(EmployeeEmployer employeeEmployer){
        return new EmployeeEmployerDto(
                employeeEmployer.getId(),
                employeeEmployer.getEmployee(),
                employeeEmployer.getEmployer()
        );
    }

    public static EmployeeEmployer mapToEmployeeEmployer(EmployeeEmployerDto employeeEmployerDto){
        return new EmployeeEmployer(
                employeeEmployerDto.getId(),
                employeeEmployerDto.getEmployee(),
                employeeEmployerDto.getEmployer()
        );
    }
}