package com.Rogerd3v.main.modules.appointment.service.interfaces;

import com.Rogerd3v.main.modules.appointment.dto.request.CreateDoctorRequest;
import com.Rogerd3v.main.modules.appointment.dto.request.UpdateDoctorRequest;
import com.Rogerd3v.main.modules.appointment.dto.response.DoctorResponse;

import java.util.List;

public interface DoctorService {

    DoctorResponse getMe();

    List<DoctorResponse> getAllDoctors();

    DoctorResponse register(CreateDoctorRequest request);

    DoctorResponse updateDoctorById(Long id, UpdateDoctorRequest update);


}
