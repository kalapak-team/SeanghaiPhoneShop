package com.seanghai.phoneshop.repository;

import com.seanghai.phoneshop.entity.ShopOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ShopOrderRepository extends JpaRepository<ShopOrder, Long> {
    List<ShopOrder> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
    List<ShopOrder> findAllByOrderByCreatedAtDesc();
    Optional<ShopOrder> findByOrderNumber(String orderNumber);
}
