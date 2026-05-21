package com.fraudsystem.dto;

public class ClaimResponse {

    private String claimId;
    private int    fraudScore;
    private String fraudLevel;
    private String status;
    private String message;

    public ClaimResponse() {}

    public String getClaimId()    { return claimId; }
    public int    getFraudScore() { return fraudScore; }
    public String getFraudLevel() { return fraudLevel; }
    public String getStatus()     { return status; }
    public String getMessage()    { return message; }

    public void setClaimId(String v)    { this.claimId = v; }
    public void setFraudScore(int v)    { this.fraudScore = v; }
    public void setFraudLevel(String v) { this.fraudLevel = v; }
    public void setStatus(String v)     { this.status = v; }
    public void setMessage(String v)    { this.message = v; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final ClaimResponse r = new ClaimResponse();

        public Builder claimId(String v)    { r.claimId = v;    return this; }
        public Builder fraudScore(int v)    { r.fraudScore = v; return this; }
        public Builder fraudLevel(String v) { r.fraudLevel = v; return this; }
        public Builder status(String v)     { r.status = v;     return this; }
        public Builder message(String v)    { r.message = v;    return this; }

        public ClaimResponse build() { return r; }
    }
}
