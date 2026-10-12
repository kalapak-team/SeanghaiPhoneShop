package com.seanghai.phoneshop.repository;

import com.seanghai.phoneshop.entity.Role;
import com.seanghai.phoneshop.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    long countByRole(Role role);
    List<User> findByRoleOrderByCreatedAtDesc(Role role);
}
