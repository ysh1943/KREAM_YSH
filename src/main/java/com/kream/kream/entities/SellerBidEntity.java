package com.kream.kream.entities;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@EqualsAndHashCode(of = {"id"})
public class SellerBidEntity {
    public enum State {
        BIDDING,
        DEADLINE,
        ORDER,
    }

    public enum OrderState {
        PENDING,
        INSPECTING,
        INSPECTION_FAILED,
        INSPECTION_PASSED,
        SETTLING,
        FAILED,
        SETTLED,
    }

    private int id;
    private int userId;
    private int sizeId;
    private int addressId;
    private int price;
    private LocalDate deadline;
    private String state;
    private String orderState;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean isDeleted;
}
