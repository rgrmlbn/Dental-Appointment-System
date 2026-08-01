package com.Rogerd3v.main.modules.appointment.service.impl;

import com.Rogerd3v.main.exception.DuplicateLicenseNumberException;
import com.Rogerd3v.main.exception.ResourceNotFoundException;
import com.Rogerd3v.main.modules.appointment.dto.request.CreateDoctorRequest;
import com.Rogerd3v.main.modules.appointment.dto.request.UpdateDoctorRequest;
import com.Rogerd3v.main.modules.appointment.dto.response.DoctorResponse;
import com.Rogerd3v.main.modules.appointment.entity.DoctorEntity;

import com.Rogerd3v.main.modules.appointment.mapper.DoctorMapper;
import com.Rogerd3v.main.modules.appointment.repository.DoctorRepository;

import com.Rogerd3v.main.modules.appointment.service.interfaces.DoctorService;
import com.Rogerd3v.main.modules.shared.util.OwnershipVerifier;
import com.Rogerd3v.main.modules.user.entity.UserEntity;
import com.Rogerd3v.main.modules.user.enums.UserRole;
import com.Rogerd3v.main.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;
    private final DoctorMapper doctorMapper;
    private final OwnershipVerifier ownershipVerifier;
    private final UserRepository userRepository;

    @Override
    public DoctorResponse getMe() {
        UserEntity currentUser = ownershipVerifier.getCurrentUser();
        DoctorEntity doctor = doctorRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor"));
        return doctorMapper.toResponse(doctor);
    }

    @Override
    public List<DoctorResponse> getAllDoctors() {
        return doctorRepository.findAll().stream()
                .map(doctorMapper::toResponse)
                .toList();
    }

    @Override
    public DoctorResponse register(CreateDoctorRequest request) {

        if (doctorRepository.existsByLicenseNumber(request.getLicenseNumber())) {
            throw new DuplicateLicenseNumberException("License number already exists");
        }

        UserEntity user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User"));

        user.setRole(UserRole.DOCTOR);
        userRepository.save(user);

        DoctorEntity doctor = doctorMapper.toEntity(request, user);
        doctorRepository.save(doctor);
        return doctorMapper.toResponse(doctor);
    }

    @Override
    public DoctorResponse updateDoctorById(Long id, UpdateDoctorRequest update) {

        DoctorEntity doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor"));

        ownershipVerifier.verifyOwnershipOrAdmin(doctor.getUser());

        if (update.getSpecializations() != null) {
            doctor.setSpecializations(update.getSpecializations());
        }

        if (update.getLicenseNumber() != null && !update.getLicenseNumber().isBlank()) {
            doctor.setLicenseNumber(update.getLicenseNumber());
        }

        if (update.getBio() != null && !update.getBio().isBlank()) {
            doctor.setBio(update.getBio());
        }

        DoctorEntity updatedDoctor = doctorRepository.save(doctor);

        return doctorMapper.toResponse(updatedDoctor);
    }
}