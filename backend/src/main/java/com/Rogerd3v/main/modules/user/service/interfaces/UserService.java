package com.Rogerd3v.main.modules.user.service.interfaces;

import com.Rogerd3v.main.modules.user.dto.request.ChangePasswordRequest;
import com.Rogerd3v.main.modules.user.dto.request.UpdateUserRequest;
import com.Rogerd3v.main.modules.user.dto.response.UserResponse;
import com.Rogerd3v.main.modules.user.entity.UserEntity;
import org.hibernate.sql.Update;

import java.util.List;

public interface UserService {

    List<UserResponse> getAllUsers();

    UserResponse getUserById(Long id);

    UserResponse getMe();

    UserResponse updateUserById(Long id, UpdateUserRequest update);

    void changePasswordById(Long id, ChangePasswordRequest request);

    void deleteUserById(Long id);
}
