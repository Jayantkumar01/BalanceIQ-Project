package com.balanceiq.activity.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DailyCheckInRequest {

    @NotNull(message = "Mood rating is required")
    @Min(value = 1, message = "Mood rating must be between 1 and 10")
    @Max(value = 10, message = "Mood rating must be between 1 and 10")
    private Integer moodRating;

    @NotNull(message = "Focus rating is required")
    @Min(value = 1, message = "Focus rating must be between 1 and 10")
    @Max(value = 10, message = "Focus rating must be between 1 and 10")
    private Integer focusRating;

    @NotNull(message = "Tasks completed is required")
    @Min(value = 0, message = "Tasks completed cannot be negative")
    private Integer tasksCompleted;

    @NotNull(message = "Meeting hours is required")
    @Min(value = 0, message = "Meeting hours cannot be negative")
    private Integer meetingHours;

    private String remarks;
}