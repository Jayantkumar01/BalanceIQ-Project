package com.balanceiq.ai.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.balanceiq.auth.entity.User;
import com.balanceiq.auth.repository.UserRepository;
import com.balanceiq.burnout.dto.BurnoutResponse;
import com.balanceiq.burnout.service.BurnoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.balanceiq.ai.dto.RecommendationResponse;
import com.balanceiq.ai.service.RecommendationService;
import com.balanceiq.activity.entity.DailyCheckIn;
import com.balanceiq.activity.entity.WorkSession;
import com.balanceiq.activity.repository.DailyCheckInRepository;
import com.balanceiq.activity.repository.WorkSessionRepository;

@Service
public class RecommendationServiceImpl
        implements RecommendationService {

    @Autowired
    private BurnoutService burnoutService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DailyCheckInRepository dailyCheckInRepository;

    @Autowired
    private WorkSessionRepository workSessionRepository;

    private User getLoggedInUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email =
                authentication.getName();

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"));
    }

    @Override
    public RecommendationResponse getRecommendations() {

        User user =
                getLoggedInUser();

        Long employeeId =
                user.getId();

        BurnoutResponse burnout =
                burnoutService
                        .assessBurnout(employeeId);

        String riskLevel;
        DailyCheckIn latestCheckIn = null;
        double totalHours = 0;

        try {

            RestTemplate restTemplate =
                    new RestTemplate();

            Map<String, Object> request =
                    new HashMap<>();

            latestCheckIn =
                    dailyCheckInRepository
                            .findTopByEmployeeIdOrderByWorkDateDesc(
                                    employeeId
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "No check-in found"
                                    ));

            List<WorkSession> sessions =
                    workSessionRepository
                            .findByEmployeeId(
                                    employeeId
                            );

            totalHours =
                    sessions.stream()
                            .mapToDouble(
                                    session ->
                                            session.getTotalHours() == null
                                                    ? 0
                                                    : session.getTotalHours()
                            )
                            .sum();

            request.put(
                    "hoursWorked",
                    totalHours
            );

            request.put(
                    "mood",
                    latestCheckIn.getMoodRating()
            );

            request.put(
                    "focus",
                    latestCheckIn.getFocusRating()
            );

            request.put(
                    "meetingHours",
                    latestCheckIn.getMeetingHours()
            );

            request.put(
                    "tasksCompleted",
                    latestCheckIn.getTasksCompleted()
            );


            HttpHeaders headers =
                    new HttpHeaders();

            headers.setContentType(
                    MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>>
                    entity =
                    new HttpEntity<>(
                            request,
                            headers
                    );

            ResponseEntity<Map> response =
                    restTemplate.postForEntity(
                            "http://localhost:5001/predict",
                            entity,
                            Map.class
                    );

            riskLevel =
                    response.getBody()
                            .get("risk")
                            .toString();

        } catch (Exception e) {

            riskLevel =
                    burnout.getRiskLevel();

            System.out.println(
                    "ML Server not available. Using fallback."
            );
        }

        List<String> recommendations =
                new ArrayList<>();

        try {
            RestTemplate restTemplate =
                    new RestTemplate();

            Map<String, Object> request =
                    new HashMap<>();

            request.put(
                    "risk",
                    riskLevel
            );

            request.put(
                    "mood",
                    latestCheckIn.getMoodRating()
            );

            request.put(
                    "focus",
                    latestCheckIn.getFocusRating()
            );

            request.put(
                    "meetingHours",
                    latestCheckIn.getMeetingHours()
            );

            request.put(
                    "tasksCompleted",
                    latestCheckIn.getTasksCompleted()
            );

            request.put(
                    "hoursWorked",
                    totalHours
            );
            System.out.println("\n===== CALLING FLASK =====");
            System.out.println("URL = http://localhost:5001/recommend");
            System.out.println("REQUEST = " + request);
            ResponseEntity<Map> response =
                    restTemplate.postForEntity(
                            "http://localhost:5001/recommend",
                            request,
                            Map.class
                    );
            System.out.println("FLASK RESPONSE = " + response.getBody());


            String aiRecommendation =
                    response.getBody()
                            .get("recommendation")
                            .toString();

            recommendations.add(
                    aiRecommendation
            );
        }
        catch (Exception e) {

            System.out.println("\n===== RECOMMENDATION ERROR =====");
            e.printStackTrace();
            System.out.println("================================");

            recommendations.add(
                    "Unable to generate AI recommendation."
            );
        }
        return RecommendationResponse
                .builder()
                .employeeId(employeeId)
                .burnoutRisk(riskLevel)
                .recommendations(recommendations)
                .build();
    }
    public String getRiskLevelForEmployee(Long employeeId) {
        try {

            DailyCheckIn latestCheckIn =
                    dailyCheckInRepository
                            .findTopByEmployeeIdOrderByWorkDateDesc(employeeId)
                            .orElseThrow();

            List<WorkSession> sessions =
                    workSessionRepository.findByEmployeeId(employeeId);

            double totalHours =
                    sessions.stream()
                            .mapToDouble(s ->
                                    s.getTotalHours() == null ? 0 : s.getTotalHours())
                            .sum();

            RestTemplate restTemplate = new RestTemplate();

            Map<String, Object> request = new HashMap<>();
            request.put("hoursWorked", totalHours);
            request.put("mood", latestCheckIn.getMoodRating());
            request.put("focus", latestCheckIn.getFocusRating());
            request.put("meetingHours", latestCheckIn.getMeetingHours());
            request.put("tasksCompleted", latestCheckIn.getTasksCompleted());

            ResponseEntity<Map> response =
                    restTemplate.postForEntity(
                            "http://localhost:5001/predict",
                            request,
                            Map.class
                    );

            return response.getBody().get("risk").toString();

        } catch (Exception e) {

            return burnoutService
                    .assessBurnout(employeeId)
                    .getRiskLevel();
        }
    }

}