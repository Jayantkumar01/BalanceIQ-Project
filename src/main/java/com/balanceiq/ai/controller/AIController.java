package com.balanceiq.ai.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.balanceiq.ai.dto.RecommendationResponse;
import com.balanceiq.ai.service.RecommendationService;

@RestController
@RequestMapping("/ai")
public class AIController {

    @Autowired
    private RecommendationService recommendationService;

    @GetMapping("/recommendations/me")
    public RecommendationResponse getRecommendations() {

        return recommendationService
                .getRecommendations();
    }
}