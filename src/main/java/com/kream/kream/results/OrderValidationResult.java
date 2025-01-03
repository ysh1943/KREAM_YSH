package com.kream.kream.results;

public enum OrderValidationResult implements Result {
    FAILURE_PRICE,
    FAILURE_ADDRESS,
    FAILURE_ACCOUNT,
    FAILURE_SellerBid,
    FAILURE_BuyerBid,
}
