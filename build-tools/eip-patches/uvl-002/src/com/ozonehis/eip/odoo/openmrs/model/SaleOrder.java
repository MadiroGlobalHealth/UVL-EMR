package com.ozonehis.eip.odoo.openmrs.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class SaleOrder implements OdooResource {
    @JsonProperty("id")
    private Integer orderId;

    @JsonProperty("client_order_ref")
    private String orderClientOrderRef;

    @JsonProperty("state")
    private String orderState;

    @JsonProperty("partner_id")
    private Object orderPartnerId;

    @JsonProperty("order_line")
    private List<Integer> orderLine;

    @JsonProperty("type_name")
    private String orderTypeName;

    private String partnerWeight;

    private String partnerBirthDate;

    private String odooCustomerId;

    public Integer getOrderId() {
        return orderId;
    }

    public void setOrderId(Integer orderId) {
        this.orderId = orderId;
    }

    public String getOrderClientOrderRef() {
        return orderClientOrderRef;
    }

    public void setOrderClientOrderRef(String orderClientOrderRef) {
        this.orderClientOrderRef = orderClientOrderRef;
    }

    public String getOrderState() {
        return orderState;
    }

    public void setOrderState(String orderState) {
        this.orderState = orderState;
    }

    public Object getOrderPartnerId() {
        return orderPartnerId;
    }

    public void setOrderPartnerId(Object orderPartnerId) {
        this.orderPartnerId = orderPartnerId;
    }

    public List<Integer> getOrderLine() {
        return orderLine;
    }

    public void setOrderLine(List<Integer> orderLine) {
        this.orderLine = orderLine;
    }

    public String getOrderTypeName() {
        return orderTypeName;
    }

    public void setOrderTypeName(String orderTypeName) {
        this.orderTypeName = orderTypeName;
    }

    public String getPartnerWeight() {
        return partnerWeight;
    }

    public void setPartnerWeight(String partnerWeight) {
        this.partnerWeight = partnerWeight;
    }

    public String getPartnerBirthDate() {
        return partnerBirthDate;
    }

    public void setPartnerBirthDate(String partnerBirthDate) {
        this.partnerBirthDate = partnerBirthDate;
    }

    public String getOdooCustomerId() {
        return odooCustomerId;
    }

    public void setOdooCustomerId(String odooCustomerId) {
        this.odooCustomerId = odooCustomerId;
    }
}
