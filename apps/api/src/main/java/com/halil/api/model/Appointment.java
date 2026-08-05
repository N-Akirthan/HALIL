package com.halil.api.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "appointment")
@Getter
@Setter
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private LocalDate date;

    private LocalTime startTime;

    private LocalTime endTime;

    private String note;

    private boolean isDone = false;

    @ManyToOne
    @JoinColumn(name = "client_id")
    @JsonIgnoreProperties("appointments")
    private Client client;
}

