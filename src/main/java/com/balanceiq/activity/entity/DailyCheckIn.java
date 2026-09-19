package com.balanceiq.activity.entity;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "daily_checkins")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyCheckIn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long employeeId;

    private LocalDate workDate;

    private Integer moodRating;

    private Integer focusRating;

    private Integer tasksCompleted;

    private Integer meetingHours;

    private String remarks;
}