package com.fraudsystem.storage;

import com.fraudsystem.model.Claim;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ClaimStorage {

    private final ConcurrentHashMap<String, Claim> store = new ConcurrentHashMap<>();

    public void save(Claim claim) {
        store.put(claim.getClaimId(), claim);
    }

    public Optional<Claim> findById(String claimId) {
        return Optional.ofNullable(store.get(claimId));
    }

    public List<Claim> findAll() {
        List<Claim> list = new ArrayList<>(store.values());
        list.sort((a, b) -> b.getSubmittedAt().compareTo(a.getSubmittedAt()));
        return list;
    }

    public List<Claim> findByStatus(String status) {
        List<Claim> result = new ArrayList<>();
        for (Claim c : store.values()) {
            if (status.equalsIgnoreCase(c.getStatus())) {
                result.add(c);
            }
        }
        result.sort((a, b) -> b.getSubmittedAt().compareTo(a.getSubmittedAt()));
        return result;
    }

    public List<Claim> findByPolicyNumber(String policyNumber) {
        List<Claim> result = new ArrayList<>();
        for (Claim c : store.values()) {
            if (policyNumber.equalsIgnoreCase(c.getPolicyNumber())) {
                result.add(c);
            }
        }
        return result;
    }

    public List<Claim> findByHospitalName(String hospitalName) {
        List<Claim> result = new ArrayList<>();
        for (Claim c : store.values()) {
            if (hospitalName.equalsIgnoreCase(c.getHospitalName())) {
                result.add(c);
            }
        }
        return result;
    }
}
