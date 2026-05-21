package com.fraudsystem.model;

import java.time.LocalDateTime;

public class Claim {

    private String claimId;
    private String customerName;
    private String policyNumber;
    private double claimAmount;
    private String hospitalName;
    private String incidentType;
    private int fraudScore;
    private String fraudLevel;
    private String status;
    private LocalDateTime submittedAt;
    private LocalDateTime updatedAt;
    private String adminNote;

    public Claim() {}

    public String getClaimId()            { return claimId; }
    public String getCustomerName()       { return customerName; }
    public String getPolicyNumber()       { return policyNumber; }
    public double getClaimAmount()        { return claimAmount; }
    public String getHospitalName()       { return hospitalName; }
    public String getIncidentType()       { return incidentType; }
    public int    getFraudScore()         { return fraudScore; }
    public String getFraudLevel()         { return fraudLevel; }
    public String getStatus()             { return status; }
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public LocalDateTime getUpdatedAt()   { return updatedAt; }
    public String getAdminNote()          { return adminNote; }

    public void setClaimId(String v)          { this.claimId = v; }
    public void setCustomerName(String v)     { this.customerName = v; }
    public void setPolicyNumber(String v)     { this.policyNumber = v; }
    public void setClaimAmount(double v)      { this.claimAmount = v; }
    public void setHospitalName(String v)     { this.hospitalName = v; }
    public void setIncidentType(String v)     { this.incidentType = v; }
    public void setFraudScore(int v)          { this.fraudScore = v; }
    public void setFraudLevel(String v)       { this.fraudLevel = v; }
    public void setStatus(String v)           { this.status = v; }
    public void setSubmittedAt(LocalDateTime v) { this.submittedAt = v; }
    public void setUpdatedAt(LocalDateTime v)   { this.updatedAt = v; }
    public void setAdminNote(String v)        { this.adminNote = v; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final Claim c = new Claim();

        public Builder claimId(String v)           { c.claimId = v;      return this; }
        public Builder customerName(String v)      { c.customerName = v; return this; }
        public Builder policyNumber(String v)      { c.policyNumber = v; return this; }
        public Builder claimAmount(double v)       { c.claimAmount = v;  return this; }
        public Builder hospitalName(String v)      { c.hospitalName = v; return this; }
        public Builder incidentType(String v)      { c.incidentType = v; return this; }
        public Builder fraudScore(int v)           { c.fraudScore = v;   return this; }
        public Builder fraudLevel(String v)        { c.fraudLevel = v;   return this; }
        public Builder status(String v)            { c.status = v;       return this; }
        public Builder submittedAt(LocalDateTime v){ c.submittedAt = v;  return this; }
        public Builder updatedAt(LocalDateTime v)  { c.updatedAt = v;    return this; }
        public Builder adminNote(String v)         { c.adminNote = v;    return this; }

        public Claim build() { return c; }
    }
}
