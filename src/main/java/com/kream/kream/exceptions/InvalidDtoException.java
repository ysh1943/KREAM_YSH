package com.kream.kream.exceptions;

public class InvalidDtoException extends RuntimeException {
    public InvalidDtoException() {
        super();
    }

    public InvalidDtoException(String message, Throwable cause) {
        super(message, cause);
    }

    public InvalidDtoException(Throwable cause) {
        super(cause);
    }

    public InvalidDtoException(String message) {
        super(message);
    }
}
