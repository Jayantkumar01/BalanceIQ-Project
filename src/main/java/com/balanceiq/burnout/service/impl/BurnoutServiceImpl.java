package com.balanceiq.burnout.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.balanceiq.activity.entity.DailyCheckIn;
import com.balanceiq.activity.entity.WorkSession;
import com.balanceiq.activity.repository.DailyCheckInRepository;
import com.balanceiq.activity.repository.WorkSessionRepository;
import com.balanceiq.burnout.dto.BurnoutResponse;
import com.balanceiq.burnout.service.BurnoutService;

@Service
public class BurnoutServiceImpl implements BurnoutService {

    @Autowired
    private WorkSessionRepository workSessionRepository;

    @Autowired
    private DailyCheckInRepository dailyCheckInRepository;

    @Override
    public BurnoutResponse assessBurnout(Long employeeId) {

        List<WorkSession> sessions =
                workSessionRepository.findByEmployeeId(employeeId);

        List<DailyCheckIn> checkIns =
                dailyCheckInRepository.findByEmployeeId(employeeId);

        double avgHours = 0.0;

        if (!sessions.isEmpty()) {

            double totalHours = sessions.stream()
                    .mapToDouble(session ->
                            session.getTotalHours() == null
                                    ? 0.0
                                    : session.getTotalHours())
                    .sum();

            avgHours = totalHours / sessions.size();
        }

        double avgMood = 5.0;
        double avgFocus = 5.0;
        double avgMeetingHours = 0.0;

        if (!checkIns.isEmpty()) {

            avgMood = checkIns.stream()
                    .mapToInt(checkIn ->
                            checkIn.getMoodRating() == null
                                    ? 0
                                    : checkIn.getMoodRating())
                    .average()
                    .orElse(5.0);

            avgFocus = checkIns.stream()
                    .mapToInt(checkIn ->
                            checkIn.getFocusRating() == null
                                    ? 0
                                    : checkIn.getFocusRating())
                    .average()
                    .orElse(5.0);

            avgMeetingHours = checkIns.stream()
                    .mapToInt(checkIn ->
                            checkIn.getMeetingHours() == null
                                    ? 0
                                    : checkIn.getMeetingHours())
                    .average()
                    .orElse(0.0);
        }

        double burnoutScore = 0;

        burnoutScore += avgHours * 4;
        burnoutScore += avgMeetingHours * 3;
        burnoutScore += (10 - avgMood) * 5;
        burnoutScore += (10 - avgFocus) * 5;

        String riskLevel;
        String recommendation;

        if (burnoutScore >= 70) {
            riskLevel = "HIGH";
            recommendation =
                    "Take immediate breaks, reduce workload and consult manager.";
        } else if (burnoutScore >= 40) {
            riskLevel = "MEDIUM";
            recommendation =
                    "Maintain work-life balance and monitor stress levels.";
        } else {
            riskLevel = "LOW";
            recommendation =
                    "Keep following healthy work habits.";
        }

        return BurnoutResponse.builder()
                .employeeId(employeeId)
                .burnoutScore(Math.round(burnoutScore * 100.0) / 100.0)
                .riskLevel(riskLevel)
                .recommendation(recommendation)
                .build();
    }
}