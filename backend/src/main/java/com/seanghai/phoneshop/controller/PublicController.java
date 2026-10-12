package com.seanghai.phoneshop.controller;

import com.seanghai.phoneshop.dto.Dtos.*;
import com.seanghai.phoneshop.service.CatalogService;
import com.seanghai.phoneshop.service.HomeService;
import com.seanghai.phoneshop.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PublicController {

    private final HomeService homeService;
    private final CatalogService catalogService;
    private final ProductService productService;

    public PublicController(HomeService homeService, CatalogService catalogService, ProductService productService) {
        this.homeService = homeService;
        this.catalogService = catalogService;
        this.productService = productService;
    }

    @GetMapping("/home")
    public HomeResponse home() {
        return homeService.home();
    }

    @GetMapping("/brands")
    public List<BrandResponse> brands() {
        return catalogService.brands();
    }

    @GetMapping("/brands/{slug}")
    public BrandResponse brand(@PathVariable String slug) {
        return catalogService.brand(slug);
    }

    @GetMapping("/categories")
    public List<CategoryResponse> categories() {
        return catalogService.categories();
    }

    @GetMapping("/banners")
    public List<BannerResponse> banners() {
        return catalogService.banners();
    }

    @GetMapping("/stores")
    public List<StoreResponse> stores() {
        return catalogService.stores();
    }

    @GetMapping("/settings")
    public SettingResponse settings() {
        return catalogService.settings();
    }

    @GetMapping("/products")
    public PageResponse<ProductCardResponse> products(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String condition,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "40") int size,
            @RequestParam(defaultValue = "newest") String sort
    ) {
        return productService.search(q, brand, category, condition, featured, page, size, sort);
    }

    @GetMapping("/products/{slug}")
    public ProductDetailResponse product(@PathVariable String slug) {
        return productService.getBySlug(slug);
    }
}
