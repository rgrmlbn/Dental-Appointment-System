package com.Rogerd3v.main.modules.appointment.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Builder
public class AvailableSlotResponse {

    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
}
