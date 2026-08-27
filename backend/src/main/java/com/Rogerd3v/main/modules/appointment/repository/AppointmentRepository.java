package com.Rogerd3v.main.modules.appointment.repository;

import com.Rogerd3v.main.modules.appointment.entity.AppointmentEntity;
import com.Rogerd3v.main.modules.appointment.enums.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<AppointmentEntity, Long> {

    List<AppointmentEntity> findByPatientId(Long id);
    List<AppointmentEntity> findByDoctorId(Long id);
    List<AppointmentEntity> findByDoctorIdAndDateAndStatus(Long id, LocalDate date, AppointmentStatus status);
    boolean existsByDoctorIdAndDateAndStartTimeAndStatus(
            Long doctorId,
            LocalDate date,
            LocalTime startTime,
            AppointmentStatus status
    );
    void deleteByPatientId(Long id);
}
