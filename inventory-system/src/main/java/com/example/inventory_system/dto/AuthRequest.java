package com.example.inventory_system.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String username;
    private String password;
}
