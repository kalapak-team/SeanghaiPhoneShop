package com.seanghai.phoneshop.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "store_locations")
public class StoreLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String addressKh;

    @Column(length = 1000)
    private String addressEn;

    private String phones;
    private String facebookUrl;
    private String mapUrl;

    @Column(nullable = false)
    @Builder.Default
    private Integer sortOrder = 0;
}
