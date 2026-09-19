package com.balanceiq.dashboard.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class HighRiskEmployeeResponse {

    private Long employeeId;
    private String name;
    private Double burnoutScore;
    private String riskLevel;
}