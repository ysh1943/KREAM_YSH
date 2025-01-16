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
        SETTLING,
        SETTLED,
        FAILED,
    }

    public enum Type {
        BUY,
        SELL,
    }

    private int id;
    private Integer userId;
    private String type;
    private Integer sellerBidId;
    private Integer buyerBidId;
    private int price;
    private Integer addressId;
    private String state;
    private String deliveryNote;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;

}
