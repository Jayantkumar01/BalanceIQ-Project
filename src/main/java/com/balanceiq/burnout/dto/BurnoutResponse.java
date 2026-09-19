package com.balanceiq.burnout.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BurnoutResponse {

    private Long employeeId;
    private Double burnoutScore;
    private String riskLevel;
    private String recommendation;
}