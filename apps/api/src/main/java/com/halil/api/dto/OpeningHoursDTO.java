package com.halil.api.dto;

import java.time.DayOfWeek;
import java.time.LocalTime;

public record OpeningHoursDTO(
        DayOfWeek dayOfWeek,
        LocalTime openTime,
        LocalTime closeTime
) {}
