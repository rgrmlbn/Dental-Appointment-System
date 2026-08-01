package com.Rogerd3v.main.modules.appointment.service.interfaces;

import com.Rogerd3v.main.modules.appointment.dto.request.AppointmentStatusRequest;
import com.Rogerd3v.main.modules.appointment.dto.request.CreateAppointmentRequest;
import com.Rogerd3v.main.modules.appointment.dto.request.UpdateAppointmentRequest;
import com.Rogerd3v.main.modules.appointment.dto.response.AppointmentResponse;
import com.Rogerd3v.main.modules.appointment.dto.response.AppointmentSummaryResponse;


import java.util.List;

public interface AppointmentService {
    AppointmentResponse bookAppointment(CreateAppointmentRequest request);
    AppointmentResponse getAppointmentById(Long id);
    List<AppointmentSummaryResponse> getAppointmentsByDoctor(Long doctorId);
    List<AppointmentSummaryResponse> getAppointmentsByPatient(Long patientId);
    AppointmentResponse updateAppointment(Long id, UpdateAppointmentRequest request);
    AppointmentResponse cancelAppointment(Long id);
    AppointmentResponse updateAppointmentStatus(Long id, AppointmentStatusRequest request);
    AppointmentResponse deleteAppointment(Long id);

}
