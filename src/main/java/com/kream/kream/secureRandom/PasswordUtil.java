package com.kream.kream.secureRandom;

import java.security.SecureRandom;

public class PasswordUtil {

    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    private static final SecureRandom RANDOM = new SecureRandom();

    public static String generateTemporaryPassword(int length) {
        StringBuilder password = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            int index = RANDOM.nextInt(CHARACTERS.length());
            password.append(CHARACTERS.charAt(index));
        }
//        String tempPassword = PasswordUtil.generateTemporaryPassword(12);
//        System.out.println("임시 비밀번호: " + tempPassword);
        return password.toString();

    }

}
