package com.ozonehis.eip.odoo.openmrs.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Partner implements OdooResource {
    @JsonProperty("id")
    private Integer partnerId;

    @JsonProperty("name")
    private String partnerName;

    @JsonProperty("ref")
    private String partnerRef;

    @JsonProperty("type")
    private String partnerType;

    @JsonProperty("street")
    private String partnerStreet;

    @JsonProperty("street2")
    private String partnerStreet2;

    @JsonProperty("city")
    private String partnerCity;

    @JsonProperty("zip")
    private String partnerZip;

    @JsonProperty("country_id")
    private Integer partnerCountryId;

    @JsonProperty("state_id")
    private Integer partnerStateId;

    @JsonProperty("active")
    private Boolean partnerActive;

    @JsonProperty("comment")
    private String partnerComment;

    private String partnerBirthDate;

    private String partnerExternalId;

    @JsonProperty("property_product_pricelist")
    private Integer partnerPricelistId;

    public Integer getPartnerId() {
        return partnerId;
    }

    public void setPartnerId(Integer partnerId) {
        this.partnerId = partnerId;
    }

    public String getPartnerName() {
        return partnerName;
    }

    public void setPartnerName(String partnerName) {
        this.partnerName = partnerName;
    }

    public String getPartnerRef() {
        return partnerRef;
    }

    public void setPartnerRef(String partnerRef) {
        this.partnerRef = partnerRef;
    }

    public String getPartnerType() {
        return partnerType;
    }

    public void setPartnerType(String partnerType) {
        this.partnerType = partnerType;
    }

    public String getPartnerStreet() {
        return partnerStreet;
    }

    public void setPartnerStreet(String partnerStreet) {
        this.partnerStreet = partnerStreet;
    }

    public String getPartnerStreet2() {
        return partnerStreet2;
    }

    public void setPartnerStreet2(String partnerStreet2) {
        this.partnerStreet2 = partnerStreet2;
    }

    public String getPartnerCity() {
        return partnerCity;
    }

    public void setPartnerCity(String partnerCity) {
        this.partnerCity = partnerCity;
    }

    public String getPartnerZip() {
        return partnerZip;
    }

    public void setPartnerZip(String partnerZip) {
        this.partnerZip = partnerZip;
    }

    public Integer getPartnerCountryId() {
        return partnerCountryId;
    }

    public void setPartnerCountryId(Integer partnerCountryId) {
        this.partnerCountryId = partnerCountryId;
    }

    public Integer getPartnerStateId() {
        return partnerStateId;
    }

    public void setPartnerStateId(Integer partnerStateId) {
        this.partnerStateId = partnerStateId;
    }

    public Boolean getPartnerActive() {
        return partnerActive;
    }

    public void setPartnerActive(Boolean partnerActive) {
        this.partnerActive = partnerActive;
    }

    public String getPartnerComment() {
        return partnerComment;
    }

    public void setPartnerComment(String partnerComment) {
        this.partnerComment = partnerComment;
    }

    public String getPartnerBirthDate() {
        return partnerBirthDate;
    }

    public void setPartnerBirthDate(String partnerBirthDate) {
        this.partnerBirthDate = partnerBirthDate;
    }

    public String getPartnerExternalId() {
        return partnerExternalId;
    }

    public void setPartnerExternalId(String partnerExternalId) {
        this.partnerExternalId = partnerExternalId;
    }

    public Integer getPartnerPricelistId() {
        return partnerPricelistId;
    }

    public void setPartnerPricelistId(Integer partnerPricelistId) {
        this.partnerPricelistId = partnerPricelistId;
    }
}
