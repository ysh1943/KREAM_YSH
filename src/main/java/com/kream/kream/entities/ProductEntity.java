package com.kream.kream.entities;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@EqualsAndHashCode(of = {"id"})
public class ProductEntity {
    private int id;
    private int categoryDetailId;
    private String baseName;
    private String productNameKo;
    private String productNameEn;
    private String modelNumber;
    private LocalDate releaseDate;
    private String color;
    private String brand;
    private String category;
    private String gender;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean isDeleted;
}
