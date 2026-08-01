package com.Rogerd3v.main.modules.appointment.entity;

import com.Rogerd3v.main.modules.appointment.enums.Specialization;
import com.Rogerd3v.main.modules.shared.entity.BaseEntity;
import com.Rogerd3v.main.modules.user.entity.UserEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "doctors")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DoctorEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private UserEntity user;

    @ElementCollection
    @CollectionTable(name = "doctor_specializations", joinColumns = @JoinColumn(name = "doctor_id"))
    @Column(name = "specialization", nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Set<Specialization> specializations = new HashSet<>();

    @Column(nullable = false)
    private String licenseNumber;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String bio;

}