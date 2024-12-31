package com.kream.kream.entities;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@EqualsAndHashCode(of = {"id"})
public class AddressEntity {
    private int id;
    private int userId;
    private String name;
    private String contact;
    private String postal;
    private String basicAddress;
    private String detailAddress;
    private boolean isDefault;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean isDeleted;
}
