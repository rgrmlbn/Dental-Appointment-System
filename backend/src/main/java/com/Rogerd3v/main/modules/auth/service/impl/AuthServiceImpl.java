package com.Rogerd3v.main.modules.auth.service.impl;

import com.Rogerd3v.main.exception.DuplicateEmailException;
import com.Rogerd3v.main.exception.ResourceNotFoundException;
import com.Rogerd3v.main.modules.auth.dto.request.LoginRequest;
import com.Rogerd3v.main.modules.auth.dto.request.RefreshTokenRequest;
import com.Rogerd3v.main.modules.auth.dto.request.RegisterRequest;
import com.Rogerd3v.main.modules.auth.dto.response.AuthResponse;
import com.Rogerd3v.main.modules.auth.dto.response.RegisterResponse;
import com.Rogerd3v.main.modules.auth.service.interfaces.AuthService;
import com.Rogerd3v.main.modules.auth.service.interfaces.LoginRateLimiterService;
import com.Rogerd3v.main.modules.token.entity.RefreshToken;
import com.Rogerd3v.main.modules.token.service.interfaces.RefreshTokenService;
import com.Rogerd3v.main.modules.token.service.interfaces.TokenBlacklistService;
import com.Rogerd3v.main.modules.user.entity.UserEntity;
import com.Rogerd3v.main.modules.user.mapper.UserMapper;
import com.Rogerd3v.main.modules.user.repository.UserRepository;
import com.Rogerd3v.main.security.principal.UserPrincipal;
import com.Rogerd3v.main.security.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;
    private final TokenBlacklistService tokenBlacklistService;
    private final LoginRateLimiterService loginRateLimiterService;

    @Override
    @Transactional
    public RegisterResponse register(RegisterRequest request) {

        if(userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException();
        }

        UserEntity user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);

        return userMapper.toRegisterResponse(user);
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        loginRateLimiterService.checkLimits(request.getEmail());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // After authentication passes, load the principal
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

        String accessToken = jwtUtil.generateAccessToken(principal);           // ✅ UserDetails
        String refreshToken = refreshTokenService.createRefreshToken(principal.getUser()); // ✅ UserEntity

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    @Override
    public AuthResponse refreshToken(RefreshTokenRequest request) {

        RefreshToken oldToken = refreshTokenService.validateRefreshToken(request.getRefreshToken());

        UserPrincipal principal = new UserPrincipal(oldToken.getUser());

        String newRefreshToken = refreshTokenService.rotateRefreshToken(oldToken);
        String newAccessToken = jwtUtil.generateAccessToken(principal);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .build();
    }
    @Override
    @Transactional
    public void logout() {
        String accessToken = (String) SecurityContextHolder.getContext()
                .getAuthentication()
                .getCredentials(); // 👈 reads the JWT stored by JwtFilter

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User"));

        refreshTokenService.deleteAllByUser(user);
        tokenBlacklistService.blacklist(accessToken);
        SecurityContextHolder.clearContext();
    }
}
