package com.Rogerd3v.main.modules.appointment.repository;

import com.Rogerd3v.main.modules.appointment.entity.DoctorEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<DoctorEntity, Long> {

    Optional<DoctorEntity> findByUserId(Long userId);

    boolean existsByLicenseNumber(String licenseNumber);

}
