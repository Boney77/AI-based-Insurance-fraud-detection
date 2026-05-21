package com.fraudsystem.service;

import com.fraudsystem.dto.ClaimRequest;
import com.fraudsystem.model.Claim;
import com.fraudsystem.storage.ClaimStorage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FraudService {

    private static final Logger log = LoggerFactory.getLogger(FraudService.class);

    private static final double HIGH_AMOUNT_THRESHOLD = 500_000.0;
    private static final int    HOSPITAL_REPEAT_LIMIT = 3;
    private static final int    RAPID_SUBMIT_MINUTES  = 60;

    private static final int SCORE_HIGH_AMOUNT     = 30;
    private static final int SCORE_MISSING_POLICY  = 20;
    private static final int SCORE_HOSPITAL_REPEAT = 15;
    private static final int SCORE_RAPID_SUBMIT    = 35;

    private final ClaimStorage claimStorage;

    public FraudService(ClaimStorage claimStorage) {
        this.claimStorage = claimStorage;
    }

    public int calculateFraudScore(ClaimRequest request) {
        int score = 0;

        if (request.getClaimAmount() > HIGH_AMOUNT_THRESHOLD) {
            score += SCORE_HIGH_AMOUNT;
            log.info("R1: high amount ({}) +{}", request.getClaimAmount(), SCORE_HIGH_AMOUNT);
        }

        if (request.getPolicyNumber() == null || request.getPolicyNumber().isBlank()) {
            score += SCORE_MISSING_POLICY;
            log.info("R2: missing policy number +{}", SCORE_MISSING_POLICY);
        }

        if (request.getHospitalName() != null && !request.getHospitalName().isBlank()) {
            long hospitalCount = claimStorage.findByHospitalName(request.getHospitalName()).size();
            if (hospitalCount >= HOSPITAL_REPEAT_LIMIT) {
                score += SCORE_HOSPITAL_REPEAT;
                log.info("R3: hospital '{}' count={} +{}", request.getHospitalName(), hospitalCount, SCORE_HOSPITAL_REPEAT);
            }
        }

        if (request.getPolicyNumber() != null && !request.getPolicyNumber().isBlank()) {
            LocalDateTime cutoff = LocalDateTime.now().minusMinutes(RAPID_SUBMIT_MINUTES);
            List<Claim> recent = claimStorage.findByPolicyNumber(request.getPolicyNumber())
                    .stream()
                    .filter(c -> c.getSubmittedAt().isAfter(cutoff))
                    .toList();
            if (!recent.isEmpty()) {
                score += SCORE_RAPID_SUBMIT;
                log.info("R4: policy '{}' submitted recently +{}", request.getPolicyNumber(), SCORE_RAPID_SUBMIT);
            }
        }

        return Math.min(score, 100);
    }

    public String resolveFraudLevel(int score) {
        if (score <= 30) return "LOW_RISK";
        if (score <= 60) return "MEDIUM_RISK";
        return "HIGH_RISK";
    }

    public String resolveInitialStatus(String fraudLevel) {
        switch (fraudLevel) {
            case "LOW_RISK":    return "APPROVED";
            case "MEDIUM_RISK": return "UNDER_REVIEW";
            case "HIGH_RISK":   return "UNDER_REVIEW";
            default:            return "PENDING";
        }
    }
}
