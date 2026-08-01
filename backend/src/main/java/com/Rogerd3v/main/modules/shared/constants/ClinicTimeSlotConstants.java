package com.Rogerd3v.main.modules.shared.constants;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class ClinicTimeSlotConstants {

    public static final LocalTime START_TIME = LocalTime.of(8, 0);
    public static final LocalTime END_TIME = LocalTime.of(17, 0);
    public static final int SLOT_DURATION_MINUTES = 60;
}
