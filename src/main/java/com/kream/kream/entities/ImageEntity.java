package com.kream.kream.entities;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

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
}
