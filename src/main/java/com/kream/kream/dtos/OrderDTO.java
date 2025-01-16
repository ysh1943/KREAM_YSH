package com.kream.kream.dtos;

import lombok.Getter;
import lombok.Setter;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.Base64;


@Getter
@Setter
public class OrderDTO {
    public enum Type {
        BUY,
        SELL
    }
    private int id;
    private int price;
    private String userEmail;
    private String type;
    private String sellerUserEmail;
    private String buyerUserEmail;
    private String sellerProductName;
    private String buyerProductName;
    private String buyerAddress;
    private String buyerBidAddress;
    private String state;
    private String sellerState;
    private String buyerState;
    private LocalDateTime createdAt;
    private byte[] sellerImageData;
    private String sellerImageType;
    private byte[] buyerImageData;
    private String buyerImageType;

    public String getBase64Image() throws IOException {
        if (sellerImageData != null && sellerImageType != null) {
            return "data:" + sellerImageType + ";base64," + Base64.getEncoder().encodeToString(sellerImageData);
        } else {
            return "data:" + buyerImageType + ";base64," + Base64.getEncoder().encodeToString(buyerImageData);
        }
    }
}
