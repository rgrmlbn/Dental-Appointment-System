package com.Rogerd3v.main.modules.appointment.dto.request;

import com.Rogerd3v.main.modules.appointment.enums.Specialization;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Set;

@Getter
@NoArgsConstructor
public class UpdateDoctorRequest {

    private Set<Specialization> specializations;

    @Size(min = 5, max = 50, message = "License number must be between 5 and 50 characters")
    private String licenseNumber;

    @Size(min = 20, max = 2000, message = "Bio must be between 20 and 2000 characters")
    private String bio;

}
