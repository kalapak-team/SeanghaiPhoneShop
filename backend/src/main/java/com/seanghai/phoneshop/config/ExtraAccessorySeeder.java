package com.seanghai.phoneshop.config;

import com.seanghai.phoneshop.entity.*;
import com.seanghai.phoneshop.repository.BrandRepository;
import com.seanghai.phoneshop.repository.CategoryRepository;
import com.seanghai.phoneshop.repository.ProductRepository;
import com.seanghai.phoneshop.util.SlugUtil;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Adds accessory products for the 30 newly generated images that had no matching SKUs yet.
 */
@Configuration
public class ExtraAccessorySeeder {

    private record Item(String name, String brandSlug, String categorySlug, String price) {}

    @Bean
    @Order(160)
    CommandLineRunner seedExtraAccessories(
            ProductRepository products,
            BrandRepository brands,
            CategoryRepository categories
    ) {
        return args -> {
            try {
                insertMissing(products, brands, categories);
            } catch (Exception ex) {
                System.err.println("Extra accessory seed skipped: " + ex.getMessage());
            }
        };
    }

    @Transactional
    void insertMissing(ProductRepository products, BrandRepository brands, CategoryRepository categories) {
        if (products.findBySlug("car-charger-dual-port-black").isPresent()) {
            return;
        }

        Map<String, Brand> brandMap = brands.findAll().stream()
                .collect(Collectors.toMap(Brand::getSlug, b -> b, (a, b) -> a));
        Map<String, Category> categoryMap = categories.findAll().stream()
                .collect(Collectors.toMap(Category::getSlug, c -> c, (a, b) -> a));

        if (brandMap.isEmpty() || categoryMap.isEmpty()) {
            return;
        }

        Brand fallbackBrand = brandMap.values().iterator().next();
        Brand anker = brandMap.getOrDefault("anker", fallbackBrand);
        Category accessories = categoryMap.get("accessories");
        if (accessories == null) {
            return;
        }

        List<Item> items = List.of(
                new Item("Dual Port Car Charger Black", "anker", "accessories", "12"),
                new Item("Fast Car Charger USB-C", "hoco", "accessories", "15"),
                new Item("Aluminum Phone Desk Stand", "anker", "accessories", "18"),
                new Item("Adjustable Phone Holder Stand", "hoco", "accessories", "14"),
                new Item("Portable External SSD 512GB", "anker", "computer", "119"),
                new Item("Portable External SSD 1TB", "samsung", "computer", "159"),
                new Item("HD Webcam 1080p", "anker", "computer", "49"),
                new Item("4K Webcam Pro", "samsung", "computer", "89"),
                new Item("USB-C Multiport Hub", "anker", "computer", "39"),
                new Item("USB Hub 7 Port", "hoco", "computer", "29"),
                new Item("Action Camera 4K Waterproof", "xiaomi", "accessories", "99"),
                new Item("Action Cam Travel Kit", "anker", "accessories", "79"),
                new Item("Smartphone Gimbal Stabilizer", "xiaomi", "accessories", "129"),
                new Item("Bluetooth Selfie Stick Gimbal", "hoco", "accessories", "35"),
                new Item("MicroSD Memory Card 128GB", "samsung", "accessories", "16"),
                new Item("MicroSD Memory Card 256GB", "samsung", "accessories", "28"),
                new Item("Wireless Neckband Earphones", "xiaomi", "accessories", "25"),
                new Item("Sport Neckband Earphones", "hoco", "accessories", "19"),
                new Item("WiFi Smart Plug", "xiaomi", "accessories", "15"),
                new Item("Smart Plug Dual Pack", "anker", "accessories", "22"),
                new Item("LED Ring Light with Tripod", "anker", "accessories", "45"),
                new Item("Selfie Ring Light Desk", "hoco", "accessories", "29"),
                new Item("Tablet Stylus Pen White", "apple", "accessories", "49"),
                new Item("Universal Stylus Pen", "samsung", "accessories", "25"),
                new Item("Wireless Mouse Slim Black", "anker", "computer", "18"),
                new Item("Slim Wireless Keyboard Silver", "anker", "computer", "35"),
                new Item("Wired Earphones 3.5mm White", "hoco", "accessories", "8"),
                new Item("Fitness Smart Band Black", "xiaomi", "watch", "29"),
                new Item("Mi Band Style Fitness Band", "xiaomi", "watch", "35"),
                new Item("Hoco Fast Wall Charger", "hoco", "accessories", "12")
        );

        for (Item item : items) {
            Brand brand = brandMap.getOrDefault(item.brandSlug(), anker);
            Category category = categoryMap.getOrDefault(item.categorySlug(), accessories);
            String slug = SlugUtil.slugify(item.name());
            if (products.findBySlug(slug).isPresent()) {
                continue;
            }
            products.save(Product.builder()
                    .name(item.name())
                    .slug(slug)
                    .description(item.name() + " available at Seanghai Phone Shop.")
                    .price(new BigDecimal(item.price()))
                    .stock(25)
                    .condition(ProductCondition.NEW)
                    .brand(brand)
                    .category(category)
                    .images(List.of(ProductImageRefresher.resolveImage(item.name())))
                    .featured(false)
                    .active(true)
                    .warranty("1 year warranty")
                    .build());
        }
    }
}
