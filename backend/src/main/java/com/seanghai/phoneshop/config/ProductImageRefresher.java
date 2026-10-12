package com.seanghai.phoneshop.config;

import com.seanghai.phoneshop.entity.Product;
import com.seanghai.phoneshop.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

@Configuration
public class ProductImageRefresher {

    /**
     * Public origin for product image URLs.
     * Set {@code APP_PUBLIC_URL=https://seanghaiphoneshop-production.up.railway.app} on Railway.
     */
    public static final String BASE = resolveImageBase();

    private static String resolveImageBase() {
        String root = System.getenv("APP_PUBLIC_URL");
        if (root == null || root.isBlank()) {
            root = "http://localhost:8080";
        }
        return root.replaceAll("/+$", "") + "/products/";
    }

    /** 70 original white-background catalog images */
    public static final List<String> ALL_IMAGES = List.of(
            // original 40
            "iphone-16-pro.jpg", "iphone-16-pro-max.jpg", "galaxy-s26-ultra.jpg", "galaxy-s26.jpg",
            "galaxy-z-fold.jpg", "galaxy-z-flip.jpg", "galaxy-buds4-pro.jpg", "galaxy-buds4-white.jpg",
            "galaxy-buds4-rose.jpg", "oppo-find-x8-ultra.jpg", "oppo-reno16.jpg", "oppo-a6.jpg",
            "huawei-pura-90.jpg", "huawei-mate-x7.jpg", "huawei-nova.jpg", "redmi-note-14.jpg",
            "xiaomi-pad.jpg", "vivo-v50.jpg", "apple-watch.jpg", "apple-watch-milanese.jpg",
            "mac-mini.jpg", "macbook-air.jpg", "airpods.jpg", "airpods-max.jpg",
            "ipad-pro.jpg", "armor-case.jpg", "clear-magsafe-case.jpg", "5g-router.jpg",
            "projector.jpg", "google-pixel.jpg", "power-bank.jpg", "charger-cable.jpg",
            "gaming-phone.jpg", "realme-phone.jpg", "honor-phone.jpg", "laptop-windows.jpg",
            "smartwatch-sport.jpg", "bluetooth-speaker.jpg", "screen-protector.jpg", "wireless-charger.jpg",
            // +30 new
            "galaxy-a-series.jpg", "iphone-14.jpg", "iphone-15.jpg", "galaxy-tab.jpg", "matepad.jpg", "ipad-air.jpg",
            "poco-phone.jpg", "tecno-phone.jpg", "nokia-phone.jpg", "infinix-phone.jpg", "galaxy-s25-fe.jpg", "hoco-charger.jpg",
            "mesh-router.jpg", "galaxy-buds4.jpg", "wired-earphones.jpg", "wireless-mouse.jpg", "keyboard.jpg", "fitness-band.jpg",
            "car-charger.jpg", "phone-stand.jpg", "external-ssd.jpg", "webcam.jpg", "usb-hub.jpg", "action-camera.jpg",
            "selfie-gimbal.jpg", "memory-card.jpg", "neckband-earphones.jpg", "smart-plug.jpg", "ring-light.jpg", "stylus-pen.jpg"
    );

    @Bean
    @Order(200)
    CommandLineRunner refreshProductImages(ProductRepository productRepository) {
        return args -> updateImages(productRepository);
    }

    @Transactional
    void updateImages(ProductRepository productRepository) {
        List<Product> products = productRepository.findAll();
        for (Product product : products) {
            product.setImages(List.of(resolveImage(product.getName())));
        }
        productRepository.saveAll(products);
    }

