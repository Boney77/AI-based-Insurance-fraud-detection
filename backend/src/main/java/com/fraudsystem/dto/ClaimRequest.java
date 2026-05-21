package com.fraudsystem.dto;

public class ClaimRequest {

    private String customerName;
    private String policyNumber;
    private double claimAmount;
    private String hospitalName;
    private String incidentType;

    public ClaimRequest() {}

    public String getCustomerName() { return customerName; }
    public String getPolicyNumber() { return policyNumber; }
    public double getClaimAmount()  { return claimAmount; }
    public String getHospitalName() { return hospitalName; }
    public String getIncidentType() { return incidentType; }

    public void setCustomerName(String v) { this.customerName = v; }
    public void setPolicyNumber(String v) { this.policyNumber = v; }
    public void setClaimAmount(double v)  { this.claimAmount = v; }
    public void setHospitalName(String v) { this.hospitalName = v; }
    public void setIncidentType(String v) { this.incidentType = v; }
}
