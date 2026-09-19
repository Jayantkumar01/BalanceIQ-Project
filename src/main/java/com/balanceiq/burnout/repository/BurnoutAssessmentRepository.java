package com.balanceiq.burnout.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.balanceiq.burnout.entity.BurnoutAssessment;

public interface BurnoutAssessmentRepository
        extends JpaRepository<BurnoutAssessment, Long> {

    List<BurnoutAssessment> findByEmployeeId(Long employeeId);

    List<BurnoutAssessment> findByRiskLevel(String riskLevel);
}