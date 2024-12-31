package com.kream.kream.entities;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode(of = {"id"})
public class SizeEntity {
    private int id;
    private int productId;
    private String type;
}
