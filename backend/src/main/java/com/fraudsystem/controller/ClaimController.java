package com.fraudsystem.controller;

import com.fraudsystem.dto.ClaimRequest;
import com.fraudsystem.dto.ClaimResponse;
import com.fraudsystem.service.ClaimService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/claim")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ClaimController {

    private final ClaimService claimService;

    public ClaimController(ClaimService claimService) {
        this.claimService = claimService;
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitClaim(@RequestBody ClaimRequest request) {
        if (request.getCustomerName() == null || request.getCustomerName().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Customer name is required"));
        }
        if (request.getHospitalName() == null || request.getHospitalName().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Hospital name is required"));
        }
        if (request.getIncidentType() == null || request.getIncidentType().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Incident type is required"));
        }
        ClaimResponse response = claimService.submitClaim(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{claimId}")
    public ResponseEntity<?> getClaimStatus(@PathVariable String claimId) {
        return claimService.getClaimById(claimId)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404)
                        .body(Map.of("error", "Claim not found: " + claimId)));
    }
}
