package com.seanghai.phoneshop.controller;

import com.seanghai.phoneshop.dto.Dtos.*;
import com.seanghai.phoneshop.service.AccountService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/account")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @PutMapping("/profile")
    public UserResponse updateProfile(@Valid @RequestBody ProfileUpdateRequest request, Authentication authentication) {
        return accountService.updateProfile(authentication.getName(), request);
    }

    @PutMapping("/password")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody PasswordChangeRequest request, Authentication authentication) {
        accountService.changePassword(authentication.getName(), request);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/addresses")
    public List<AddressResponse> addresses(Authentication authentication) {
        return accountService.addresses(authentication.getName());
    }

    @PostMapping("/addresses")
    public AddressResponse createAddress(@Valid @RequestBody AddressRequest request, Authentication authentication) {
        return accountService.createAddress(authentication.getName(), request);
    }

    @PutMapping("/addresses/{id}")
    public AddressResponse updateAddress(@PathVariable Long id, @Valid @RequestBody AddressRequest request, Authentication authentication) {
        return accountService.updateAddress(authentication.getName(), id, request);
    }

    @DeleteMapping("/addresses/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long id, Authentication authentication) {
        accountService.deleteAddress(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
