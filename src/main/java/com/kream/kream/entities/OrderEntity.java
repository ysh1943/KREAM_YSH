package com.kream.kream.entities;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@EqualsAndHashCode(of = {"id"})
public class OrderEntity {
    public enum State {
        PENDING,
        INSPECTING,
        INSPECTION_FAILED,
        INSPECTION_PASSED,
        IN_TRANSIT,
        DELIVERED,
        SETTLED,
        FAILED,
        CANCELED,
    }

    public enum PaymentState {
        PENDING,
        PAID,
        FAILED,
        REFUNDED,
    }
    private int id;
    private int userId;
    private int sellerBidId;
    private int buyerBidId;
    private int addressId;
    private int cardId;
    private String state;
    private String paymentState;
    private String deliveryNote;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;

}
