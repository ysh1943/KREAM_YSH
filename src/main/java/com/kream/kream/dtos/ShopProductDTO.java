package com.kream.kream.dtos;

import lombok.Getter;
import lombok.Setter;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.util.Base64;

@Getter
@Setter
public class ShopProductDTO {
    private int productId;
    private String productNameEn;
    private String productNameKo;
    private String brand;
    private String gender;
    private String color;
    private String category;
    private String categoryDetail;
    private LocalDate releaseDate;
    private int lowestPrice;
    private int transactionCount;
    private byte[] imageData;
    private String imageType;

    public String getBase64Image() throws IOException {
        if (imageData != null && imageType != null) {
            return "data:" + imageType + ";base64," + Base64.getEncoder().encodeToString(imageData);
        }
        try (InputStream inputStream = getClass().getResourceAsStream("/static/home/assets/images/no-image.png")) {
            if (inputStream == null) {
                throw new RuntimeException("기본 이미지를 찾을수 없습니다.");
            }
            return  Base64.getEncoder().encodeToString(inputStream.readAllBytes());
        } catch (IOException e) {
            throw new RuntimeException("기본이미지를 찾는데 실패했습니다.", e);
        }
    }
}
