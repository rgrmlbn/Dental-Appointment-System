package com.Rogerd3v.main.exception;

public class PasswordReuseException extends RuntimeException {
    public PasswordReuseException() {
        super("You cannot reuse your previous password. Please choose a different password.");
    }
}
