package com.kream.kream.entities;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Base64;

@Getter
@Setter
public class ImageEntity {
    private int id;
    private int productId;
    private byte[] data;
    private String type;
    private String name;
    private boolean isPrimary;
    private LocalDateTime createdAt;

    public String getBase64Image() {
        if (data != null && type != null) {
            return "data:" + type + ";base64," + Base64.getEncoder().encodeToString(data);
        }
        return null;
    }
}
