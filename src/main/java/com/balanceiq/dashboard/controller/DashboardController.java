package com.balanceiq.dashboard.controller;

import com.balanceiq.dashboard.dto.*;
import com.balanceiq.dashboard.service.DashboardService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/me")
    public DashboardResponse getMyDashboard() {

        return dashboardService.getMyDashboard();
    }

    @GetMapping("/team-summary")
    public TeamSummaryResponse getTeamSummary() {

        return dashboardService.getTeamSummary();
    }

    @GetMapping("/high-risk-employees")
    public List<HighRiskEmployeeResponse>
    getHighRiskEmployees() {

        return dashboardService.getHighRiskEmployees();
    }

    @GetMapping("/employees")
    public List<EmployeeSummaryResponse> getAllEmployees() {

        return dashboardService.getAllEmployees();
    }

    @GetMapping("/department-summary")
    public List<DepartmentSummaryResponse> getDepartmentSummary() {

        return dashboardService.getDepartmentSummary();
    }
}