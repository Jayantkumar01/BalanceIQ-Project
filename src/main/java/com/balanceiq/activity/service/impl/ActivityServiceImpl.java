package com.balanceiq.activity.service.impl;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.balanceiq.activity.dto.DailyCheckInRequest;
import com.balanceiq.activity.dto.DailyCheckInResponse;
import com.balanceiq.activity.dto.SessionResponse;
import com.balanceiq.activity.entity.DailyCheckIn;
import com.balanceiq.activity.entity.WorkSession;
import com.balanceiq.activity.repository.DailyCheckInRepository;
import com.balanceiq.activity.repository.WorkSessionRepository;
import com.balanceiq.activity.service.ActivityService;
import com.balanceiq.auth.entity.User;
import com.balanceiq.auth.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class ActivityServiceImpl implements ActivityService {

    @Autowired
    private WorkSessionRepository workSessionRepository;

    @Autowired
    private DailyCheckInRepository dailyCheckInRepository;

    @Autowired
    private UserRepository userRepository;

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
    public SessionResponse startSession() {

        User user = getLoggedInUser();

        if (workSessionRepository
                .findTopByEmployeeIdAndLogoutTimeIsNull(user.getId())
                .isPresent()) {

            throw new RuntimeException(
                    "Employee already has an active session");
        }

        WorkSession session = WorkSession.builder()
                .employeeId(user.getId())
                .loginTime(LocalDateTime.now())
                .workDate(LocalDate.now())
                .build();

        workSessionRepository.save(session);

        return SessionResponse.builder()
                .message("Session started successfully")
                .build();
    }

    @Override
    public SessionResponse endSession() {

        User user = getLoggedInUser();

        WorkSession session = workSessionRepository
                .findTopByEmployeeIdAndLogoutTimeIsNull(user.getId())
                .orElseThrow(() ->
                        new RuntimeException("No active session found"));

        session.setLogoutTime(LocalDateTime.now());

        double totalHours = Duration.between(
                        session.getLoginTime(),
                        session.getLogoutTime())
                .toMinutes() / 60.0;

        session.setTotalHours(totalHours);

        workSessionRepository.save(session);

        return SessionResponse.builder()
                .message("Session ended successfully")
                .build();
    }

    @Override
    public DailyCheckInResponse submitDailyCheckIn(
            DailyCheckInRequest request) {

        User user = getLoggedInUser();

        DailyCheckIn dailyCheckIn = DailyCheckIn.builder()
                .employeeId(user.getId())
                .workDate(LocalDate.now())
                .moodRating(request.getMoodRating())
                .focusRating(request.getFocusRating())
                .tasksCompleted(request.getTasksCompleted())
                .meetingHours(request.getMeetingHours())
                .remarks(request.getRemarks())
                .build();

        dailyCheckInRepository.save(dailyCheckIn);

        return DailyCheckInResponse.builder()
                .message("Daily check-in submitted successfully")
                .build();
    }

    @Override
    public List<DailyCheckIn> getMyCheckIns() {

        User user = getLoggedInUser();

        return dailyCheckInRepository
                .findByEmployeeId(user.getId());
    }
}