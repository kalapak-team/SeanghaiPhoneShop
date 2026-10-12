package com.seanghai.phoneshop.config;

import com.seanghai.phoneshop.entity.*;
import com.seanghai.phoneshop.repository.*;
import com.seanghai.phoneshop.util.SlugUtil;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.List;

@Configuration
public class DataSeeder {

    private static final String BASE = ProductImageRefresher.BASE;
    private static final String IMG_FOLD = BASE + "galaxy-z-fold.jpg";
    private static final String IMG_WATCH = BASE + "apple-watch.jpg";
    private static final String IMG_IPHONE = BASE + "iphone-16-pro.jpg";
    private static final String IMG_SAMSUNG = BASE + "galaxy-s26.jpg";
    private static final String IMG_HUAWEI = BASE + "huawei-pura-90.jpg";
    private static final String IMG_OPPO = BASE + "oppo-reno16.jpg";
    private static final String IMG_VIVO = BASE + "vivo-v50.jpg";
    private static final String IMG_XIAOMI = BASE + "redmi-note-14.jpg";
    private static final String IMG_BUDS = BASE + "galaxy-buds4-pro.jpg";
    private static final String IMG_TABLET = BASE + "xiaomi-pad.jpg";
    private static final String IMG_MAC = BASE + "macbook-air.jpg";
    private static final String IMG_CASE = BASE + "armor-case.jpg";
    private static final String IMG_USED = BASE + "google-pixel.jpg";
    private static final String IMG_ROUTER = BASE + "5g-router.jpg";
    private static final String IMG_PROJECTOR = BASE + "projector.jpg";

