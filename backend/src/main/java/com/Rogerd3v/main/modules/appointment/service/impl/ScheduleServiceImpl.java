package com.Rogerd3v.main.modules.appointment.service.impl;

import com.Rogerd3v.main.exception.ResourceNotFoundException;
import com.Rogerd3v.main.modules.appointment.dto.request.CreateOverrideRequest;
import com.Rogerd3v.main.modules.appointment.dto.response.AvailableSlotResponse;
import com.Rogerd3v.main.modules.appointment.dto.response.OverrideResponse;
import com.Rogerd3v.main.modules.appointment.entity.AppointmentEntity;
import com.Rogerd3v.main.modules.appointment.entity.DoctorEntity;
import com.Rogerd3v.main.modules.appointment.entity.DoctorScheduleOverride;
import com.Rogerd3v.main.modules.appointment.enums.AppointmentStatus;
import com.Rogerd3v.main.modules.appointment.repository.AppointmentRepository;
import com.Rogerd3v.main.modules.appointment.repository.DoctorRepository;
import com.Rogerd3v.main.modules.appointment.repository.DoctorScheduleOverrideRepository;
import com.Rogerd3v.main.modules.appointment.service.interfaces.ScheduleService;
import com.Rogerd3v.main.modules.shared.constants.ClinicTimeSlotConstants;
import com.Rogerd3v.main.modules.shared.util.OwnershipVerifier;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import static com.Rogerd3v.main.modules.shared.constants.ClinicTimeSlotConstants.START_TIME;

@Service
@RequiredArgsConstructor
public class ScheduleServiceImpl implements ScheduleService {

    private final DoctorScheduleOverrideRepository overrideRepository;
    private final DoctorRepository doctorRepository;
    private final OwnershipVerifier ownershipVerifier;
    private final AppointmentRepository appointmentRepository;

    @Override
    public OverrideResponse createOverride(Long doctorId, CreateOverrideRequest request) {
        DoctorEntity doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor"));

        ownershipVerifier.verifyOwnershipOrAdmin(doctor.getUser());

        if (overrideRepository.existsByDoctorIdAndDate(doctorId, request.getDate())) {
            throw new IllegalArgumentException("Date is already blocked for this doctor");
        }

        List<AppointmentEntity> affectedAppointments = appointmentRepository.findByDoctorIdAndDateAndStatus(doctorId, request.getDate(), AppointmentStatus.SCHEDULED);

        for(AppointmentEntity appointment : affectedAppointments) {
            appointment.setStatus(AppointmentStatus.CANCELLED);
        }

        appointmentRepository.saveAll(affectedAppointments);

        DoctorScheduleOverride override = DoctorScheduleOverride.builder()
                .doctor(doctor)
                .date(request.getDate())
                .reason(request.getReason())
                .build();

        overrideRepository.save(override);

        return toOverrideResponse(override);
    }

    @Override
    public List<OverrideResponse> getOverridesByDoctor(Long doctorId) {
        if (!doctorRepository.existsById(doctorId)) {
            throw new ResourceNotFoundException("Doctor");
        }
        return overrideRepository.findByDoctorId(doctorId).stream()
                .map(this::toOverrideResponse)
                .toList();
    }

    @Override
    public void deleteOverride(Long doctorId, Long overrideId) {
        DoctorScheduleOverride override = overrideRepository.findById(overrideId)
                .orElseThrow(() -> new ResourceNotFoundException("Override"));

        ownershipVerifier.verifyOwnershipOrAdmin(override.getDoctor().getUser());

        List<AppointmentEntity> cancelledAppointments = appointmentRepository.findByDoctorIdAndDateAndStatus(doctorId, request.getDate(), AppointmentStatus.CANCELLED);

        for(AppointmentEntity appointment : cancelledAppointments) {
            appointment.setStatus(AppointmentStatus.SCHEDULED);
        }

        appointmentRepository.saveAll(cancelledAppointments);

        overrideRepository.delete(override);
    }

    @Override
    public List<AvailableSlotResponse> getAvailableSlots(Long doctorId, LocalDate date) {
        if (!doctorRepository.existsById(doctorId)) {
            throw new ResourceNotFoundException("Doctor");
        }

        // reject weekends
        DayOfWeek day = date.getDayOfWeek();
        if (day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY) {
            return List.of();
        }

        // reject blocked dates
        if (overrideRepository.existsByDoctorIdAndDate(doctorId, date)) {
            return List.of();
        }

        // generate slots
        List<AvailableSlotResponse> slots = new ArrayList<>();
        LocalTime current = START_TIME;
        while (!current.plusMinutes(ClinicTimeSlotConstants.SLOT_DURATION_MINUTES).isAfter(ClinicTimeSlotConstants.END_TIME)) {
            slots.add(AvailableSlotResponse.builder()
                    .date(date)
                    .startTime(current)
                    .endTime(current.plusMinutes(ClinicTimeSlotConstants.SLOT_DURATION_MINUTES))
                    .build());
            current = current.plusMinutes(ClinicTimeSlotConstants.SLOT_DURATION_MINUTES);
        }

        return slots;
    }

    private OverrideResponse toOverrideResponse(DoctorScheduleOverride override) {
        return OverrideResponse.builder()
                .id(override.getId())
                .doctorId(override.getDoctor().getId())
                .date(override.getDate())
                .reason(override.getReason())
                .build();
    }
}
