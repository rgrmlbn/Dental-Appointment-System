package com.Rogerd3v.main.exception;

public class DuplicateLicenseNumberException extends RuntimeException {
    public DuplicateLicenseNumberException(String message) {
        super("An account with this license number already exists");
    }
}
