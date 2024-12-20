package com.kream.kream.dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.Base64;

@Getter
@Setter
public class SimilarProductImageDTO {
    private int productId;
    private byte[] imageData;
    private String imageType;

    public String getBase64Image() {
        if (imageData != null && imageType != null) {
            return "data:" + imageType + ";base64," + Base64.getEncoder().encodeToString(imageData);
        }
        return null;
    }
}