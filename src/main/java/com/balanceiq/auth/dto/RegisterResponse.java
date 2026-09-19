package com.balanceiq.auth.dto;

import com.balanceiq.auth.entity.Role;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RegisterResponse {

    private Long id;
    private String name;
    private String email;
    private Role role;

}