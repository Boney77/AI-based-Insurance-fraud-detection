package com.fraudsystem.controller;

import com.fraudsystem.dto.AdminLoginRequest;
import com.fraudsystem.model.Claim;
import com.fraudsystem.service.ClaimService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final ClaimService claimService;

    @Value("${admin.username}")
    private String adminUsername;

    @Value("${admin.password}")
    private String adminPassword;

    @Value("${admin.token}")
    private String adminToken;

    public AdminController(ClaimService claimService) {
        this.claimService = claimService;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody AdminLoginRequest request) {
        if (adminUsername.equals(request.getUsername()) && adminPassword.equals(request.getPassword())) {
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "token",   adminToken,
                    "message", "Login successful"
            ));
        }
        return ResponseEntity.status(401).body(Map.of(
                "success", false,
                "message", "Invalid username or password"
        ));
    }

    @GetMapping("/claims")
    public ResponseEntity<?> getAllClaims(@RequestHeader("Authorization") String authHeader) {
        if (!isAuthorized(authHeader)) return unauthorized();
        List<Claim> claims = claimService.getAllClaims();
        return ResponseEntity.ok(Map.of("total", claims.size(), "claims", claims));
    }

    @GetMapping("/claims/{claimId}")
    public ResponseEntity<?> getClaimById(
            @PathVariable String claimId,
            @RequestHeader("Authorization") String authHeader) {
        if (!isAuthorized(authHeader)) return unauthorized();
        return claimService.getClaimById(claimId)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404)
                        .body(Map.of("error", "Claim not found: " + claimId)));
    }

    @PutMapping("/approve/{claimId}")
    public ResponseEntity<?> approveClaim(
            @PathVariable String claimId,
            @RequestHeader("Authorization") String authHeader,
            @RequestBody(required = false) Map<String, String> body) {
        if (!isAuthorized(authHeader)) return unauthorized();
        String note = (body != null) ? body.get("note") : null;
        return claimService.updateStatus(claimId, "APPROVED", note)
                .<ResponseEntity<?>>map(c -> ResponseEntity.ok(Map.of(
                        "success", true, "claimId", claimId, "status", "APPROVED")))
                .orElseGet(() -> ResponseEntity.status(404).body(Map.of("error", "Claim not found: " + claimId)));
    }

    @PutMapping("/reject/{claimId}")
    public ResponseEntity<?> rejectClaim(
            @PathVariable String claimId,
            @RequestHeader("Authorization") String authHeader,
            @RequestBody(required = false) Map<String, String> body) {
        if (!isAuthorized(authHeader)) return unauthorized();
        String note = (body != null) ? body.get("note") : null;
        return claimService.updateStatus(claimId, "REJECTED", note)
                .<ResponseEntity<?>>map(c -> ResponseEntity.ok(Map.of(
                        "success", true, "claimId", claimId, "status", "REJECTED")))
                .orElseGet(() -> ResponseEntity.status(404).body(Map.of("error", "Claim not found: " + claimId)));
    }

    @PutMapping("/investigate/{claimId}")
    public ResponseEntity<?> investigateClaim(
            @PathVariable String claimId,
            @RequestHeader("Authorization") String authHeader,
            @RequestBody(required = false) Map<String, String> body) {
        if (!isAuthorized(authHeader)) return unauthorized();
        String note = (body != null) ? body.get("note") : null;
        return claimService.updateStatus(claimId, "INVESTIGATION", note)
                .<ResponseEntity<?>>map(c -> ResponseEntity.ok(Map.of(
                        "success", true, "claimId", claimId, "status", "INVESTIGATION")))
                .orElseGet(() -> ResponseEntity.status(404).body(Map.of("error", "Claim not found: " + claimId)));
    }

    private boolean isAuthorized(String authHeader) {
        return authHeader != null && authHeader.equals("Bearer " + adminToken);
    }

    private ResponseEntity<Map<String, Object>> unauthorized() {
        return ResponseEntity.status(401).body(Map.of(
                "success", false,
                "message", "Unauthorized. Please login as admin."
        ));
    }
}
