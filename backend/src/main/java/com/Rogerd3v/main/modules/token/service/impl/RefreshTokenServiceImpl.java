package com.Rogerd3v.main.modules.token.service.impl;

import com.Rogerd3v.main.config.JwtProperties;
import com.Rogerd3v.main.exception.InvalidTokenException;
import com.Rogerd3v.main.exception.TokenExpiredException;
import com.Rogerd3v.main.exception.TokenRevokedException;
import com.Rogerd3v.main.modules.token.entity.RefreshToken;
import com.Rogerd3v.main.modules.token.repository.RefreshTokenRepository;
import com.Rogerd3v.main.modules.token.service.interfaces.RefreshTokenService;
import com.Rogerd3v.main.modules.user.entity.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private final JwtProperties jwtProperties;
    private final RefreshTokenRepository refreshTokenRepository;

    // Internal Helper
    private String hashToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hashBytes);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Failed to hash refresh token", e);
        }
    }

    @Override //
    public String createRefreshToken(UserEntity user) {
        String rawToken = UUID.randomUUID().toString();
        String hashToken = hashToken(rawToken);

        RefreshToken refreshToken = RefreshToken.builder()
                .token(hashToken)
                .user(user)
                .expiresAt(Instant.now().plusMillis(jwtProperties.getRefreshTokenExpiration()))
                .build();

        refreshTokenRepository.save(refreshToken);

        return rawToken;
    }

    @Override
    public RefreshToken validateRefreshToken(String rawToken) {
        String hashToken = hashToken(rawToken);

        RefreshToken refreshToken = refreshTokenRepository.findByToken(hashToken)
                .orElseThrow(InvalidTokenException::new);

        if (refreshToken.isRevoked()) {          // ← ADD THIS CHECK
            throw new TokenRevokedException();
        }

        if (refreshToken.getExpiresAt().isBefore(Instant.now())) {
            refreshTokenRepository.delete(refreshToken);
            throw new TokenExpiredException();
        }

        return refreshToken;
    }

    @Override
    public String rotateRefreshToken(RefreshToken oldToken) {
        UserEntity user = oldToken.getUser();
        refreshTokenRepository.delete(oldToken);

        return createRefreshToken(user);
    }

    @Override
    public void revokeAllByUser(UserEntity user) {
        refreshTokenRepository.revokeAllByUserId(user.getId());
    }

    @Override
    public void deleteAllByUser(UserEntity user) {
        refreshTokenRepository.deleteAllByUserId(user.getId());
    }
}
