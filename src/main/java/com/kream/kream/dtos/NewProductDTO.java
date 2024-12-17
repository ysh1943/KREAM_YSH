package com.kream.kream.dtos;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Base64;

@Getter
@Setter
public class NewProductDTO {
    private int productId;
    private String productName;
    private String brand;
    private BigDecimal lowestPrice;
    private int transactionCount;
    private byte[] imageData;
    private String imageType;
    private LocalDateTime createdAt;

    public String getBase64Image() {
        if (imageData != null && imageType != null) {
            return "data:" + imageType + ";base64," + Base64.getEncoder().encodeToString(imageData);
        }
        return null;
    }
}
