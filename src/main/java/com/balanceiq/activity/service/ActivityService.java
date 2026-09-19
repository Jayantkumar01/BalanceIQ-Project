package com.balanceiq.activity.service;

import java.util.List;

import com.balanceiq.activity.dto.DailyCheckInRequest;
import com.balanceiq.activity.dto.DailyCheckInResponse;
import com.balanceiq.activity.dto.SessionResponse;
import com.balanceiq.activity.entity.DailyCheckIn;

public interface ActivityService {

    SessionResponse startSession();

    SessionResponse endSession();

    DailyCheckInResponse submitDailyCheckIn(
            DailyCheckInRequest request);

    List<DailyCheckIn> getMyCheckIns();
}