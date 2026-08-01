package com.Rogerd3v.main.modules.auth.service.interfaces;

import com.Rogerd3v.main.modules.auth.dto.request.LoginRequest;
import com.Rogerd3v.main.modules.auth.dto.request.RefreshTokenRequest;
import com.Rogerd3v.main.modules.auth.dto.request.RegisterRequest;
import com.Rogerd3v.main.modules.auth.dto.response.AuthResponse;
import com.Rogerd3v.main.modules.auth.dto.response.RegisterResponse;

public interface AuthService {

    RegisterResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse refreshToken(RefreshTokenRequest request);

    void logout();
}
