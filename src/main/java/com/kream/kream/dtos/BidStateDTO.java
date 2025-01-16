package com.kream.kream.dtos;

import lombok.Getter;
import lombok.Setter;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.util.Base64;

@Getter
@Setter
public class BidStateDTO {
    public enum State {
        BIDDING,
        DEADLINE,
        ORDER,
    }

    private int buyerBidId;
    private int productId;
    private String productNameEn;
    private String sizeType;
    private byte[] imageData;
    private String imageType;
    private int price;
    private LocalDate deadline;
    private State state;

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
