package com.balanceiq.ai.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class RecommendationResponse {

    private Long employeeId;

    private String burnoutRisk;

    private List<String> recommendations;
}