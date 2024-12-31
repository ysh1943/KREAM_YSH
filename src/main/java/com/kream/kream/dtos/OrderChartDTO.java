package com.kream.kream.dtos;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class OrderChartDTO {
    private int orderId;
    private String sizeType;
    private int orderPrice;
    private LocalDate orderDate;
}
