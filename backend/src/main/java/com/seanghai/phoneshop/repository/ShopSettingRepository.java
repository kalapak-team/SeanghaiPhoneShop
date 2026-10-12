package com.seanghai.phoneshop.repository;

import com.seanghai.phoneshop.entity.ShopSetting;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShopSettingRepository extends JpaRepository<ShopSetting, Long> {
}
