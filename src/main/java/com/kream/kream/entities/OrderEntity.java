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

    private int id;
    private int userId;
    private String type;
    private Integer sellerBidId;
    private Integer buyerBidId;
    private int price;
    private int addressId;
    private String state;
    private String deliveryNote;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
}
