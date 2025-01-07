package com.kream.kream.entities;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserOrderCountEntity extends UserEntity{
    private int userOrderCount;
    private int userSellerBidCount;
    private int userBuyerBidCount;
}
