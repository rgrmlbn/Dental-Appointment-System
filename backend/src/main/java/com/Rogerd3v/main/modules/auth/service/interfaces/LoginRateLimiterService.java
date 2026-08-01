package com.Rogerd3v.main.modules.auth.service.interfaces;

public interface LoginRateLimiterService {
    void checkLimits(String email);
}