package com.Rogerd3v.main.modules.appointment.controller;

import com.Rogerd3v.main.modules.appointment.dto.request.CreateDoctorRequest;
import com.Rogerd3v.main.modules.appointment.dto.request.UpdateDoctorRequest;
import com.Rogerd3v.main.modules.appointment.dto.response.DoctorResponse;
import com.Rogerd3v.main.modules.appointment.entity.DoctorEntity;
import com.Rogerd3v.main.modules.appointment.service.interfaces.DoctorService;
import com.Rogerd3v.main.modules.user.dto.request.UpdateUserRequest;
import com.Rogerd3v.main.modules.user.service.interfaces.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
@Valid
public class DoctorController {

    private final DoctorService doctorService;

    @GetMapping("/me")
    public ResponseEntity<DoctorResponse> getMe() {
        return ResponseEntity.ok(doctorService.getMe());
    }

    @GetMapping
    public ResponseEntity<List<DoctorResponse>> getDoctors() {

        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @PostMapping("/register")
    public ResponseEntity<DoctorResponse> registerDoctor(@RequestBody @Valid CreateDoctorRequest request){

        return ResponseEntity.status(HttpStatus.CREATED).body(doctorService.register(request));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<DoctorResponse> updateDoctorById(@PathVariable @Positive Long id, @RequestBody @Valid UpdateDoctorRequest update) {

            return ResponseEntity.ok(doctorService.updateDoctorById(id, update));
    }

}
