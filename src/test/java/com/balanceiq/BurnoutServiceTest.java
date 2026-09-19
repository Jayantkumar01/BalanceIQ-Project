package com.balanceiq;

import com.balanceiq.burnout.dto.BurnoutResponse;
import com.balanceiq.burnout.service.BurnoutService;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class BurnoutServiceTest {

    private final BurnoutService burnoutService =
            mock(BurnoutService.class);

    @Test
    void testAssessBurnout() {

        BurnoutResponse response =
                BurnoutResponse.builder()
                        .employeeId(1L)
                        .burnoutScore(85.0)
                        .riskLevel("HIGH")
                        .recommendation("Take a break")
                        .build();

        when(burnoutService.assessBurnout(1L))
                .thenReturn(response);

        BurnoutResponse result =
                burnoutService.assessBurnout(1L);

        assertEquals(
                "HIGH",
                result.getRiskLevel()
        );
    }
}