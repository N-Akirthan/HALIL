package com.halil.api.service;

import com.halil.api.model.Appointment;
import com.halil.api.model.Task;
import com.halil.api.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;

    public AppointmentService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    public List<Appointment> getAppointmentsByClient(Long clientId) {
        return appointmentRepository.findByClientId(clientId);
    }

    public Appointment updateAppointment(Long id, Appointment updatedAppointment) {
        return appointmentRepository.findById(id)
                .map(existing -> {
                    existing.setDate(updatedAppointment.getDate());
                    existing.setStartTime(updatedAppointment.getStartTime());
                    existing.setEndTime(updatedAppointment.getEndTime());
                    existing.setNote(updatedAppointment.getNote());
                    existing.setTitle(updatedAppointment.getTitle());
                    existing.setDone(updatedAppointment.isDone());
                    return appointmentRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
    }

    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }

    public Appointment createAppointment(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }
}

