package com.lower.ems.service;

import com.lower.ems.repository.EmployerRepository;
import lombok.AllArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ScheduledService {

    private final EmployerRepository employerRepository;

    @Scheduled(fixedDelay = 3_600_000)
    public void keepDatabaseAlive() {
        employerRepository.pingDatabase();
        System.out.println("Pinged Database");
    }
}
