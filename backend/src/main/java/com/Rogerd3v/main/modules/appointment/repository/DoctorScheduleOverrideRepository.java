package com.Rogerd3v.main.modules.appointment.repository;

import com.Rogerd3v.main.modules.appointment.entity.DoctorScheduleOverride;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DoctorScheduleOverrideRepository extends JpaRepository<DoctorScheduleOverride, Long> {
    List<DoctorScheduleOverride> findByDoctorId(Long doctorId);
    boolean existsByDoctorIdAndDate(Long doctorId, LocalDate date);
}
