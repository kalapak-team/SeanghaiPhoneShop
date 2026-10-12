package com.seanghai.phoneshop.repository;

import com.seanghai.phoneshop.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BrandRepository extends JpaRepository<Brand, Long> {
    Optional<Brand> findBySlug(String slug);
    List<Brand> findAllByOrderBySortOrderAscNameAsc();
    List<Brand> findByShowOnHomeTrueOrderBySortOrderAsc();
}
