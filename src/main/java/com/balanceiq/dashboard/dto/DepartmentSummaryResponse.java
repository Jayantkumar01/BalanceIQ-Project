package com.balanceiq.dashboard.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DepartmentSummaryResponse {

    private String department;
    private long employeeCount;
    private double averageBurnoutScore;
}