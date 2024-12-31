package com.kream.kream.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductPriceDTO {
    private int sizeId;
    private int sellPrice;
    private int buyPrice;
    private int sellerBidId;
    private int buyerBidId;
}
