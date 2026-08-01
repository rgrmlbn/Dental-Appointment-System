package com.Rogerd3v.main.modules.auth.dto.response;

import com.Rogerd3v.main.modules.user.enums.Gender;
import com.Rogerd3v.main.modules.user.enums.UserRole;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class AuthResponse {

    private String accessToken;
    private String refreshToken;
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
}
