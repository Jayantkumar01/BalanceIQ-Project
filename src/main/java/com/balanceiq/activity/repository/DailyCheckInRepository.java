package com.balanceiq.activity.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.balanceiq.activity.entity.DailyCheckIn;

public interface DailyCheckInRepository
        extends JpaRepository<DailyCheckIn, Long> {

    List<DailyCheckIn> findByEmployeeId(Long employeeId);

    Optional<DailyCheckIn>
    findTopByEmployeeIdOrderByWorkDateDesc(
            Long employeeId
    );
}