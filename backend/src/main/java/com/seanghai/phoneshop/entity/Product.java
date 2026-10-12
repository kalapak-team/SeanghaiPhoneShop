package com.seanghai.phoneshop.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(length = 4000)
    private String description;

    private String sku;
    private String storage;
    private String color;
    private String warranty;
    private String specs;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(precision = 12, scale = 2)
    private BigDecimal compareAtPrice;

    @Column(nullable = false)
    @Builder.Default
    private Integer stock = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ProductCondition condition = ProductCondition.NEW;

    private Integer conditionPercent;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Brand brand;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Category category;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "url")
    @Builder.Default
    private List<String> images = new ArrayList<>();

    @Column(nullable = false)
    @Builder.Default
    private Boolean featured = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

    private Instant createdAt;

    @PrePersist
    void onCreate() {
        createdAt = Instant.now();
    }

    public String getPrimaryImage() {
        return images == null || images.isEmpty() ? null : images.get(0);
    }

    public boolean isOnSale() {
        return compareAtPrice != null && compareAtPrice.compareTo(price) > 0;
    }
}
