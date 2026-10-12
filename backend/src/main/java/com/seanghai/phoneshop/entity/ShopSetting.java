package com.seanghai.phoneshop.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "shop_settings")
public class ShopSetting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String shopName;
    private String tagline;
    private String khmerPhone;
    private String englishPhone;
    private String email;
    private String telegramUrl;
    private String telegramChannelUrl;
    private String facebookUrl;
    private String announcement;
    private String about;
    private String freeDeliveryNote;
}
