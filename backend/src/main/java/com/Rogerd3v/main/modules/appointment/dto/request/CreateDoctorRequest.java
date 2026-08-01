package com.Rogerd3v.main.modules.appointment.dto.request;

import com.Rogerd3v.main.modules.appointment.enums.Specialization;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Set;

@Getter
@NoArgsConstructor
public class CreateDoctorRequest {

    private Long userId;

    @NotNull(message = "Specializations are required")
    @NotEmpty(message = "At least one specialization is required")
    private Set<Specialization> specializations;

    @NotBlank(message = "License number is required")
    @Size(min = 5, max = 50, message = "License number must be between 5 and 50 characters")
    private String licenseNumber;

    @NotBlank(message = "Bio is required")
    @Size(min = 20, max = 2000, message = "Bio must be between 20 and 2000 characters")
    private String bio;

}
