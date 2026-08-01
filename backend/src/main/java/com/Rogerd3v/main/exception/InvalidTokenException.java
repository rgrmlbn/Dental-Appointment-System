package com.Rogerd3v.main.exception;

public class InvalidTokenException extends RuntimeException {
    public InvalidTokenException( ) {
        super("Invalid token");
    }
}
