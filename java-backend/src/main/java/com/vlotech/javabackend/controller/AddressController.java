package com.vlotech.javabackend.controller;

import com.vlotech.javabackend.model.Address;
import com.vlotech.javabackend.service.AddressService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @PutMapping("/set-primary")
    public ResponseEntity<String> setPrimaryAddress(
            @RequestParam String userId,
            @RequestParam Long addressId) {
        addressService.setPrimaryAddress(userId, addressId);
        return ResponseEntity.ok("Primary address updated successfully");
    }

    @PostMapping("/add")
    public ResponseEntity<Address> addAddress(@RequestParam String userId, @RequestBody Address address) {
        Address savedAddress = addressService.addAddress(userId, address);
        return ResponseEntity.ok(savedAddress);
    }
    @PutMapping("/update")
    public ResponseEntity<Address> updateAddress(@RequestBody Address address) {
        Address updatedAddress = addressService.updateAddress(address);
        if (updatedAddress != null) {
            return ResponseEntity.ok(updatedAddress);
        } else {
            return ResponseEntity.status(404).body(null);
        }
    }
    @GetMapping("/all")
    public ResponseEntity<List<Address>> getAllAddresses() {
        List<Address> addresses = addressService.getAllAddresses();
        return ResponseEntity.ok(addresses);
    }

}