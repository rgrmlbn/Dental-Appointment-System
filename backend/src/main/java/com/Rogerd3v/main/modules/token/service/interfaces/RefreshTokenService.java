package com.Rogerd3v.main.modules.token.service.interfaces;

import com.Rogerd3v.main.modules.token.entity.RefreshToken;
import com.Rogerd3v.main.modules.user.entity.UserEntity;

import java.util.Optional;

public interface RefreshTokenService {

    String createRefreshToken(UserEntity user);

    RefreshToken validateRefreshToken(String rawToken);

    String rotateRefreshToken(RefreshToken oldToken);

    void revokeAllByUser(UserEntity user);

    void deleteAllByUser(UserEntity user);
}
