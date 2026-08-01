package com.Rogerd3v.main.exception;

public class TooManyRequestsException extends RuntimeException {
    public TooManyRequestsException() {
        super("Too many requests. Please try again later.");
    }
}
