package com.kream.kream.regexes;

import com.kream.kream.entities.UserEntity;

public class UserRegex {
    public static final String EMAIL_REGEX = "^[a-zA-Z0-9._%+-]{1,40}@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
    public static final String PASSWORD_REGEX = "^[\\da-zA-Z`~!@#$%^&*()\\-_=+\\[{\\]}\\\\|;:'\",<.>/?]{6,50}$";
    public static final String NICKNAME_REGEX = "^[a-zA-Z가-힣]{2,10}$";

    public static boolean checkEmail(String email) {
        return email != null && email.matches(EMAIL_REGEX);
    }

    public static boolean checkEmail(UserEntity user) {
        return user != null && checkEmail(user.getEmail());
    }

    public static boolean checkPassword(String password) {
        return password != null && password.matches(PASSWORD_REGEX);
    }

    public static boolean checkPassword(UserEntity user) {
        return user != null && checkPassword(user.getPassword());
    }

    public static boolean checkNickname(String nickname) {
        return nickname != null && nickname.matches(NICKNAME_REGEX);
    }

    public static boolean checkNickname(UserEntity user) {
        return user != null && checkNickname(user.getNickname());
    }
}
