package com.kream.kream.dtos;

import lombok.Getter;
import lombok.Setter;

import java.io.IOException;
import java.io.InputStream;
import java.util.Base64;

@Getter
@Setter
public class OrderStateDTO {
    public enum State {
        PENDING("대기중"),
        INSPECTING("검수중"),
        INSPECTION_FAILED("검수 불합격"),
        INSPECTION_PASSED("검수 합격"),
        IN_TRANSIT("배송중"),
        DELIVERED("배송완료"),
        SETTLING("정산중"),
        SETTLED("정산완료"),
        FAILED("취소완료");

        private final String koreaName;

        State(String koreaName) {
            this.koreaName = koreaName;
        }

        public String getKoreaName() {
            return koreaName;
        }
        }

    private int productId;
    private int price;
    private String productNameEn;
    private String sizeType;
    private byte[] imageData;
    private String imageType;
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
