package com.kream.kream.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BuyBidChartDTO {
    private String sizeType;
    private int buyPrice;
    private int buyCount;
}
