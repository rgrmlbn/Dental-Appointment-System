package com.Rogerd3v.main.modules.appointment.entity;

import com.Rogerd3v.main.modules.appointment.enums.AppointmentStatus;
import com.Rogerd3v.main.modules.appointment.enums.AppointmentService;
import com.Rogerd3v.main.modules.shared.entity.BaseEntity;
import com.Rogerd3v.main.modules.user.entity.UserEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "appointments")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private DoctorEntity doctor;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private UserEntity patient;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @ElementCollection
    @CollectionTable(
            name = "appointment_services",
            joinColumns = @JoinColumn(name = "appointment_id")
    )
    @Column(name = "service", nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Set<AppointmentService> services = new HashSet<>();

    @Column(columnDefinition = "TEXT", nullable = false)
    private String concerns;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private AppointmentStatus status = AppointmentStatus.SCHEDULED;
}
