package com.seanghai.phoneshop.repository;

import com.seanghai.phoneshop.entity.StoreLocation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StoreLocationRepository extends JpaRepository<StoreLocation, Long> {
    List<StoreLocation> findAllByOrderBySortOrderAsc();
}
