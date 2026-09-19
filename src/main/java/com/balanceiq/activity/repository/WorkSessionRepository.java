package com.balanceiq.activity.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.balanceiq.activity.entity.WorkSession;

public interface WorkSessionRepository
        extends JpaRepository<WorkSession, Long> {

    List<WorkSession>
    findByEmployeeId(Long employeeId);

    Optional<WorkSession>
    findTopByEmployeeIdAndLogoutTimeIsNull(
            Long employeeId
    );
}