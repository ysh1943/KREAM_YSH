package com.kream.kream.entities;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import lombok.*;


@Builder
@Getter
@Setter
@EqualsAndHashCode(of={"id"})
@AllArgsConstructor
@NoArgsConstructor
public class UserEntity {
    public static final String NAME_SINGULAR = "user";
    private int id;
    private String email;
    private String password;
    private String contact;
    private String nickname;
    private boolean isAdmin;
    private boolean isSuspended;
    private boolean isVerified;
    private LocalDateTime temporaryPassword;
    private String socialTypeCode;
    private String socialId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
}
