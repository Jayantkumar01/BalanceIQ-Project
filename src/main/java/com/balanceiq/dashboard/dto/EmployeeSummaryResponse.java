package com.balanceiq.dashboard.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EmployeeSummaryResponse {

    private Long employeeId;
    private String name;
    private String department;
    private double burnoutScore;
    private String riskLevel;
}