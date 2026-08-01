package com.Rogerd3v.main.modules.appointment.dto.response;

import com.Rogerd3v.main.modules.appointment.enums.Specialization;
import com.Rogerd3v.main.modules.user.dto.response.UserResponse;
import lombok.Builder;
import lombok.Getter;

import java.util.Set;

@Getter
@Builder
public class DoctorResponse {

    private Long id;
    private UserResponse user;
    private Set<String> specializations;
    private String licenseNumber;
    private String bio;
}
