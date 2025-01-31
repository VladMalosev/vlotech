package com.vlotech.javabackend.controller;


import com.vlotech.javabackend.model.User;
import com.vlotech.javabackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        User savedUser = userService.registerUser(user);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginUser(@RequestBody User user) {
        try {
            // Authenticate and generate a token
            String token = userService.loginUser(user.getEmail(), user.getPassword());

            ResponseCookie cookie = ResponseCookie.from("jwt", token)
                    .httpOnly(true)                     // Prevent access from JavaScript
                    .secure(false)                      // Set to true if using HTTPS
                    .path("/")
                    .maxAge(10 * 60 * 60)              // 10h
                    .sameSite("Strict")                // CSRF protection
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(Map.of("message", "Successfully logged in."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/validate-token")
    public ResponseEntity<Map<String, String>> validateToken(@CookieValue(name= "jwt", required = false) String jwt) {
       if (jwt == null) {
           return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                   .body(Map.of("message", "Unauthorized"));
       }
       try {
           userService.validateToken(jwt);
           return ResponseEntity.ok(Map.of("message", "Successfully logged in."));
       } catch (Exception e) {
           return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                   .body(Map.of("message", e.getMessage()));
       }
    }





    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser() {
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0) // Expire immediately
                .sameSite("Strict")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(Map.of("message", "Successfully logged out."));
    }


    @GetMapping("/profile")
    public ResponseEntity<User> getUserProfile(@CookieValue(name = "jwt", required = false) String jwt) {
        if (jwt == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(null);
        }
        try {
            String email = userService.getUserEmailFromToken(jwt);
            Optional<User> user = userService.findByEmail(email);

            if (user.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(null);
            }

            return ResponseEntity.ok(user.get());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(null);
        }
    }


}