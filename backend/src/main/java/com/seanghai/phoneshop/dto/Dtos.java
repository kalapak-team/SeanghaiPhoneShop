package com.seanghai.phoneshop.dto;

import com.seanghai.phoneshop.entity.*;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public final class Dtos {
    private Dtos() {}

    public record RegisterRequest(
            @NotBlank String name,
            @Email @NotBlank String email,
            String phone,
            @NotBlank @Size(min = 6) String password
    ) {}

    public record LoginRequest(@Email @NotBlank String email, @NotBlank String password) {}

    public record AuthResponse(String token, UserResponse user) {}

    public record UserResponse(Long id, String name, String email, String phone, String role) {
        public static UserResponse from(User user) {
            return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getPhone(), user.getRole().name());
        }
    }

    public record ProfileUpdateRequest(@NotBlank @Size(max = 120) String name, @Size(max = 40) String phone) {}

    public record PasswordChangeRequest(@NotBlank String currentPassword, @NotBlank @Size(min = 6) String newPassword) {}

    public record AddressRequest(
            @Size(max = 40) String label,
            @NotBlank @Size(max = 120) String recipientName,
            @NotBlank @Size(max = 40) String phone,
            @NotBlank @Size(max = 255) String line1,
            @Size(max = 255) String line2,
            @NotBlank @Size(max = 120) String city,
            Boolean defaultAddress
    ) {}

    public record AddressResponse(
            Long id, String label, String recipientName, String phone, String line1, String line2, String city, boolean defaultAddress
    ) {
        public static AddressResponse from(Address a) {
            return new AddressResponse(a.getId(), a.getLabel(), a.getRecipientName(), a.getPhone(), a.getLine1(), a.getLine2(), a.getCity(), a.isDefaultAddress());
        }
    }

    public record BrandResponse(Long id, String name, String slug, String logoUrl, Integer sortOrder, Boolean featured, Boolean showOnHome) {
        public static BrandResponse from(Brand b) {
            return new BrandResponse(b.getId(), b.getName(), b.getSlug(), b.getLogoUrl(), b.getSortOrder(), b.getFeatured(), b.getShowOnHome());
        }
    }

    public record CategoryResponse(Long id, String name, String slug, String description, Integer sortOrder) {
        public static CategoryResponse from(Category c) {
            return new CategoryResponse(c.getId(), c.getName(), c.getSlug(), c.getDescription(), c.getSortOrder());
        }
    }

    public record ProductCardResponse(
            Long id, String name, String slug, BigDecimal price, BigDecimal compareAtPrice,
            String image, String brand, String brandSlug, String category, String categorySlug,
            String condition, Integer conditionPercent, Boolean featured, Integer stock, String warranty
    ) {
        public static ProductCardResponse from(Product p) {
            return new ProductCardResponse(
                    p.getId(), p.getName(), p.getSlug(), p.getPrice(), p.getCompareAtPrice(),
                    p.getPrimaryImage(), p.getBrand().getName(), p.getBrand().getSlug(),
                    p.getCategory().getName(), p.getCategory().getSlug(),
                    p.getCondition().name(), p.getConditionPercent(), p.getFeatured(), p.getStock(), p.getWarranty()
            );
        }
    }

    public record ProductDetailResponse(
            Long id, String name, String slug, String description, String sku, String storage, String color,
            String warranty, String specs, BigDecimal price, BigDecimal compareAtPrice, Integer stock,
            String condition, Integer conditionPercent, BrandResponse brand, CategoryResponse category,
            List<String> images, Boolean featured, Boolean active
    ) {
        public static ProductDetailResponse from(Product p) {
            List<String> images = p.getImages() == null ? List.of() : List.copyOf(p.getImages());
            return new ProductDetailResponse(
                    p.getId(), p.getName(), p.getSlug(), p.getDescription(), p.getSku(), p.getStorage(), p.getColor(),
                    p.getWarranty(), p.getSpecs(), p.getPrice(), p.getCompareAtPrice(), p.getStock(),
                    p.getCondition().name(), p.getConditionPercent(), BrandResponse.from(p.getBrand()),
                    CategoryResponse.from(p.getCategory()), images, p.getFeatured(), p.getActive()
            );
        }
    }

    public record PageResponse<T>(List<T> content, int page, int size, long totalElements, int totalPages) {}

    public record BannerResponse(Long id, String title, String subtitle, String imageUrl, String linkUrl, String buttonText, String theme, Integer sortOrder, Boolean active) {
        public static BannerResponse from(Banner b) {
            return new BannerResponse(b.getId(), b.getTitle(), b.getSubtitle(), b.getImageUrl(), b.getLinkUrl(), b.getButtonText(), b.getTheme(), b.getSortOrder(), b.getActive());
        }
    }

    public record StoreResponse(Long id, String name, String addressKh, String addressEn, String phones, String facebookUrl, String mapUrl, Integer sortOrder) {
        public static StoreResponse from(StoreLocation s) {
            return new StoreResponse(s.getId(), s.getName(), s.getAddressKh(), s.getAddressEn(), s.getPhones(), s.getFacebookUrl(), s.getMapUrl(), s.getSortOrder());
        }
    }

    public record SettingResponse(
            String shopName, String tagline, String khmerPhone, String englishPhone, String email,
            String telegramUrl, String telegramChannelUrl, String facebookUrl, String announcement, String about, String freeDeliveryNote
    ) {
        public static SettingResponse from(ShopSetting s) {
            return new SettingResponse(s.getShopName(), s.getTagline(), s.getKhmerPhone(), s.getEnglishPhone(), s.getEmail(),
                    s.getTelegramUrl(), s.getTelegramChannelUrl(), s.getFacebookUrl(), s.getAnnouncement(), s.getAbout(), s.getFreeDeliveryNote());
        }
    }

    public record BrandSectionResponse(BrandResponse brand, List<ProductCardResponse> products) {}

    public record HomeResponse(
            SettingResponse settings,
            List<BannerResponse> banners,
            List<BrandResponse> brands,
            List<CategoryResponse> categories,
            List<ProductCardResponse> featuredProducts,
            List<BrandSectionResponse> brandSections,
            List<ProductCardResponse> secondhandProducts,
            List<ProductCardResponse> accessoryProducts,
            List<StoreResponse> stores
    ) {}

    public record OrderItemRequest(@NotNull Long productId, @Min(1) int quantity) {}

    public record CheckoutRequest(
            @NotBlank String customerName,
            @NotBlank String phone,
            String email,
            @NotBlank String address,
            String note,
            @NotEmpty List<OrderItemRequest> items
    ) {}

    public record OrderItemResponse(Long productId, String productName, String imageUrl, int quantity, BigDecimal unitPrice) {}

    public record OrderResponse(
            Long id, String orderNumber, String customerName, String phone, String email, String address,
            String note, String status, BigDecimal total, Instant createdAt, List<OrderItemResponse> items
    ) {
        public static OrderResponse from(ShopOrder order) {
            return new OrderResponse(
                    order.getId(), order.getOrderNumber(), order.getCustomerName(), order.getPhone(), order.getEmail(),
                    order.getAddress(), order.getNote(), order.getStatus().name(), order.getTotal(), order.getCreatedAt(),
                    order.getItems().stream().map(i -> new OrderItemResponse(
                            i.getProduct() != null ? i.getProduct().getId() : null,
                            i.getProductName(), i.getImageUrl(), i.getQuantity(), i.getUnitPrice()
                    )).toList()
            );
        }
    }

    public record ProductRequest(
            @NotBlank String name,
            String description,
            String sku,
            String storage,
            String color,
            String warranty,
            String specs,
            @NotNull BigDecimal price,
            BigDecimal compareAtPrice,
            Integer stock,
            ProductCondition condition,
            Integer conditionPercent,
            @NotNull Long brandId,
            @NotNull Long categoryId,
            List<String> images,
            Boolean featured,
            Boolean active
    ) {}

    public record BrandRequest(@NotBlank String name, String logoUrl, Integer sortOrder, Boolean featured, Boolean showOnHome) {}

    public record CategoryRequest(@NotBlank String name, String description, Integer sortOrder) {}

    public record BannerRequest(@NotBlank String title, String subtitle, String imageUrl, String linkUrl, String buttonText, String theme, Integer sortOrder, Boolean active) {}

    public record StoreRequest(@NotBlank String name, String addressKh, String addressEn, String phones, String facebookUrl, String mapUrl, Integer sortOrder) {}

    public record SettingRequest(
            String shopName, String tagline, String khmerPhone, String englishPhone, String email,
            String telegramUrl, String telegramChannelUrl, String facebookUrl, String announcement, String about, String freeDeliveryNote
    ) {}

    public record StatusRequest(@NotNull OrderStatus status) {}

    public record DashboardResponse(long products, long orders, long customers, BigDecimal revenue, List<OrderResponse> recentOrders) {}
}
