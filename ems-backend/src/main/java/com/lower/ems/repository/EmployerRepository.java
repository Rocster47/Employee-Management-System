package com.lower.ems.repository;

import com.lower.ems.entity.Employee;
import com.lower.ems.entity.Employer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface EmployerRepository extends JpaRepository<Employer, Long>{
    Optional<Employer> findByEmail(String email);
}