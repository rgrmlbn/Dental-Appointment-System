package com.Rogerd3v.main.modules.appointment.service.interfaces;

import com.Rogerd3v.main.modules.appointment.dto.request.CreateOverrideRequest;
import com.Rogerd3v.main.modules.appointment.dto.response.AvailableSlotResponse;
import com.Rogerd3v.main.modules.appointment.dto.response.OverrideResponse;

import java.time.LocalDate;
import java.util.List;

public interface ScheduleService {
    OverrideResponse createOverride(Long doctorId, CreateOverrideRequest request);
    List<OverrideResponse> getOverridesByDoctor(Long doctorId);
    void deleteOverride(Long doctorId, Long overrideId);
    List<AvailableSlotResponse> getAvailableSlots(Long doctorId, LocalDate date);
}
