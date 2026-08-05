package com.halil.api.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "blocking_period")
@Getter
@Setter
public class BlockingPeriod {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "StartDate is mandatory")
    private LocalDate startDate;

    @NotBlank(message = "EndDate is mandatory")
    private LocalDate endDate;

    private String cause;

    @ManyToOne
    @JoinColumn(name = "client_id")
    @JsonIgnoreProperties("blocking_periods")
    private Client client;
}