    @Bean
    CommandLineRunner seedData(
            UserRepository users,
            BrandRepository brands,
            CategoryRepository categories,
            ProductRepository products,
            BannerRepository banners,
            StoreLocationRepository stores,
            ShopSettingRepository settings,
            PasswordEncoder encoder
    ) {
        return args -> {
            if (users.count() > 0) {
                return;
            }

            users.save(User.builder()
                    .name("Seanghai Admin")
                    .email("admin@seanghaiphone.com")
                    .phone("012 888 999")
                    .password(encoder.encode("Admin@123"))
                    .role(Role.ADMIN)
                    .build());
            users.save(User.builder()
                    .name("Demo Customer")
                    .email("customer@seanghaiphone.com")
                    .phone("010 111 222")
                    .password(encoder.encode("Customer@123"))
                    .role(Role.CUSTOMER)
                    .build());

            settings.save(ShopSetting.builder()
                    .shopName("Seanghai Phone Shop")
                    .tagline("Top Leading Phone Shop in Cambodia")
                    .khmerPhone("012-888-999")
                    .englishPhone("098-777-666")
                    .email("seanghaiphoneshop@gmail.com")
                    .telegramUrl("https://t.me/seanghaiphoneshop")
                    .telegramChannelUrl("https://t.me/seanghaiphoneshop")
                    .facebookUrl("https://facebook.com/seanghaiphoneshop")
                    .announcement("Now we have 2 Official Facebook Pages. Please like and follow our pages to get the latest product information: \"Seanghai Phone Shop in Cambodia\" and \"Seanghai Mobile\".")
                    .about("Seanghai Phone Shop specializes in offering a broad selection of products, including smartphones, tablets, and accessories from leading brands such as Apple, Samsung and others more.")
                    .freeDeliveryNote("Free delivery for all orders over $140")
                    .build());

            stores.saveAll(List.of(
                    StoreLocation.builder().name("Seanghai Toul Tom Poung").addressKh("ផ្ទះលេខ 12, ផ្លូវ 155 ទួលទំពូង ភ្នំពេញ")
                            .addressEn("House 12, Street 155, Toul Tom Poung, Phnom Penh")
                            .phones("Smart: 012 888 999 | Cellcard: 011 888 999").facebookUrl("https://facebook.com/seanghaiphoneshop").sortOrder(1).build(),
                    StoreLocation.builder().name("Seanghai Street 271").addressKh("ផ្ទះលេខ 88 ផ្លូវ 271 ភ្នំពេញ")
                            .addressEn("House 88, Street 271, Phnom Penh")
                            .phones("Smart: 098 888 999 | Cellcard: 099 888 999").facebookUrl("https://facebook.com/seanghaiphoneshop271").sortOrder(2).build(),
                    StoreLocation.builder().name("Seanghai Phsar Depo").addressKh("ផ្ទះលេខ 36Eo មហាវិថី 215 ភ្នំពេញ")
                            .addressEn("House 36Eo, Street 215, Phnom Penh")
                            .phones("Cellcard: 092 888 999 | Smart: 093 888 999").facebookUrl("https://facebook.com/seanghaiphoneshopdepo").sortOrder(3).build()
            ));

            Brand apple = brand(brands, "Apple", 1, true);
            Brand samsung = brand(brands, "Samsung", 2, true);
            Brand oppo = brand(brands, "OPPO", 3, true);
            Brand xiaomi = brand(brands, "Xiaomi", 4, true);
            Brand vivo = brand(brands, "Vivo", 5, true);
            Brand huawei = brand(brands, "Huawei", 6, false);
            brand(brands, "Realme", 7, false);
            brand(brands, "Honor", 8, false);
            brand(brands, "Nokia", 9, false);
            brand(brands, "Tecno", 10, false);
            Brand infinix = brand(brands, "Infinix", 11, false);
            Brand google = brand(brands, "Google", 12, false);
            Brand anker = brand(brands, "Anker", 13, false);
            Brand xundd = brand(brands, "XUNDD", 14, false);
            brand(brands, "Hoco", 15, false);

            Category smartphone = category(categories, "Smartphone", 1);
            Category tablet = category(categories, "Tablet", 2);
            Category watch = category(categories, "Watch", 3);
            Category computer = category(categories, "Computer", 4);
            Category accessories = category(categories, "Accessories", 5);

            banners.saveAll(List.of(
                    Banner.builder().title("Galaxy Z Fold 7 | Watch8 Classic").subtitle("Galaxy AI · Official Seanghai Deal")
                            .imageUrl(IMG_FOLD).linkUrl("/products").buttonText("Shop Now").theme("fold").sortOrder(1).active(true).build(),
                    Banner.builder().title("iPhone 16 Series").subtitle("Premium Apple products available in store")
                            .imageUrl(IMG_IPHONE).linkUrl("/brands/apple").buttonText("View Apple").theme("apple").sortOrder(2).active(true).build(),
                    Banner.builder().title("Secondhand Deals").subtitle("Quality used devices from 99% condition")
                            .imageUrl(BASE + "google-pixel.jpg").linkUrl("/secondhand").buttonText("Browse Used").theme("used").sortOrder(3).active(true).build(),
                    Banner.builder().title("Galaxy Watch8 Classic").subtitle("Track every move in style")
                            .imageUrl(IMG_WATCH).linkUrl("/category/watch").buttonText("Shop Watches").theme("watch").sortOrder(4).active(true).build()
            ));

            add(products, "Huawei Pura 90s Pro", huawei, smartphone, "699", "749", true, null, "512GB+16GB", "1 year warranty", null);
            add(products, "Huawei Pura 90s Pro 512GB (Free Watch)", huawei, smartphone, "899", null, true, null, "512GB", "1 year warranty + free watch", null);
            add(products, "Huawei Pura 90s Pro Max", huawei, smartphone, "1199", "1399", true, null, "512GB", "1 year warranty", null);
            add(products, "Huawei Nova 15 Max 256G+8G", huawei, smartphone, "359", null, true, null, "256GB+8GB", "1 year warranty", null);
            add(products, "Galaxy Buds4 Pro (Free Cases)", samsung, accessories, "249", null, true, null, null, "1 year warranty", null);
            add(products, "Galaxy Buds4 (Free Case)", samsung, accessories, "179", null, true, null, null, "1 year warranty", null);
            add(products, "Galaxy Buds4 Pro Rose", samsung, accessories, "249", null, true, null, null, "1 year warranty", null);
            add(products, "Galaxy Buds4 Pro White", samsung, accessories, "249", null, true, null, null, "1 year warranty", null);

            add(products, "Huawei Mate X7 512GB+16GB", huawei, smartphone, "1199", "1999", false, IMG_HUAWEI, "512GB+16GB", "1 year warranty", null);
            add(products, "Huawei Mate 80 Pro", huawei, smartphone, "1049", "1099", false, IMG_HUAWEI, "512GB", "1 year warranty", null);
            add(products, "OPPO A6c 128G+8G", oppo, smartphone, "189", null, false, IMG_OPPO, "128GB+8GB", "1 year warranty", null);
            add(products, "OPPO A6c 64G+8G", oppo, smartphone, "159", null, false, IMG_OPPO, "64GB+8GB", "1 year warranty", null);
            add(products, "Huawei Nova 14 Pro 512GB", huawei, smartphone, "469", "539", false, IMG_HUAWEI, "512GB+12GB", "1 year warranty", null);
            add(products, "Huawei Nova 14 256GB", huawei, smartphone, "399", null, false, IMG_HUAWEI, "256GB+12GB", "1 year warranty", null);
            add(products, "Huawei Pura X-Max Collect Edition", huawei, smartphone, "2059", null, false, IMG_HUAWEI, "512GB", "1 year warranty", null);
            add(products, "Huawei Pura 80 Ultra 512G+16G", huawei, smartphone, "999", "1399", false, IMG_HUAWEI, "512GB+16GB", "1 year warranty", null);

            add(products, "Apple Watch Series 12 42mm", apple, watch, "499", null, false, IMG_WATCH, null, "1 year warranty", null);
            add(products, "Apple Watch Series 12 42mm Milanese Loop", apple, watch, "639", null, false, IMG_WATCH, null, "1 year warranty", null);
            add(products, "Apple Mac mini M5 Pro 512G+24G", apple, computer, "1959", null, false, IMG_MAC, "512GB+24GB", "1 year warranty", null);
            add(products, "Apple Mac mini M6 256G+16G", apple, computer, "1019", null, false, IMG_MAC, "256GB+16GB", "1 year warranty", null);
            add(products, "iPhone 16 Pro 256GB", apple, smartphone, "1549", null, false, IMG_IPHONE, "256GB", "2 years warranty", null);
            add(products, "iPhone 16 Pro Max 256GB", apple, smartphone, "1769", null, false, IMG_IPHONE, "256GB", "2 years warranty", null);
            add(products, "iPhone 16 Pro Max 512GB", apple, smartphone, "1759", null, false, IMG_IPHONE, "512GB", "1 year warranty", null);
            add(products, "AirPods 5 ANC", apple, accessories, "209", null, false, IMG_BUDS, null, "1 year warranty", null);

            add(products, "Galaxy S26 512GB|12GB", samsung, smartphone, "1119", "1199", false, IMG_SAMSUNG, "512GB+12GB", "1 year warranty", null);
            add(products, "Galaxy S26 Ultra 256G+12G", samsung, smartphone, "1359", null, false, IMG_SAMSUNG, "256GB+12GB", "1 year warranty", null);
            add(products, "Galaxy S26+ 256G|12G", samsung, smartphone, "1159", null, false, IMG_SAMSUNG, "256GB+12GB", "1 year warranty", null);
            add(products, "Galaxy S26 256GB|12GB", samsung, smartphone, "799", "1059", false, IMG_SAMSUNG, "256GB+12GB", "1 year warranty", null);
            add(products, "Galaxy S25 FE 128G+8G", samsung, smartphone, "559", "699", false, IMG_SAMSUNG, "128GB+8GB", "1 year warranty", null);
            add(products, "Galaxy Z Fold 6", samsung, smartphone, "999", "1299", false, IMG_FOLD, "256GB", "1 year warranty", null);
            add(products, "Galaxy Z Fold 7 256G", samsung, smartphone, "1589", "1799", false, IMG_FOLD, "256GB", "1 year warranty", null);
            add(products, "Galaxy Z Flip 7 256G", samsung, smartphone, "969", "1299", false, IMG_SAMSUNG, "256GB", "1 year warranty", null);

            add(products, "OPPO Reno16F 5G 128G+8G", oppo, smartphone, "469", null, false, IMG_OPPO, "128GB+8GB", "1 year warranty", null);
            add(products, "OPPO Reno16 5G 256G+8G", oppo, smartphone, "599", null, false, IMG_OPPO, "256GB+8GB", "1 year warranty", null);
            add(products, "OPPO Find X8 Ultra 512G+12G", oppo, smartphone, "1599", null, false, IMG_OPPO, "512GB+12GB", "1 year warranty", null);
            add(products, "OPPO Find X8 256GB|12GB", oppo, smartphone, "899", null, false, IMG_OPPO, "256GB+12GB", "1 year warranty", null);
            add(products, "OPPO A6 128G+12G", oppo, smartphone, "199", null, false, IMG_OPPO, "128GB+12GB", "1 year warranty", null);
            add(products, "OPPO A6 Pro (Free Gift Buds)", oppo, smartphone, "269", null, false, IMG_OPPO, "256GB", "1 year warranty", null);

            add(products, "Xiaomi Pad 8 11.2 256G Wifi", xiaomi, tablet, "529", null, false, IMG_TABLET, "256GB", "1 year warranty", null);
            add(products, "Redmi Note 14 128G+6G", xiaomi, smartphone, "239", null, false, IMG_XIAOMI, "128GB+6GB", "1 year warranty", null);
            add(products, "Redmi Note 14 Pro Max 256G+12G", xiaomi, smartphone, "479", null, false, IMG_XIAOMI, "256GB+12GB", "1 year warranty", null);
            add(products, "Redmi 14 4G 128G+4G", xiaomi, smartphone, "189", null, false, IMG_XIAOMI, "128GB+4GB", "1 year warranty", null);

            add(products, "Vivo V40 Lite 256G+8G", vivo, smartphone, "459", null, false, IMG_VIVO, "256GB+8GB", "Pre Order", null);
            add(products, "Vivo V40 256G+8G", vivo, smartphone, "289", "319", false, IMG_VIVO, "256GB+8GB", "1 year warranty", null);
            add(products, "Vivo V50 FE 5G 256G|12G", vivo, smartphone, "399", null, false, IMG_VIVO, "256GB+12GB", "1 year warranty", null);
            add(products, "Vivo V50 5G 256G|12G", vivo, smartphone, "489", "519", false, IMG_VIVO, "256GB+12GB", "1 year warranty", null);

            addUsed(products, "Used Google Pixel 8a 128G|8G (99%)", google, smartphone, "385", IMG_USED, 99);
            addUsed(products, "Used Gaming Tablet 256G+16G (99%)", xiaomi, tablet, "565", IMG_TABLET, 99);
            addUsed(products, "Used Flagship 512G+16G (99%)", samsung, smartphone, "655", IMG_USED, 99);
            addUsed(products, "Used Xiaomi 14 Ultra (99%) 1TB", xiaomi, smartphone, "1155", IMG_XIAOMI, 99);
            addUsed(products, "Used iPhone 16 Pro Max (99%) 1TB", apple, smartphone, "1385", IMG_IPHONE, 99);
            addUsed(products, "Used Infinix Note 40 Pro 256GB (99%)", infinix, smartphone, "285", IMG_USED, 99);
            addUsed(products, "Used Apple AirPods Max (99%)", apple, accessories, "255", IMG_BUDS, 99);
            addUsed(products, "Used Galaxy S24 Ultra 256G+12G (99%)", samsung, smartphone, "1195", IMG_SAMSUNG, 99);
            addUsed(products, "Used MacBook Air 13 (99%) 256G", apple, computer, "585", IMG_MAC, 99);
            addUsed(products, "Used iPad Pro 11 (99%) 128G SIM+Wifi", apple, tablet, "615", IMG_TABLET, 99);
            addUsed(products, "Used AirPods 4 ANC (99%)", apple, accessories, "135", IMG_BUDS, 99);
            addUsed(products, "Used Galaxy S24 Ultra 512G (99%)", samsung, smartphone, "1095", IMG_SAMSUNG, 99);
            addUsed(products, "Used Galaxy S23 Ultra 1TB (99%)", samsung, smartphone, "795", IMG_SAMSUNG, 99);
            addUsed(products, "Used iPhone 15 Pro Max 256G (99%)", apple, smartphone, "735", IMG_IPHONE, 99);
            addUsed(products, "Used iPhone 16 Pro Max 256G (99%)", apple, smartphone, "915", IMG_IPHONE, 99);

            add(products, "Smart 5G @Home Router", huawei, accessories, "69", null, false, IMG_ROUTER, null, "1 year warranty", null);
            add(products, "WANBO Portable Projector", xiaomi, accessories, "349", null, false, IMG_PROJECTOR, null, "1 year warranty", null);
            add(products, "XUNDD Armor Case Pixel Style XL", xundd, accessories, "10", null, false, IMG_CASE, null, null, null);
            add(products, "XUNDD Armor Case Pixel Style Pro", xundd, accessories, "10", null, false, IMG_CASE, null, null, null);
            add(products, "XUNDD Armor Case Pixel Style", xundd, accessories, "10", null, false, IMG_CASE, null, null, null);
            add(products, "DEFENDER Case XL", anker, accessories, "8", null, false, IMG_CASE, null, null, null);
            add(products, "DEFENDER Case Pro", anker, accessories, "8", null, false, IMG_CASE, null, null, null);
            add(products, "DEFENDER Case Standard", anker, accessories, "8", null, false, IMG_CASE, null, null, null);
            add(products, "Nillkin Frosted Shield Magnetic XL", anker, accessories, "16", null, false, IMG_CASE, null, null, null);
            add(products, "Clear MagSafe Case Duo Series", apple, accessories, "22", null, false, IMG_CASE, null, null, null);
            add(products, "ICE MagSafe Case Duo Series", apple, accessories, "22", null, false, IMG_CASE, null, null, null);
            add(products, "Crystal Shield Case for MacBook", apple, accessories, "33", null, false, IMG_CASE, null, null, null);
        };
    }

