package com.balanceiq;

import com.balanceiq.dashboard.dto.*;
import com.balanceiq.dashboard.service.DashboardService;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class DashboardServiceTest {

    private final DashboardService dashboardService =
            mock(DashboardService.class);

    @Test
    void testGetMyDashboard() {

        DashboardResponse response =
                DashboardResponse.builder()
                        .employeeId(1L)
                        .totalHoursWorked(45.5)
                        .averageMood(4.2)
                        .averageFocus(4.5)
                        .totalCheckIns(10)
                        .burnoutScore(25.0)
                        .burnoutRisk("LOW")
                        .build();

        when(dashboardService.getMyDashboard())
                .thenReturn(response);

        DashboardResponse result =
                dashboardService.getMyDashboard();

        assertEquals(1L, result.getEmployeeId());
        assertEquals("LOW", result.getBurnoutRisk());
    }

    @Test
    void testGetTeamSummary() {

        TeamSummaryResponse response =
                TeamSummaryResponse.builder()
                        .totalEmployees(20L)
                        .highRiskEmployees(3L)
                        .averageBurnoutScore(42.5)
                        .averageWorkingHours(8.2)
                        .build();

        when(dashboardService.getTeamSummary())
                .thenReturn(response);

        TeamSummaryResponse result =
                dashboardService.getTeamSummary();

        assertEquals(20L, result.getTotalEmployees());
        assertEquals(3L, result.getHighRiskEmployees());
    }

    @Test
    void testGetHighRiskEmployees() {

        HighRiskEmployeeResponse employee =
                HighRiskEmployeeResponse.builder()
                        .employeeId(101L)
                        .name("John")
                        .burnoutScore(85.0)
                        .riskLevel("HIGH")
                        .build();

        when(dashboardService.getHighRiskEmployees())
                .thenReturn(List.of(employee));

        List<HighRiskEmployeeResponse> result =
                dashboardService.getHighRiskEmployees();

        assertEquals(1, result.size());
        assertEquals("HIGH", result.get(0).getRiskLevel());
    }

    @Test
    void testGetAllEmployees() {

        EmployeeSummaryResponse employee =
                EmployeeSummaryResponse.builder()
                        .employeeId(1L)
                        .name("Vaishali")
                        .department("IT")
                        .burnoutScore(20.0)
                        .riskLevel("LOW")
                        .build();

        when(dashboardService.getAllEmployees())
                .thenReturn(List.of(employee));

        List<EmployeeSummaryResponse> result =
                dashboardService.getAllEmployees();

        assertEquals(1, result.size());
        assertEquals("IT", result.get(0).getDepartment());
    }

    @Test
    void testGetDepartmentSummary() {

        DepartmentSummaryResponse department =
                DepartmentSummaryResponse.builder()
                        .department("IT")
                        .employeeCount(15)
                        .averageBurnoutScore(35.0)
                        .build();

        when(dashboardService.getDepartmentSummary())
                .thenReturn(List.of(department));

        List<DepartmentSummaryResponse> result =
                dashboardService.getDepartmentSummary();

        assertEquals(1, result.size());
        assertEquals("IT", result.get(0).getDepartment());
    }
}