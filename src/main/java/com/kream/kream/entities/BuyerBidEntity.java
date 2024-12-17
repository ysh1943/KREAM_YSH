package com.kream.kream.entities;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@EqualsAndHashCode(of = {"id"})
public class BuyerBidEntity {
    public enum State {
        BIDDING,
        DEADLINE,
    }

    private int id;
    private int userId;
    private int sizeId;
    private int price;
    private LocalDate deadline;
    private String state;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean isDeleted;
}
