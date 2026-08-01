package com.Rogerd3v.main.modules.appointment.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class OverrideResponse {

    private Long id;
    private Long doctorId;
    private LocalDate date;
    private String reason;
}
