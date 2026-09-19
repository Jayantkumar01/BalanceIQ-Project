package com.balanceiq.dashboard.service.impl;

import java.util.ArrayList;
import java.util.List;

import com.balanceiq.auth.entity.User;
import com.balanceiq.auth.repository.UserRepository;
import com.balanceiq.activity.entity.DailyCheckIn;
import com.balanceiq.activity.entity.WorkSession;
import com.balanceiq.activity.repository.DailyCheckInRepository;
import com.balanceiq.activity.repository.WorkSessionRepository;
import com.balanceiq.burnout.service.BurnoutService;
import com.balanceiq.dashboard.dto.DashboardResponse;
import com.balanceiq.dashboard.dto.EmployeeSummaryResponse;
import com.balanceiq.dashboard.dto.HighRiskEmployeeResponse;
import com.balanceiq.dashboard.dto.TeamSummaryResponse;
import com.balanceiq.dashboard.service.DashboardService;
import java.util.HashMap;
import java.util.Map;
import com.balanceiq.dashboard.dto.DepartmentSummaryResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.balanceiq.ai.service.impl.RecommendationServiceImpl;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private WorkSessionRepository workSessionRepository;

    @Autowired
    private DailyCheckInRepository dailyCheckInRepository;

    @Autowired
    private BurnoutService burnoutService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RecommendationServiceImpl recommendationService;

    private User getLoggedInUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }

    @Override
    public DashboardResponse getMyDashboard() {

        User user = getLoggedInUser();

        Long employeeId = user.getId();

        List<WorkSession> sessions =
                workSessionRepository.findByEmployeeId(employeeId);

        List<DailyCheckIn> checkIns =
                dailyCheckInRepository.findByEmployeeId(employeeId);

        double totalHoursWorked = sessions.stream()
                .mapToDouble(session ->
                        session.getTotalHours() == null
                                ? 0.0
                                : session.getTotalHours())
                .sum();

        double averageMood = checkIns.stream()
                .mapToInt(checkIn ->
                        checkIn.getMoodRating() == null
                                ? 0
                                : checkIn.getMoodRating())
                .average()
                .orElse(0.0);

        double averageFocus = checkIns.stream()
                .mapToInt(checkIn ->
                        checkIn.getFocusRating() == null
                                ? 0
                                : checkIn.getFocusRating())
                .average()
                .orElse(0.0);

        long totalCheckIns = checkIns.size();

        var burnoutResult =
                burnoutService.assessBurnout(employeeId);
        String aiRisk =
                recommendationService
                        .getRecommendations()
                        .getBurnoutRisk();

        return DashboardResponse.builder()
                .employeeId(employeeId)
                .totalHoursWorked(
                        Math.round(totalHoursWorked * 100.0) / 100.0)
                .averageMood(
                        Math.round(averageMood * 100.0) / 100.0)
                .averageFocus(
                        Math.round(averageFocus * 100.0) / 100.0)
                .totalCheckIns(totalCheckIns)
                .burnoutScore(burnoutResult.getBurnoutScore())
                .burnoutRisk(aiRisk)
                .build();
    }

    @Override
    public TeamSummaryResponse getTeamSummary() {

        List<User> users = userRepository.findAll();

        long totalEmployees = users.size();

        long highRiskEmployees = 0;

        double totalBurnout = 0.0;

        double totalWorkingHours = 0.0;

        for (User user : users) {

            var burnout =
                    burnoutService.assessBurnout(user.getId());

            totalBurnout += burnout.getBurnoutScore();

            String riskLevel =
                    recommendationService.getRiskLevelForEmployee(user.getId());

            if ("HIGH".equalsIgnoreCase(riskLevel)) {
                highRiskEmployees++;
            }

            List<WorkSession> sessions =
                    workSessionRepository.findByEmployeeId(user.getId());

            double hours = sessions.stream()
                    .mapToDouble(session ->
                            session.getTotalHours() == null
                                    ? 0.0
                                    : session.getTotalHours())
                    .average()
                    .orElse(0.0);

            totalWorkingHours += hours;
        }

        double averageBurnoutScore =
                totalEmployees == 0
                        ? 0.0
                        : totalBurnout / totalEmployees;

        double averageWorkingHours =
                totalEmployees == 0
                        ? 0.0
                        : totalWorkingHours / totalEmployees;

        return TeamSummaryResponse.builder()
                .totalEmployees(totalEmployees)
                .highRiskEmployees(highRiskEmployees)
                .averageBurnoutScore(
                        Math.round(averageBurnoutScore * 100.0) / 100.0)
                .averageWorkingHours(
                        Math.round(averageWorkingHours * 100.0) / 100.0)
                .build();
    }

    @Override
    public List<HighRiskEmployeeResponse> getHighRiskEmployees() {

        List<User> users =
                userRepository.findAll();

        List<HighRiskEmployeeResponse> result =
                new ArrayList<>();

        for (User user : users) {

            var burnout =
                    burnoutService.assessBurnout(user.getId());

            String riskLevel =
                    recommendationService.getRiskLevelForEmployee(user.getId());

            if ("HIGH".equalsIgnoreCase(riskLevel)) {

                result.add(
                        HighRiskEmployeeResponse.builder()
                                .employeeId(user.getId())
                                .name(user.getName())
                                .burnoutScore(
                                        burnout.getBurnoutScore())
                                .riskLevel(riskLevel)
                                .build()
                );
            }
        }

        return result;
    }
    @Override
    public List<EmployeeSummaryResponse> getAllEmployees() {

        List<User> users = userRepository.findAll();

        List<EmployeeSummaryResponse> result =
                new ArrayList<>();

        for (User user : users) {

            String riskLevel =
                    recommendationService.getRiskLevelForEmployee(user.getId());

            var burnout =
                    burnoutService.assessBurnout(user.getId());

            result.add(
                    EmployeeSummaryResponse.builder()
                            .employeeId(user.getId())
                            .name(user.getName())
                            .department(user.getDepartment())
                            .burnoutScore(
                                    burnout.getBurnoutScore())
                            .riskLevel(riskLevel)
                            .build()
            );
        }

        return result;
    }
    @Override
    public List<DepartmentSummaryResponse> getDepartmentSummary() {

        List<User> users = userRepository.findAll();

        Map<String, List<Double>> departmentData =
                new HashMap<>();

        for (User user : users) {

            var burnout =
                    burnoutService.assessBurnout(user.getId());

            departmentData
                    .computeIfAbsent(
                            user.getDepartment(),
                            k -> new ArrayList<>())
                    .add(burnout.getBurnoutScore());
        }

        List<DepartmentSummaryResponse> result =
                new ArrayList<>();

        for (Map.Entry<String, List<Double>> entry
                : departmentData.entrySet()) {

            double averageBurnout =
                    entry.getValue()
                            .stream()
                            .mapToDouble(Double::doubleValue)
                            .average()
                            .orElse(0.0);

            result.add(
                    DepartmentSummaryResponse.builder()
                            .department(entry.getKey())
                            .employeeCount(entry.getValue().size())
                            .averageBurnoutScore(
                                    Math.round(averageBurnout * 100.0) / 100.0)
                            .build()
            );
        }

        return result;
    }
}