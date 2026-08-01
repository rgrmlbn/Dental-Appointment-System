package com.Rogerd3v.main.modules.appointment.dto.request;

import com.Rogerd3v.main.modules.appointment.enums.AppointmentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class AppointmentStatusRequest {

    @NotNull(message = "Status is required")
    private AppointmentStatus status;
}
