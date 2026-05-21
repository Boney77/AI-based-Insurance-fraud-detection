package com.fraudsystem.service;

import com.fraudsystem.dto.ClaimRequest;
import com.fraudsystem.dto.ClaimResponse;
import com.fraudsystem.model.Claim;
import com.fraudsystem.storage.ClaimStorage;
import com.fraudsystem.util.ClaimIdGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ClaimService {

    private static final Logger log = LoggerFactory.getLogger(ClaimService.class);

    private final ClaimStorage     claimStorage;
    private final FraudService     fraudService;
    private final ClaimIdGenerator claimIdGenerator;

    public ClaimService(ClaimStorage claimStorage,
                        FraudService fraudService,
                        ClaimIdGenerator claimIdGenerator) {
        this.claimStorage     = claimStorage;
        this.fraudService     = fraudService;
        this.claimIdGenerator = claimIdGenerator;
    }

    public ClaimResponse submitClaim(ClaimRequest request) {
        int    score      = fraudService.calculateFraudScore(request);
        String fraudLevel = fraudService.resolveFraudLevel(score);
        String status     = fraudService.resolveInitialStatus(fraudLevel);

        Claim claim = Claim.builder()
                .claimId(claimIdGenerator.generate())
                .customerName(request.getCustomerName())
                .policyNumber(request.getPolicyNumber())
                .claimAmount(request.getClaimAmount())
                .hospitalName(request.getHospitalName())
                .incidentType(request.getIncidentType())
                .fraudScore(score)
                .fraudLevel(fraudLevel)
                .status(status)
                .submittedAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        claimStorage.save(claim);
        log.info("Claim {} submitted | score={} | level={} | status={}", claim.getClaimId(), score, fraudLevel, status);

        return ClaimResponse.builder()
                .claimId(claim.getClaimId())
                .fraudScore(score)
                .fraudLevel(fraudLevel)
                .status(status)
                .message("Claim submitted successfully")
                .build();
    }

    public Optional<Claim> getClaimById(String claimId) {
        return claimStorage.findById(claimId);
    }

    public List<Claim> getAllClaims() {
        return claimStorage.findAll();
    }

    public Optional<Claim> updateStatus(String claimId, String newStatus, String note) {
        return claimStorage.findById(claimId).map(claim -> {
            claim.setStatus(newStatus);
            claim.setUpdatedAt(LocalDateTime.now());
            if (note != null && !note.isBlank()) {
                claim.setAdminNote(note);
            }
            claimStorage.save(claim);
            log.info("Claim {} → {}", claimId, newStatus);
            return claim;
        });
    }
}
