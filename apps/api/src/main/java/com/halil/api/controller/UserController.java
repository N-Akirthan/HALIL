package com.halil.api.controller;

import com.halil.api.model.Client;
import com.halil.api.model.User;
import com.halil.api.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/users")
@RestController
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<User> authenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        return ResponseEntity.ok(currentUser);
    }

    @GetMapping("/")
    public ResponseEntity<List<User>> allUsers() {
        List<User> users = userService.allUsers();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();

        if (!currentUser.getRole().equals("ADMIN") && currentUser.getId() != id) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        User updated = userService.updateUser(id, user);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{userId}/favorites/{clientId}")
    public ResponseEntity<User> addFavoriteClient(
            @PathVariable Long userId,
            @PathVariable Long clientId) {

        User updatedUser = userService.addFavoriteClient(userId, clientId);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/{userId}/favorites")
    public ResponseEntity<List<Client>> getFavoriteClients(@PathVariable Long userId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();

        if (!currentUser.getRole().equals("ADMIN") && currentUser.getId() != userId) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<Client> favorites = userService.getFavoriteClients(userId);
        return ResponseEntity.ok(favorites);
    }

    @PostMapping("/{userId}/favorites/{clientId}/toggle")
    public ResponseEntity<User> toggleFavoriteClient(
            @PathVariable Long userId,
            @PathVariable Long clientId) {

        User updatedUser = userService.toggleFavoriteClient(userId, clientId);
        return ResponseEntity.ok(updatedUser);
    }
}
