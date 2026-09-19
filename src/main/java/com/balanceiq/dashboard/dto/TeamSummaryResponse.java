package com.balanceiq.dashboard.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TeamSummaryResponse {

    private Long totalEmployees;

    private Long highRiskEmployees;

    private Double averageBurnoutScore;

    private Double averageWorkingHours;
}