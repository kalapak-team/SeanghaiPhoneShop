package com.seanghai.phoneshop.config;

import com.seanghai.phoneshop.entity.*;
import com.seanghai.phoneshop.repository.BrandRepository;
import com.seanghai.phoneshop.repository.CategoryRepository;
import com.seanghai.phoneshop.repository.ProductRepository;
import com.seanghai.phoneshop.util.SlugUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Configuration
public class BulkProductSeeder {

    private static final Logger log = LoggerFactory.getLogger(BulkProductSeeder.class);
    private static final int TARGET = 1000;

    private final ProductRepository products;
    private final BrandRepository brands;
    private final CategoryRepository categories;
    private final boolean seedEnabled;

    public BulkProductSeeder(
            ProductRepository products,
            BrandRepository brands,
            CategoryRepository categories,
            @Value("${app.seed:true}") boolean seedEnabled
    ) {
        this.products = products;
        this.brands = brands;
        this.categories = categories;
        this.seedEnabled = seedEnabled;
    }

    private record Template(String name, String brandSlug, String categorySlug, double price, boolean secondhand) {}

    /** Runs after the web server is up so Railway health checks can succeed during long seeds. */
    @EventListener(ApplicationReadyEvent.class)
    public void seedBulkProducts() {
        if (!seedEnabled) {
            log.info("Bulk product seed skipped (app.seed=false)");
            return;
        }
        Thread.startVirtualThread(() -> {
            try {
                fillToTarget(products, brands, categories);
            } catch (Exception ex) {
                log.error("Bulk product seed failed", ex);
            }
        });
    }

    @Transactional
    void fillToTarget(ProductRepository products, BrandRepository brands, CategoryRepository categories) {
        log.info("Bulk product seed starting (current count={})", products.count());
        long existing = products.count();
        if (existing >= TARGET) {
            return;
        }

        Map<String, Brand> brandMap = brands.findAll().stream()
                .collect(Collectors.toMap(Brand::getSlug, b -> b, (a, b) -> a));
        Map<String, Category> categoryMap = categories.findAll().stream()
                .collect(Collectors.toMap(Category::getSlug, c -> c, (a, b) -> a));

        if (brandMap.isEmpty() || categoryMap.isEmpty()) {
            return;
        }

        List<Template> templates = templates();
        String[] storages = {"64G+4G", "128G+6G", "128G+8G", "256G+8G", "256G+12G", "512G+12G", "512G+16G", "1TB+16G"};
        String[] colors = {"Black", "White", "Blue", "Green", "Silver", "Gold", "Purple", "Gray"};
        String[] warranties = {"1 year warranty", "ធានា១ឆ្នាំ", "Store warranty", "2 years warranty"};

        int need = (int) (TARGET - existing);
        List<Product> batch = new ArrayList<>(Math.min(need, 100));
        int created = 0;
        int seq = (int) existing + 1;

        while (created < need) {
            Template t = templates.get(created % templates.size());
            Brand brand = brandMap.get(t.brandSlug());
            Category category = categoryMap.get(t.categorySlug());
            if (brand == null || category == null) {
                created++;
                continue;
            }

            String storage = storages[created % storages.length];
            String color = colors[created % colors.length];
            String warranty = warranties[created % warranties.length];
            boolean used = t.secondhand() || created % 11 == 0;
            int conditionPct = used ? 95 + (created % 5) : 100;

            String name;
            if (used && !t.name().toLowerCase().startsWith("used")) {
                name = "Used " + t.name() + " " + storage + " (" + conditionPct + "%) #" + seq;
            } else if (category.getSlug().equals("accessories") || category.getSlug().equals("watch")) {
                name = t.name() + " " + color + " #" + seq;
            } else {
                name = t.name() + " " + storage + " " + color + " #" + seq;
            }

            double price = t.price() * (0.85 + (created % 20) * 0.015);
            if (used) {
                price *= 0.72;
            }
            BigDecimal sale = BigDecimal.valueOf(price).setScale(2, RoundingMode.HALF_UP);
            BigDecimal compare = created % 4 == 0
                    ? sale.multiply(BigDecimal.valueOf(1.12 + (created % 5) * 0.02)).setScale(2, RoundingMode.HALF_UP)
                    : null;

            Product product = Product.builder()
                    .name(name)
                    .slug(SlugUtil.slugify(name) + "-" + seq)
                    .description(name + " available at Seanghai Phone Shop. Genuine product, store tested, fast delivery in Phnom Penh.")
                    .price(sale)
                    .compareAtPrice(compare)
                    .stock(used ? ThreadLocalRandom.current().nextInt(1, 6) : ThreadLocalRandom.current().nextInt(5, 40))
                    .condition(used ? ProductCondition.SECONDHAND : ProductCondition.NEW)
                    .conditionPercent(used ? conditionPct : null)
                    .brand(brand)
                    .category(category)
                    .images(List.of(ProductImageRefresher.resolveImage(name)))
                    .featured(created % 17 == 0)
                    .active(true)
                    .storage(category.getSlug().equals("accessories") ? null : storage)
                    .color(color)
                    .warranty(used ? "Store tested" : warranty)
                    .specs("Brand: " + brand.getName() + "\nStorage: " + storage + "\nColor: " + color)
                    .build();

            batch.add(product);
            created++;
            seq++;

            if (batch.size() >= 100 || created >= need) {
                products.saveAll(batch);
                batch.clear();
            }
        }
    }

