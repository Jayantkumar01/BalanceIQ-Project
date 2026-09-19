package com.balanceiq.dashboard.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class DashboardResponse {

    private Long employeeId;

    private double totalHoursWorked;

    private double averageMood;

    private double averageFocus;

    private long totalCheckIns;

    private double burnoutScore;

    private String burnoutRisk;
}