    public static String resolveImage(String name) {
        String n = name == null ? "" : name.toLowerCase(Locale.ROOT);

        // New accessory types first
        if (n.contains("stylus") || n.contains("pencil pen") || n.contains("s-pen")) return BASE + "stylus-pen.jpg";
        if (n.contains("ring light") || n.contains("ringlight") || n.contains("selfie light")) return BASE + "ring-light.jpg";
        if (n.contains("smart plug") || n.contains("wifi plug")) return BASE + "smart-plug.jpg";
        if (n.contains("neckband") || n.contains("neck band")) return BASE + "neckband-earphones.jpg";
        if (n.contains("memory card") || n.contains("microsd") || n.contains("sd card") || n.contains("tf card")) {
            return BASE + "memory-card.jpg";
        }
        if (n.contains("gimbal") || n.contains("selfie stick") || n.contains("stabilizer")) return BASE + "selfie-gimbal.jpg";
        if (n.contains("action camera") || n.contains("gopro") || n.contains("action cam")) return BASE + "action-camera.jpg";
        if (n.contains("usb hub") || n.contains("usb-c hub") || n.contains("multiport hub")) return BASE + "usb-hub.jpg";
        if (n.contains("webcam") || n.contains("web cam")) return BASE + "webcam.jpg";
        if (n.contains("external ssd") || n.contains("portable ssd") || n.contains("ssd drive")) return BASE + "external-ssd.jpg";
        if (n.contains("phone stand") || n.contains("desk stand") || n.contains("phone holder")) return BASE + "phone-stand.jpg";
        if (n.contains("car charger") || n.contains("car adapter")) return BASE + "car-charger.jpg";
        if (n.contains("fitness band") || n.contains("mi band") || n.contains("smart band")) return BASE + "fitness-band.jpg";
        if (n.contains("keyboard")) return BASE + "keyboard.jpg";
        if (n.contains("mouse") && !n.contains("pad")) return BASE + "wireless-mouse.jpg";
        if (n.contains("wired earphone") || n.contains("wired headphone") || n.contains("3.5mm")) {
            return BASE + "wired-earphones.jpg";
        }
        if (n.contains("hoco")) return BASE + "hoco-charger.jpg";
        if (n.contains("mesh")) return BASE + "mesh-router.jpg";

        if (n.contains("screen protector") || n.contains("tempered glass") || n.contains("glass film")) {
            return BASE + "screen-protector.jpg";
        }
        if (n.contains("wireless charger") || n.contains("magsafe charger") || n.contains("charging pad")) {
            return BASE + "wireless-charger.jpg";
        }
        if (n.contains("power bank") || n.contains("powerbank") || n.contains("20000mah") || n.contains("10000mah")) {
            return BASE + "power-bank.jpg";
        }
        if (n.contains("charger") || n.contains("usb-c cable") || n.contains("fast charge adapter")) {
            return BASE + "charger-cable.jpg";
        }
        if (n.contains("speaker") || n.contains("bluetooth speaker") || n.contains("soundbox")) {
            return BASE + "bluetooth-speaker.jpg";
        }
        if (n.contains("magsafe") || n.contains("clear case") || n.contains("ice case") || n.contains("crystal")) {
            return BASE + "clear-magsafe-case.jpg";
        }
        if (n.contains("case") || n.contains("defender") || n.contains("xundd") || n.contains("nillkin") || n.contains("armor")) {
            return BASE + "armor-case.jpg";
        }
        if (n.contains("router") || n.contains("5g @home") || n.contains("wifi 6")) {
            return BASE + "5g-router.jpg";
        }
        if (n.contains("projector") || n.contains("wanbo")) {
            return BASE + "projector.jpg";
        }

        if (n.contains("milanese")) return BASE + "apple-watch-milanese.jpg";
        if (n.contains("sport watch") || n.contains("fitness watch") || n.contains("galaxy watch") || n.contains("huawei watch")) {
            return BASE + "smartwatch-sport.jpg";
        }
        if (n.contains("xiaomi sport") || n.contains("budget watch")) return BASE + "fitness-band.jpg";
        if (n.contains("watch")) return BASE + "apple-watch.jpg";

        if (n.contains("mac mini")) return BASE + "mac-mini.jpg";
        if (n.contains("macbook")) return BASE + "macbook-air.jpg";
        if (n.contains("laptop") || n.contains("notebook") || n.contains("thinkpad") || n.contains("vivobook") || n.contains("aspire")) {
            return BASE + "laptop-windows.jpg";
        }

        if (n.contains("ipad air")) return BASE + "ipad-air.jpg";
        if (n.contains("ipad")) return BASE + "ipad-pro.jpg";
        if (n.contains("galaxy tab") || n.contains("tab s")) return BASE + "galaxy-tab.jpg";
        if (n.contains("matepad")) return BASE + "matepad.jpg";
        if (n.contains("gaming tablet") || (n.contains("pad") && !n.contains("airpods") && !n.contains("power"))) {
            return BASE + "xiaomi-pad.jpg";
        }

        if (n.contains("airpods max")) return BASE + "airpods-max.jpg";
        if (n.contains("airpods")) return BASE + "airpods.jpg";
        if (n.contains("buds") && n.contains("rose")) return BASE + "galaxy-buds4-rose.jpg";
        if (n.contains("buds") && n.contains("white")) return BASE + "galaxy-buds4-white.jpg";
        if (n.contains("buds4 pro") || (n.contains("buds") && n.contains("pro"))) return BASE + "galaxy-buds4-pro.jpg";
        if (n.contains("buds4") || n.contains("galaxy buds4")) return BASE + "galaxy-buds4.jpg";
        if (n.contains("buds") || n.contains("earbuds")) return BASE + "galaxy-buds4-pro.jpg";

        if (n.contains("z fold") || n.contains("foldable book")) return BASE + "galaxy-z-fold.jpg";
        if (n.contains("z flip") || n.contains("flip phone")) return BASE + "galaxy-z-flip.jpg";
        if (n.contains("redmagic") || n.contains("gaming phone") || n.contains("rog phone") || n.contains("black shark")) {
            return BASE + "gaming-phone.jpg";
        }
        if (n.contains("s25 fe")) return BASE + "galaxy-s25-fe.jpg";
        if (n.contains("galaxy a") || n.contains("a56") || n.contains("a36") || n.contains("a26") || n.contains("a16")) {
            return BASE + "galaxy-a-series.jpg";
        }
        if (n.contains("s26 ultra") || n.contains("s25 ultra") || n.contains("s24 ultra") || n.contains("s23 ultra") || n.contains("flagship ultra")) {
            return BASE + "galaxy-s26-ultra.jpg";
        }
        if (n.contains("s26") || n.contains("s25") || n.contains("s24")) {
            return BASE + "galaxy-s26.jpg";
        }

        if (n.contains("iphone 14")) return BASE + "iphone-14.jpg";
        if (n.contains("iphone 15") && !n.contains("pro")) return BASE + "iphone-15.jpg";
        if (n.contains("iphone") && n.contains("pro max")) return BASE + "iphone-16-pro-max.jpg";
        if (n.contains("iphone")) return BASE + "iphone-16-pro.jpg";

        if (n.contains("find x")) return BASE + "oppo-find-x8-ultra.jpg";
        if (n.contains("reno")) return BASE + "oppo-reno16.jpg";
        if (n.contains("oppo")) return BASE + "oppo-a6.jpg";
        if (n.contains("mate x") || n.contains("pura x")) return BASE + "huawei-mate-x7.jpg";
        if (n.contains("pura")) return BASE + "huawei-pura-90.jpg";
        if (n.contains("nova") || n.contains("mate 80") || n.contains("huawei")) return BASE + "huawei-nova.jpg";
        if (n.contains("realme")) return BASE + "realme-phone.jpg";
        if (n.contains("honor")) return BASE + "honor-phone.jpg";
        if (n.contains("poco")) return BASE + "poco-phone.jpg";
        if (n.contains("tecno")) return BASE + "tecno-phone.jpg";
        if (n.contains("nokia")) return BASE + "nokia-phone.jpg";
        if (n.contains("infinix")) return BASE + "infinix-phone.jpg";
        if (n.contains("redmi") || n.contains("xiaomi")) return BASE + "redmi-note-14.jpg";
        if (n.contains("vivo")) return BASE + "vivo-v50.jpg";
        if (n.contains("pixel") || n.contains("google")) return BASE + "google-pixel.jpg";
        return BASE + "galaxy-s26.jpg";
    }
}
