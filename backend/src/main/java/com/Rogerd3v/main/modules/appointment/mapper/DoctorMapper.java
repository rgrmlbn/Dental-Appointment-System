package com.Rogerd3v.main.modules.appointment.mapper;

import com.Rogerd3v.main.modules.appointment.dto.request.CreateDoctorRequest;
import com.Rogerd3v.main.modules.appointment.dto.response.DoctorResponse;
import com.Rogerd3v.main.modules.appointment.entity.DoctorEntity;
import com.Rogerd3v.main.modules.appointment.enums.Specialization;
import com.Rogerd3v.main.modules.user.entity.UserEntity;
import com.Rogerd3v.main.modules.user.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class DoctorMapper {

    private final UserMapper userMapper;

    public DoctorEntity toEntity(CreateDoctorRequest request, UserEntity user) {
        return DoctorEntity.builder()
                .user(user)
                .specializations(request.getSpecializations())
                .licenseNumber(request.getLicenseNumber())
                .bio(request.getBio())
                .build();
    }

    public DoctorResponse toResponse(DoctorEntity doctor) {
        return DoctorResponse.builder()
                .id(doctor.getId())
                .user(userMapper.toResponse(doctor.getUser()))
                .specializations(doctor.getSpecializations().stream()
                        .map(Specialization::name)
                        .collect(Collectors.toSet()))
                .licenseNumber(doctor.getLicenseNumber())
                .bio(doctor.getBio())
                .build();
    }
}
