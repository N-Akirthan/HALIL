package com.halil.api.service;

import com.halil.api.model.Task;
import com.halil.api.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {
    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> getTasksByClient(Long clientId) {
        return taskRepository.findByClientId(clientId);
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Task updateTask(Long id, Task updatedTask) {
        return taskRepository.findById(id)
                .map(existing -> {
                    existing.setTitle(updatedTask.getTitle());
                    existing.setNote(updatedTask.getNote());
                    existing.setDate(updatedTask.getDate());
                    existing.setHour(updatedTask.getHour());
                    existing.setDone(updatedTask.isDone());
                    return taskRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Task not found"));
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    public Task createTask(Task task) {
        return taskRepository.save(task);
    }
}
