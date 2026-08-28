package com.Rogerd3v.main.modules.appointment.controller;

import com.Rogerd3v.main.modules.appointment.dto.request.AppointmentStatusRequest;
import com.Rogerd3v.main.modules.appointment.dto.request.CreateAppointmentRequest;
import com.Rogerd3v.main.modules.appointment.dto.request.UpdateAppointmentRequest;
import com.Rogerd3v.main.modules.appointment.dto.response.AppointmentResponse;
import com.Rogerd3v.main.modules.appointment.dto.response.AppointmentSummaryResponse;
import com.Rogerd3v.main.modules.appointment.service.interfaces.AppointmentService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointment")
@RequiredArgsConstructor
@Valid
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    ResponseEntity<AppointmentResponse> bookAppointment(@RequestBody @Valid CreateAppointmentRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED).body(appointmentService.bookAppointment(request));
    }

    @GetMapping("/{id}")
    ResponseEntity<AppointmentResponse> getAppointmentById(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.getAppointmentById(id));

    }

    @GetMapping("/patient/{patientId}")
    ResponseEntity<List<AppointmentSummaryResponse>> getAppointmentsByPatientById(@PathVariable Long patientId) {

        return ResponseEntity.ok(appointmentService.getAppointmentsByPatient(patientId));
    }

    @GetMapping("/doctor/{doctorId}")    // ← fixed path
    ResponseEntity<List<AppointmentSummaryResponse>> getAppointmentsByDoctorById(@PathVariable Long doctorId) {

        return ResponseEntity.ok(appointmentService.getAppointmentsByDoctor(doctorId));
    }

    @PatchMapping("/{id}/appointment")
    ResponseEntity<AppointmentResponse> updateAppointmentById(@PathVariable @Positive Long id, @RequestBody UpdateAppointmentRequest update) {

        return ResponseEntity.ok(appointmentService.updateAppointment(id, update));
    }

    @PatchMapping("/{id}/status")
    ResponseEntity<AppointmentResponse> updateAppointmentStatusById(@PathVariable @Positive Long id, @RequestBody AppointmentStatusRequest update) {

        return ResponseEntity.ok(appointmentService.updateAppointmentStatus(id, update));
    }

    @PatchMapping("/{id}/complete")
    ResponseEntity<AppointmentResponse> completeAppointmentStatusById(@PathVariable @Positive Long id) {

        return ResponseEntity.ok(appointmentService.completeAppointment(id));
    }

    @PatchMapping("/{id}/cancel")
    ResponseEntity<AppointmentResponse> cancelAppointmentById(@PathVariable @Positive Long id) {

        return ResponseEntity.ok(appointmentService.cancelAppointment(id));
    }

    @DeleteMapping("/{id}")
    ResponseEntity<Void> deleteAppointmentById(@PathVariable @Positive Long id) {

        appointmentService.deleteAppointment(id);
        return ResponseEntity.noContent().build();
    }


}

