package com.lower.ems.repository;

import com.lower.ems.entity.Employer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface EmployerRepository extends JpaRepository<Employer, Long>{
    Optional<Employer> findByEmail(String email);

    @Query(value = "SELECT 1", nativeQuery = true)
    Integer pingDatabase();
}