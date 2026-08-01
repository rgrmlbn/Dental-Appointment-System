package com.Rogerd3v.main.modules.appointment.dto.response;

import com.Rogerd3v.main.modules.appointment.enums.AppointmentService;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Set;

@Getter
@Builder
public class AppointmentResponse {
    private Long id;
    private Long doctorId;
    private String doctorName;
    private Long patientId;
    private String patientName;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private Set<AppointmentService> services;
    private String concerns;
    private String status;
}
