package com.Rogerd3v.main.modules.appointment.service.impl;

import com.Rogerd3v.main.exception.ResourceNotFoundException;
import com.Rogerd3v.main.exception.SlotUnavailableException;
import com.Rogerd3v.main.modules.appointment.dto.request.AppointmentStatusRequest;
import com.Rogerd3v.main.modules.appointment.dto.request.CreateAppointmentRequest;
import com.Rogerd3v.main.modules.appointment.dto.request.UpdateAppointmentRequest;
import com.Rogerd3v.main.modules.appointment.dto.response.AppointmentResponse;
import com.Rogerd3v.main.modules.appointment.dto.response.AppointmentSummaryResponse;
import com.Rogerd3v.main.modules.appointment.dto.response.AvailableSlotResponse;
import com.Rogerd3v.main.modules.appointment.entity.AppointmentEntity;
import com.Rogerd3v.main.modules.appointment.entity.DoctorEntity;
import com.Rogerd3v.main.modules.appointment.enums.AppointmentStatus;
import com.Rogerd3v.main.modules.appointment.mapper.AppointmentMapper;
import com.Rogerd3v.main.modules.appointment.repository.AppointmentRepository;
import com.Rogerd3v.main.modules.appointment.repository.DoctorRepository;
import com.Rogerd3v.main.modules.appointment.service.interfaces.AppointmentService;
import com.Rogerd3v.main.modules.appointment.service.interfaces.ScheduleService;
import com.Rogerd3v.main.modules.shared.util.OwnershipVerifier;
import com.Rogerd3v.main.modules.user.entity.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final AppointmentMapper appointmentMapper;
    private final DoctorRepository doctorRepository;
    private final ScheduleService scheduleService;
    private final OwnershipVerifier ownershipVerifier;
    private final BookingEmailServiceImpl bookingEmailService;

    @Override
    public AppointmentResponse bookAppointment(CreateAppointmentRequest request) {

        DoctorEntity doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor"));

        List<AvailableSlotResponse> availableSlots = scheduleService
                .getAvailableSlots(request.getDoctorId(), request.getDate());

        LocalTime now = LocalTime.now();
        LocalDate today = LocalDate.now();

        if (today.isAfter(request.getDate())) {
            throw new IllegalStateException("The selected date has already passed");
        }

        boolean slotExists = availableSlots.stream()
                .anyMatch(slot -> slot.getStartTime().equals(request.getStartTime()));

        if (!slotExists) {
            throw new SlotUnavailableException("Slot is not available");
        }

        if (request.getDate().equals(today)
                && !now.isBefore(request.getStartTime())) {
            throw new IllegalStateException("The selected time slot has already passed");
        }

        if (appointmentRepository.existsByDoctorIdAndDateAndStartTimeAndStatus(
                request.getDoctorId(), request.getDate(), request.getStartTime(), AppointmentStatus.SCHEDULED)) {
            throw new SlotUnavailableException("Slot is already booked");
        }

        UserEntity patient = ownershipVerifier.getCurrentUser();

        AppointmentEntity appointment = appointmentMapper.toEntity(request, doctor, patient);
        appointmentRepository.save(appointment);

        // Send booking confirmation email
        bookingEmailService.sendBookingConfirmation(appointment);

        return appointmentMapper.toResponse(appointment);
    }

    @Override
    public AppointmentResponse getAppointmentById(Long id) {

        AppointmentEntity appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment"));

        return appointmentMapper.toResponse(appointment);
    }

    @Override
    public List<AppointmentSummaryResponse> getAppointmentsByDoctor(Long doctorId) {

        return appointmentRepository.findByDoctorId(doctorId)
                .stream()
                .map(appointmentMapper::toSummaryResponse)
                .toList();
    }

    @Override
    public List<AppointmentSummaryResponse> getAppointmentsByPatient(Long patientId) {
        return appointmentRepository.findByPatientId(patientId)
                .stream()
                .map(appointmentMapper::toSummaryResponse)
                .toList();
    }

    @Override
    public AppointmentResponse updateAppointment(Long id, UpdateAppointmentRequest update) {

        AppointmentEntity appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment"));

        ownershipVerifier.verifyOwnershipOrAdmin(appointment.getPatient());

        if (update.getDate() != null && update.getStartTime() != null) {

            List<AvailableSlotResponse> availableSlots = scheduleService
                    .getAvailableSlots(appointment.getDoctor().getId(), update.getDate());

            boolean slotExists = availableSlots.stream()
                    .anyMatch(slot -> slot.getStartTime().equals(update.getStartTime()));

            if (!slotExists) {
                throw new SlotUnavailableException("Selected slot is not available");
            }

            if (appointmentRepository.existsByDoctorIdAndDateAndStartTimeAndStatus(
                    appointment.getDoctor().getId(), update.getDate(), update.getStartTime(), AppointmentStatus.SCHEDULED)) {
                throw new SlotUnavailableException("Slot is already booked");
            }

            appointment.setDate(update.getDate());
            appointment.setStartTime(update.getStartTime());
            appointment.setEndTime(update.getStartTime().plusMinutes(60));
        }

        if (update.getServices() != null) {
            appointment.setServices(update.getServices());
        }

        if (update.getConcerns() != null && !update.getConcerns().isBlank()) {
            appointment.setConcerns(update.getConcerns());
        }

        appointmentRepository.save(appointment);
        return appointmentMapper.toResponse(appointment);
    }

    @Override
    public AppointmentResponse completeAppointment(Long id) {

        AppointmentEntity appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment"));

        ownershipVerifier.verifyOwnershipOrAdmin(appointment.getDoctor().getUser());

        if(appointment.getStatus() != AppointmentStatus.SCHEDULED){
            throw new IllegalStateException("Only scheduled appointment can be completed");
        }

        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        if(!appointment.getDate().equals(today)){
            throw new IllegalStateException("Only appointment scheduled for today can be completed");
        }

        if(now.isBefore(appointment.getStartTime())){
            throw new IllegalStateException("Appointment cannot be completed before its scheduled time");
        }

        appointment.setStatus(AppointmentStatus.COMPLETED);

        appointmentRepository.save(appointment);

        return appointmentMapper.toResponse(appointment);

    }

    @Override
    public AppointmentResponse updateAppointmentStatus(Long id, AppointmentStatusRequest update) {

        AppointmentEntity appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment"));

        ownershipVerifier.verifyOwnershipOrAdmin(appointment.getDoctor().getUser());

        appointment.setStatus(update.getStatus());
        appointmentRepository.save(appointment);

        return appointmentMapper.toResponse(appointment);
    }

    @Override
    public AppointmentResponse cancelAppointment(Long id) {
        AppointmentEntity appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment"));

        ownershipVerifier.verifyOwnershipOrAdmin(appointment.getPatient());

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointmentRepository.save(appointment);

        return appointmentMapper.toResponse(appointment);
    }

    @Override
    public void deleteAppointment(Long id) {
        AppointmentEntity appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment"));

        ownershipVerifier.verifyOwnershipOrAdmin(appointment.getPatient());

        appointmentRepository.delete(appointment);
        appointmentMapper.toResponse(appointment);
    }

}
