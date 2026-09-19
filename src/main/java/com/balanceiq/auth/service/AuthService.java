package com.balanceiq.auth.service;

import com.balanceiq.auth.dto.*;

public interface AuthService {

    RegisterResponse register(RegisterRequest request);

    LoginResponse login(LoginRequest request);

    UserProfileResponse getCurrentUser(String email);
}