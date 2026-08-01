package com.Rogerd3v.main.modules.appointment.dto.request;

import com.Rogerd3v.main.modules.appointment.enums.AppointmentService;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Set;

@Getter
@NoArgsConstructor
public class CreateAppointmentRequest {

    @NotNull(message = "Doctor ID is required")
    private Long doctorId;

    @NotNull(message = "Date is required")
    @Future(message = "Invalid Date, Must be in the future")
    private LocalDate date;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "Services are required")
    @NotEmpty(message = "At least one service is required")
    private Set<AppointmentService> services;

    @NotBlank(message = "Concerns are required")
    @Size(min = 20, max = 2000, message = "Concerns must be between 20 and 2000 characters")
    private String concerns;
}
