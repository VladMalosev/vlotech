package com.vlotech.javabackend.controller;

import com.vlotech.javabackend.model.Address;
import com.vlotech.javabackend.service.AddressService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @PutMapping("/set-primary")
    public ResponseEntity<Map<String, String>> setPrimaryAddress(
            @RequestParam String userId,
            @RequestParam Long addressId) {
        addressService.setPrimaryAddress(userId, addressId);
        return ResponseEntity.ok(Map.of("message", "Primary address updated successfully"));
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

    @DeleteMapping("/delete/{addressId}")
    public ResponseEntity<Map<String, String>> deleteAddress(@PathVariable Long addressId) {
        boolean deleted = addressService.deleteAddress(addressId);
        if (deleted) {
            return ResponseEntity.ok(Map.of("message", "Address deleted successfully"));
        } else {
            return ResponseEntity.status(404).body(Map.of("message", "Address not found"));
        }
    }


    @PutMapping("/update/{addressId}")
    public ResponseEntity<Address> updateAddress(@PathVariable Long addressId, @RequestBody Address updatedAddress) {
        Address address = addressService.updateAddress(addressId, updatedAddress);
        if (address != null) {
            return ResponseEntity.ok(address);
        } else {
            return ResponseEntity.status(404).body(null);
        }
    }
}