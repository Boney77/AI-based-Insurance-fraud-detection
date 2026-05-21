package com.fraudsystem.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "Insurance Fraud Detection API",
                "message", "Backend is running"
        ));
    }

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> root() {
        return health();
    }
}
