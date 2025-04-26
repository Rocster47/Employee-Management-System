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
public class UpdatedEmployeeDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String newPassword;
}
