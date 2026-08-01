package com.Rogerd3v.main.modules.appointment.dto.request;

import com.Rogerd3v.main.modules.appointment.enums.AppointmentService;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Set;

@Getter
@NoArgsConstructor
public class UpdateAppointmentRequest {

    private LocalDate date;

    private LocalTime startTime;

    private LocalTime endTime;

    private Set<AppointmentService> services;

    @Size(min = 20, max = 2000, message = "Concerns must be between 20 and 2000 characters")
    private String concerns;
}
