package com.balanceiq.activity.controller;

import com.balanceiq.activity.dto.DailyCheckInRequest;
import com.balanceiq.activity.dto.DailyCheckInResponse;
import com.balanceiq.activity.dto.SessionResponse;
import com.balanceiq.activity.entity.DailyCheckIn;
import com.balanceiq.activity.service.ActivityService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/activity")
public class ActivityController {

    @Autowired
    private ActivityService activityService;

    @PostMapping("/session/start")
    public SessionResponse startSession() {

        return activityService.startSession();
    }

    @PostMapping("/session/end")
    public SessionResponse endSession() {

        return activityService.endSession();
    }

    @PostMapping("/checkin")
    public DailyCheckInResponse submitDailyCheckIn(
            @RequestBody DailyCheckInRequest request) {

        return activityService.submitDailyCheckIn(request);
    }

    @GetMapping("/checkin/history")
    public List<DailyCheckIn> getMyCheckIns() {

        return activityService.getMyCheckIns();
    }
}