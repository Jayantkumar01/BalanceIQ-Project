package com.balanceiq.ai.service;

import com.balanceiq.ai.dto.RecommendationResponse;

public interface RecommendationService {

    RecommendationResponse getRecommendations();
    String getRiskLevelForEmployee(Long employeeId);
}