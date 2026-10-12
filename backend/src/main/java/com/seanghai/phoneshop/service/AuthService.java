package com.seanghai.phoneshop.service;

import com.seanghai.phoneshop.dto.Dtos.*;
import com.seanghai.phoneshop.entity.Role;
import com.seanghai.phoneshop.entity.User;
import com.seanghai.phoneshop.exception.ApiException;
import com.seanghai.phoneshop.repository.UserRepository;
import com.seanghai.phoneshop.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new ApiException(HttpStatus.CONFLICT, "Email already registered");
        }
        User user = User.builder()
                .name(request.name())
                .email(request.email().toLowerCase())
                .phone(request.phone())
                .password(passwordEncoder.encode(request.password()))
                .role(Role.CUSTOMER)
                .build();
        userRepository.save(user);
        return new AuthResponse(jwtService.generateToken(user), UserResponse.from(user));
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email().toLowerCase())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }
        return new AuthResponse(jwtService.generateToken(user), UserResponse.from(user));
    }

    public UserResponse me(String email) {
        return UserResponse.from(requireUser(email));
    }

    public User requireUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "User not found"));
    }
}
