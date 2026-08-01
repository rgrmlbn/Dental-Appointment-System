package com.Rogerd3v.main.modules.appointment.dto.response;

import com.Rogerd3v.main.modules.appointment.enums.AppointmentService;
import com.Rogerd3v.main.modules.appointment.enums.AppointmentStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Set;

@Getter
@Builder
public class AppointmentSummaryResponse {
    private Long id;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private AppointmentStatus status;
    private String doctorName;
    private String patientName;
    private Set<AppointmentService> services;
}
