package com.Rogerd3v.main.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "app.rate-limit.login")
@Getter
@Setter
public class LoginRateLimitProperties {
    private int capacity;
    private int refillMinutes;
}