    private Brand brand(BrandRepository repo, String name, int order, boolean showOnHome) {
        return repo.save(Brand.builder()
                .name(name)
                .slug(SlugUtil.slugify(name))
                .sortOrder(order)
                .featured(true)
                .showOnHome(showOnHome)
                .build());
    }

    private Category category(CategoryRepository repo, String name, int order) {
        return repo.save(Category.builder().name(name).slug(SlugUtil.slugify(name)).sortOrder(order).build());
    }

    private void add(
            ProductRepository repo, String name, Brand brand, Category category,
            String price, String compare, boolean featured, String image, String storage, String warranty, Integer percent
    ) {
        Product product = Product.builder()
                .name(name)
                .slug(uniqueSlug(repo, name))
                .description(name + " available now at Seanghai Phone Shop. Genuine product, store warranty, and fast delivery across Phnom Penh.")
                .price(new BigDecimal(price))
                .compareAtPrice(compare == null ? null : new BigDecimal(compare))
                .stock(20)
                .condition(ProductCondition.NEW)
                .conditionPercent(percent)
                .brand(brand)
                .category(category)
                .images(List.of(image != null ? image : ProductImageRefresher.resolveImage(name)))
                .featured(featured)
                .active(true)
                .storage(storage)
                .warranty(warranty)
                .specs("Brand: " + brand.getName() + "\nStorage: " + (storage == null ? "-" : storage) + "\nWarranty: " + (warranty == null ? "Store warranty" : warranty))
                .build();
        repo.save(product);
    }

    private void addUsed(ProductRepository repo, String name, Brand brand, Category category, String price, String image, int percent) {
        Product product = Product.builder()
                .name(name)
                .slug(uniqueSlug(repo, name))
                .description("Quality secondhand device in " + percent + "% condition. Fully tested at Seanghai Phone Shop.")
                .price(new BigDecimal(price))
                .stock(3)
                .condition(ProductCondition.SECONDHAND)
                .conditionPercent(percent)
                .brand(brand)
                .category(category)
                .images(List.of(image != null ? image : ProductImageRefresher.resolveImage(name)))
                .featured(false)
                .active(true)
                .warranty("Store tested")
                .build();
        repo.save(product);
    }

    private String uniqueSlug(ProductRepository repo, String name) {
        String base = SlugUtil.slugify(name);
        String slug = base;
        int i = 1;
        while (repo.findBySlug(slug).isPresent()) {
            slug = base + "-" + i++;
        }
        return slug;
    }
}
