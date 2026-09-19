package com.balanceiq;

import com.balanceiq.auth.dto.*;
import com.balanceiq.auth.service.AuthService;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class AuthServiceTest {

    private final AuthService authService =
            mock(AuthService.class);

    @Test
    void testLoginSuccess() {

        LoginRequest request = mock(LoginRequest.class);

        LoginResponse response =
                LoginResponse.builder()
                        .token("jwt-token")
                        .email("test@gmail.com")
                        .role("EMPLOYEE")
                        .build();

        when(authService.login(request))
                .thenReturn(response);

        LoginResponse result =
                authService.login(request);

        assertNotNull(result);
        assertEquals("jwt-token",
                result.getToken());
    }

    @Test
    void testGetCurrentUser() {

        UserProfileResponse response =
                UserProfileResponse.builder()
                        .id(1L)
                        .name("Vaishali")
                        .email("test@gmail.com")
                        .role("EMPLOYEE")
                        .department("IT")
                        .build();

        when(authService.getCurrentUser("test@gmail.com"))
                .thenReturn(response);

        UserProfileResponse result =
                authService.getCurrentUser("test@gmail.com");

        assertEquals(
                "Vaishali",
                result.getName()
        );
    }
}