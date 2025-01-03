package com.kream.kream.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderCountDTO {
    private int allOrder;
    private int statePending;
    private int stateInspecting;
}
