package com.Rogerd3v.main.modules.appointment.mapper;

import com.Rogerd3v.main.modules.appointment.dto.request.CreateAppointmentRequest;
import com.Rogerd3v.main.modules.appointment.dto.response.AppointmentResponse;
import com.Rogerd3v.main.modules.appointment.dto.response.AppointmentSummaryResponse;
import com.Rogerd3v.main.modules.appointment.entity.AppointmentEntity;
import com.Rogerd3v.main.modules.appointment.entity.DoctorEntity;
import com.Rogerd3v.main.modules.user.entity.UserEntity;
import org.springframework.stereotype.Component;

@Component
public class AppointmentMapper {

    public AppointmentEntity toEntity(CreateAppointmentRequest request, DoctorEntity doctor, UserEntity patient) {
        return AppointmentEntity.builder()
                .doctor(doctor)
                .patient(patient)
                .date(request.getDate())
                .startTime(request.getStartTime())
                .endTime(request.getStartTime().plusMinutes(60))
                .services(request.getServices())
                .concerns(request.getConcerns())
                .build();
    }

    public AppointmentResponse toResponse(AppointmentEntity appointment) {
        return AppointmentResponse.builder()
                .id(appointment.getId())
                .doctorId(appointment.getDoctor().getId())
                .doctorName(appointment.getDoctor().getUser().getFirstName() + " " +
                        appointment.getDoctor().getUser().getLastName())
                .patientId(appointment.getPatient().getId())
                .patientName(appointment.getPatient().getFirstName() + " " +
                        appointment.getPatient().getLastName())
                .date(appointment.getDate())
                .startTime(appointment.getStartTime())
                .endTime(appointment.getEndTime())
                .concerns(appointment.getConcerns())
                .services(appointment.getServices())
                .status(appointment.getStatus().name())
                .build();
    }

    public AppointmentSummaryResponse toSummaryResponse(AppointmentEntity appointment) {
        return AppointmentSummaryResponse.builder()
                .id(appointment.getId())
                .date(appointment.getDate())
                .startTime(appointment.getStartTime())
                .endTime(appointment.getEndTime())
                .status(appointment.getStatus())
                .patientName(appointment.getPatient().getFirstName() + " " +
                        appointment.getPatient().getLastName())
                .doctorName(appointment.getDoctor().getUser().getFirstName() + " " +
                        appointment.getDoctor().getUser().getLastName())
                .services(appointment.getServices())
                .build();
    }
}
