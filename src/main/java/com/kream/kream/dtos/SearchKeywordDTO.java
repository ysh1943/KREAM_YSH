package com.kream.kream.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SearchKeywordDTO {
    private int productId;
    private String productNameKo;
    private String productNameEn;
    private String brand;
}
