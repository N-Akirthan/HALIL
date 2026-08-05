package com.halil.api.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "task")
@Getter
@Setter
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String note;

    private LocalDate date;

    private LocalTime hour;

    private boolean isDone = false;

    @ManyToOne
    @JoinColumn(name = "client_id")
    @JsonIgnoreProperties("tasks")
    private Client client;
}
