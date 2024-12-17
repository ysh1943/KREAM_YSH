package com.kream.kream.results;

public enum LoginResult implements Result {
    FAILURE_NOT_VERIFIED,
    FAILURE_SUSPENDED,
    FAILURE_DUPLICATE_EMAIL,
    FAILURE_DUPLICATE_CONTACT,
    FAILURE_DUPLICATE_NICKNAME,
}
