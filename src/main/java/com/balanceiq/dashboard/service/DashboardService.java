package com.balanceiq.dashboard.service;

import java.util.List;

import com.balanceiq.dashboard.dto.*;

public interface DashboardService {

    DashboardResponse getMyDashboard();

    TeamSummaryResponse getTeamSummary();

    List<HighRiskEmployeeResponse> getHighRiskEmployees();

    List<EmployeeSummaryResponse> getAllEmployees();

    List<DepartmentSummaryResponse> getDepartmentSummary();
}