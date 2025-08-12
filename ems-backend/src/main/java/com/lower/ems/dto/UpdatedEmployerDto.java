package com.lower.ems.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdatedEmployerDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String newPassword;
    private String employerName;
}