    private List<Template> templates() {
        return List.of(
                // Smartphones — Apple / Samsung / OPPO / Huawei / Xiaomi / Vivo / others
                new Template("iPhone 16 Pro", "apple", "smartphone", 1549, false),
                new Template("iPhone 16 Pro Max", "apple", "smartphone", 1769, false),
                new Template("iPhone 15 Pro", "apple", "smartphone", 1199, false),
                new Template("iPhone 15 Pro Max", "apple", "smartphone", 1299, false),
                new Template("iPhone 14", "apple", "smartphone", 699, false),
                new Template("Galaxy S26 Ultra", "samsung", "smartphone", 1359, false),
                new Template("Galaxy S26", "samsung", "smartphone", 999, false),
                new Template("Galaxy S26+", "samsung", "smartphone", 1159, false),
                new Template("Galaxy S25 FE", "samsung", "smartphone", 599, false),
                new Template("Galaxy S25 Ultra", "samsung", "smartphone", 1099, false),
                new Template("Galaxy Z Fold 7", "samsung", "smartphone", 1589, false),
                new Template("Galaxy Z Flip 7", "samsung", "smartphone", 969, false),
                new Template("Galaxy A56 5G", "samsung", "smartphone", 409, false),
                new Template("Galaxy A36 5G", "samsung", "smartphone", 369, false),
                new Template("OPPO Find X8 Ultra", "oppo", "smartphone", 1599, false),
                new Template("OPPO Find X8", "oppo", "smartphone", 899, false),
                new Template("OPPO Reno16 5G", "oppo", "smartphone", 599, false),
                new Template("OPPO Reno16F 5G", "oppo", "smartphone", 469, false),
                new Template("OPPO A6 Pro", "oppo", "smartphone", 269, false),
                new Template("OPPO A6", "oppo", "smartphone", 199, false),
                new Template("Huawei Pura 90s Pro", "huawei", "smartphone", 699, false),
                new Template("Huawei Pura 90s Pro Max", "huawei", "smartphone", 1199, false),
                new Template("Huawei Mate X7", "huawei", "smartphone", 1199, false),
                new Template("Huawei Mate 80 Pro", "huawei", "smartphone", 1049, false),
                new Template("Huawei Nova 15 Max", "huawei", "smartphone", 359, false),
                new Template("Huawei Nova 14 Pro", "huawei", "smartphone", 469, false),
                new Template("Redmi Note 14 Pro Max", "xiaomi", "smartphone", 479, false),
                new Template("Redmi Note 14", "xiaomi", "smartphone", 239, false),
                new Template("Redmi 14 4G", "xiaomi", "smartphone", 189, false),
                new Template("Xiaomi 14 Ultra", "xiaomi", "smartphone", 999, false),
                new Template("POCO X7 Pro", "xiaomi", "smartphone", 349, false),
                new Template("Vivo V50 5G", "vivo", "smartphone", 489, false),
                new Template("Vivo V50 FE 5G", "vivo", "smartphone", 399, false),
                new Template("Vivo V40", "vivo", "smartphone", 289, false),
                new Template("Vivo V40 Lite", "vivo", "smartphone", 459, false),
                new Template("Realme GT 7", "realme", "smartphone", 449, false),
                new Template("Realme 14 Pro", "realme", "smartphone", 299, false),
                new Template("Realme C75", "realme", "smartphone", 149, false),
                new Template("Honor 400 Pro", "honor", "smartphone", 529, false),
                new Template("Honor X9c", "honor", "smartphone", 279, false),
                new Template("Google Pixel 8a", "google", "smartphone", 449, false),
                new Template("Google Pixel 9", "google", "smartphone", 799, false),
                new Template("Infinix Note 40 Pro", "infinix", "smartphone", 219, false),
                new Template("Tecno Camon 40", "tecno", "smartphone", 199, false),
                new Template("Nokia G42", "nokia", "smartphone", 159, false),
                new Template("RedMagic 10s Pro Gaming Phone", "samsung", "smartphone", 699, false),
                new Template("Black Shark Gaming Phone", "xiaomi", "smartphone", 599, false),

                // Tablets
                new Template("iPad Pro 11", "apple", "tablet", 899, false),
                new Template("iPad Air 11", "apple", "tablet", 649, false),
                new Template("Xiaomi Pad 8", "xiaomi", "tablet", 529, false),
                new Template("Samsung Galaxy Tab S10", "samsung", "tablet", 699, false),
                new Template("Huawei MatePad 11", "huawei", "tablet", 399, false),
                new Template("Gaming Tablet Pro", "xiaomi", "tablet", 459, false),

                // Watches
                new Template("Apple Watch Series 12", "apple", "watch", 499, false),
                new Template("Apple Watch Series 12 Milanese Loop", "apple", "watch", 639, false),
                new Template("Galaxy Watch Sport", "samsung", "watch", 299, false),
                new Template("Huawei Watch Fitness", "huawei", "watch", 249, false),
                new Template("Xiaomi Sport Watch", "xiaomi", "watch", 79, false),

                // Computers
                new Template("Apple Mac mini M6", "apple", "computer", 1019, false),
                new Template("Apple Mac mini M5 Pro", "apple", "computer", 1959, false),
                new Template("MacBook Air 13", "apple", "computer", 1099, false),
                new Template("MacBook Air 15", "apple", "computer", 1299, false),
                new Template("ASUS Vivobook Laptop", "samsung", "computer", 699, false),
                new Template("Lenovo Notebook Laptop", "xiaomi", "computer", 649, false),
                new Template("Acer Aspire Laptop", "huawei", "computer", 579, false),

                // Accessories
                new Template("Galaxy Buds4 Pro", "samsung", "accessories", 249, false),
                new Template("Galaxy Buds4 Pro White", "samsung", "accessories", 249, false),
                new Template("Galaxy Buds4 Pro Rose", "samsung", "accessories", 249, false),
                new Template("Galaxy Buds4", "samsung", "accessories", 179, false),
                new Template("AirPods 5 ANC", "apple", "accessories", 209, false),
                new Template("AirPods 4 ANC", "apple", "accessories", 149, false),
                new Template("Apple AirPods Max", "apple", "accessories", 499, false),
                new Template("XUNDD Armor Case", "xundd", "accessories", 10, false),
                new Template("DEFENDER Case", "anker", "accessories", 8, false),
                new Template("Clear MagSafe Case", "apple", "accessories", 22, false),
                new Template("ICE MagSafe Case", "apple", "accessories", 22, false),
                new Template("Crystal Shield Case for MacBook", "apple", "accessories", 33, false),
                new Template("Nillkin Frosted Shield Case", "anker", "accessories", 16, false),
                new Template("Tempered Glass Screen Protector", "anker", "accessories", 5, false),
                new Template("Anker Power Bank 20000mAh", "anker", "accessories", 39, false),
                new Template("Anker Power Bank 10000mAh", "anker", "accessories", 25, false),
                new Template("USB-C Fast Charge Adapter", "anker", "accessories", 19, false),
                new Template("MagSafe Wireless Charger", "apple", "accessories", 39, false),
                new Template("Wireless Charging Pad", "anker", "accessories", 29, false),
                new Template("Bluetooth Speaker Mini", "anker", "accessories", 45, false),
                new Template("Portable Bluetooth Speaker", "xiaomi", "accessories", 59, false),
                new Template("Smart 5G @Home Router", "huawei", "accessories", 69, false),
                new Template("WiFi 6 Mesh Router", "huawei", "accessories", 89, false),
                new Template("WANBO Portable Projector", "xiaomi", "accessories", 349, false),
                new Template("Hoco Fast Charge Adapter", "hoco", "accessories", 15, false)
        );
    }
}
