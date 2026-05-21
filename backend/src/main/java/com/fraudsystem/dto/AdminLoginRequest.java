package com.fraudsystem.dto;

public class AdminLoginRequest {

    private String username;
    private String password;

    public AdminLoginRequest() {}

    public String getUsername() { return username; }
    public String getPassword() { return password; }

    public void setUsername(String v) { this.username = v; }
    public void setPassword(String v) { this.password = v; }
}
