package com.Rogerd3v.main.modules.appointment.controller;

import com.Rogerd3v.main.modules.appointment.dto.request.CreateOverrideRequest;
import com.Rogerd3v.main.modules.appointment.dto.response.AvailableSlotResponse;
import com.Rogerd3v.main.modules.appointment.dto.response.OverrideResponse;
import com.Rogerd3v.main.modules.appointment.service.interfaces.ScheduleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleService scheduleService;

    @PostMapping("/{id}/overrides")
    public ResponseEntity<OverrideResponse> createOverride(
            @PathVariable Long id,
            @RequestBody @Valid CreateOverrideRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(scheduleService.createOverride(id, request));
    }

    @GetMapping("/{id}/overrides")
    public ResponseEntity<List<OverrideResponse>> getOverridesById(@PathVariable Long id) {
        return ResponseEntity.ok(scheduleService.getOverridesByDoctor(id));
    }

    @DeleteMapping("/{id}/overrides/{oid}")
    public ResponseEntity<Void> deleteOverrideById(
            @PathVariable Long id,
            @PathVariable Long oid) {
        scheduleService.deleteOverride(id, oid);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/slots")
    public ResponseEntity<List<AvailableSlotResponse>> getAvailableSlotsByIdAndDate(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(scheduleService.getAvailableSlots(id, date));
    }
}
