package com.seanghai.phoneshop.service;

import com.seanghai.phoneshop.dto.Dtos.*;
import com.seanghai.phoneshop.entity.Address;
import com.seanghai.phoneshop.entity.User;
import com.seanghai.phoneshop.exception.ApiException;
import com.seanghai.phoneshop.repository.AddressRepository;
import com.seanghai.phoneshop.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AccountService {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final PasswordEncoder passwordEncoder;

    public AccountService(AuthService authService, UserRepository userRepository,
                          AddressRepository addressRepository, PasswordEncoder passwordEncoder) {
        this.authService = authService;
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserResponse updateProfile(String email, ProfileUpdateRequest request) {
        User user = authService.requireUser(email);
        user.setName(request.name().trim());
        user.setPhone(blankToNull(request.phone()));
        return UserResponse.from(userRepository.save(user));
    }

    @Transactional
    public void changePassword(String email, PasswordChangeRequest request) {
        User user = authService.requireUser(email);
        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public List<AddressResponse> addresses(String email) {
        User user = authService.requireUser(email);
        return addressRepository.findByUserIdOrderByDefaultAddressDescCreatedAtAsc(user.getId())
                .stream().map(AddressResponse::from).toList();
    }

    @Transactional
    public AddressResponse createAddress(String email, AddressRequest request) {
        User user = authService.requireUser(email);
        boolean first = addressRepository.countByUserId(user.getId()) == 0;
        Address address = Address.builder().user(user).build();
        apply(address, request);
        boolean makeDefault = first || Boolean.TRUE.equals(request.defaultAddress());
        if (makeDefault) clearDefault(user.getId());
        address.setDefaultAddress(makeDefault);
        return AddressResponse.from(addressRepository.save(address));
    }

    @Transactional
    public AddressResponse updateAddress(String email, Long id, AddressRequest request) {
        User user = authService.requireUser(email);
        Address address = requireAddress(id, user.getId());
        apply(address, request);
        if (Boolean.TRUE.equals(request.defaultAddress()) && !address.isDefaultAddress()) {
            clearDefault(user.getId());
            address.setDefaultAddress(true);
        }
        return AddressResponse.from(addressRepository.save(address));
    }

    @Transactional
    public void deleteAddress(String email, Long id) {
        User user = authService.requireUser(email);
        Address address = requireAddress(id, user.getId());
        boolean wasDefault = address.isDefaultAddress();
        addressRepository.delete(address);
        if (wasDefault) {
            addressRepository.findByUserIdOrderByDefaultAddressDescCreatedAtAsc(user.getId())
                    .stream().findFirst()
                    .ifPresent(next -> {
                        next.setDefaultAddress(true);
                        addressRepository.save(next);
                    });
        }
    }

    private void apply(Address address, AddressRequest request) {
        address.setLabel(blankToNull(request.label()));
        address.setRecipientName(request.recipientName().trim());
        address.setPhone(request.phone().trim());
        address.setLine1(request.line1().trim());
        address.setLine2(blankToNull(request.line2()));
        address.setCity(request.city().trim());
    }

    private void clearDefault(Long userId) {
        addressRepository.findByUserIdOrderByDefaultAddressDescCreatedAtAsc(userId).forEach(a -> {
            if (a.isDefaultAddress()) {
                a.setDefaultAddress(false);
                addressRepository.save(a);
            }
        });
    }

    private Address requireAddress(Long id, Long userId) {
        return addressRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Address not found"));
    }

    private static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
