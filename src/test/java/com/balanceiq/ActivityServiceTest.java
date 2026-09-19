package com.balanceiq;

import com.balanceiq.activity.dto.SessionResponse;
import com.balanceiq.activity.service.ActivityService;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ActivityServiceTest {

    private final ActivityService activityService =
            mock(ActivityService.class);

    @Test
    void testStartSession() {

        SessionResponse response =
                SessionResponse.builder()
                        .message("Session Started")
                        .build();

        when(activityService.startSession())
                .thenReturn(response);

        SessionResponse result =
                activityService.startSession();

        assertEquals(
                "Session Started",
                result.getMessage()
        );
    }

    @Test
    void testEndSession() {

        SessionResponse response =
                SessionResponse.builder()
                        .message("Session Ended")
                        .build();

        when(activityService.endSession())
                .thenReturn(response);

        SessionResponse result =
                activityService.endSession();

        assertEquals(
                "Session Ended",
                result.getMessage()
        );
    }
}