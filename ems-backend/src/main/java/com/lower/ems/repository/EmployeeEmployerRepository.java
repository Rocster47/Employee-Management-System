package com.lower.ems.repository;

import com.lower.ems.entity.EmployeeEmployer;
import com.lower.ems.entity.Employer;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface EmployeeEmployerRepository extends JpaRepository<EmployeeEmployer, Long> {
    List<EmployeeEmployer> findByEmployeeId(Long employeeId);
    List<EmployeeEmployer> findByEmployerId(Long employerId);
    Optional<EmployeeEmployer> findByEmployeeIdAndEmployerId(Long employeeId, Long employerId);

    @Modifying
    @Transactional
    @Query("DELETE FROM EmployeeEmployer ee WHERE ee.employee.id = :employeeId AND ee.employer.id = :employerId")
    void deleteByEmployeeIdAndEmployerId(@Param("employeeId") Long employeeId, @Param("employerId") Long employerId);

    boolean existsByEmployeeIdAndEmployerId(Long employeeId, Long employerId);
}
