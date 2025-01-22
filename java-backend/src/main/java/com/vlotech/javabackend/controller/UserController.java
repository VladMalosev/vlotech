package com.vlotech.javabackend.controller;


import com.vlotech.javabackend.model.User;
import com.vlotech.javabackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")

public class UserController {
    private final UserService userService;


    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    };

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) { //requestbody binds HTTP request to the 'user' object

        User savedUser = userService.registerUser(user); //register by passing to the service
        return ResponseEntity.ok(savedUser);
    }

}
