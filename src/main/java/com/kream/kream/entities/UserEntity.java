package com.kream.kream.entities;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class UserEntity {
    private int id;
    private String email;
    private String password;
    private String contact;
    private String nickname;
    private boolean isAdmin;
    private boolean isSuspended;
    private boolean isVerified;
    private String socialTypeCode;
    private String socialId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
}
