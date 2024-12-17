package com.kream.kream;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
public class KreamApplication {

    public static void main(String[] args) {
        SpringApplication.run(KreamApplication.class, args);
    }
}
