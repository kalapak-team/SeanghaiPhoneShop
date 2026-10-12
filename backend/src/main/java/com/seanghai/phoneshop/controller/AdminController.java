package com.seanghai.phoneshop.controller;

import com.seanghai.phoneshop.dto.Dtos.*;
import com.seanghai.phoneshop.entity.Role;
import com.seanghai.phoneshop.repository.UserRepository;
import com.seanghai.phoneshop.service.CatalogService;
import com.seanghai.phoneshop.service.OrderService;
import com.seanghai.phoneshop.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final ProductService productService;
    private final CatalogService catalogService;
    private final OrderService orderService;
    private final UserRepository userRepository;

    public AdminController(
            ProductService productService,
            CatalogService catalogService,
            OrderService orderService,
            UserRepository userRepository
    ) {
        this.productService = productService;
        this.catalogService = catalogService;
        this.orderService = orderService;
        this.userRepository = userRepository;
    }

    @GetMapping("/dashboard")
    public DashboardResponse dashboard() {
        return orderService.dashboard();
    }

    @GetMapping("/products")
    public List<ProductCardResponse> products() {
        return productService.allAdmin();
    }

    @GetMapping("/products/{id}")
    public ProductDetailResponse product(@PathVariable Long id) {
        return productService.getById(id);
    }

    @PostMapping("/products")
    public ProductDetailResponse createProduct(@Valid @RequestBody ProductRequest request) {
        return productService.save(null, request);
    }

    @PutMapping("/products/{id}")
    public ProductDetailResponse updateProduct(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        return productService.save(id, request);
    }

    @DeleteMapping("/products/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productService.delete(id);
    }

    @GetMapping("/brands")
    public List<BrandResponse> brands() {
        return catalogService.brands();
    }

    @PostMapping("/brands")
    public BrandResponse createBrand(@Valid @RequestBody BrandRequest request) {
        return catalogService.saveBrand(null, request);
    }

    @PutMapping("/brands/{id}")
    public BrandResponse updateBrand(@PathVariable Long id, @Valid @RequestBody BrandRequest request) {
        return catalogService.saveBrand(id, request);
    }

    @DeleteMapping("/brands/{id}")
    public void deleteBrand(@PathVariable Long id) {
        catalogService.deleteBrand(id);
    }

    @GetMapping("/categories")
    public List<CategoryResponse> categories() {
        return catalogService.categories();
    }

    @PostMapping("/categories")
    public CategoryResponse createCategory(@Valid @RequestBody CategoryRequest request) {
        return catalogService.saveCategory(null, request);
    }

    @PutMapping("/categories/{id}")
    public CategoryResponse updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryRequest request) {
        return catalogService.saveCategory(id, request);
    }

    @DeleteMapping("/categories/{id}")
    public void deleteCategory(@PathVariable Long id) {
        catalogService.deleteCategory(id);
    }

    @GetMapping("/banners")
    public List<BannerResponse> banners() {
        return catalogService.allBanners();
    }

    @PostMapping("/banners")
    public BannerResponse createBanner(@Valid @RequestBody BannerRequest request) {
        return catalogService.saveBanner(null, request);
    }

    @PutMapping("/banners/{id}")
    public BannerResponse updateBanner(@PathVariable Long id, @Valid @RequestBody BannerRequest request) {
        return catalogService.saveBanner(id, request);
    }

    @DeleteMapping("/banners/{id}")
    public void deleteBanner(@PathVariable Long id) {
        catalogService.deleteBanner(id);
    }

    @GetMapping("/stores")
    public List<StoreResponse> stores() {
        return catalogService.stores();
    }

    @PostMapping("/stores")
    public StoreResponse createStore(@Valid @RequestBody StoreRequest request) {
        return catalogService.saveStore(null, request);
    }

    @PutMapping("/stores/{id}")
    public StoreResponse updateStore(@PathVariable Long id, @Valid @RequestBody StoreRequest request) {
        return catalogService.saveStore(id, request);
    }

    @DeleteMapping("/stores/{id}")
    public void deleteStore(@PathVariable Long id) {
        catalogService.deleteStore(id);
    }

    @GetMapping("/orders")
    public List<OrderResponse> orders() {
        return orderService.allOrders();
    }

    @GetMapping("/orders/{id}")
    public OrderResponse order(@PathVariable Long id) {
        return orderService.get(id);
    }

    @PatchMapping("/orders/{id}/status")
    public OrderResponse updateStatus(@PathVariable Long id, @Valid @RequestBody StatusRequest request) {
        return orderService.updateStatus(id, request.status());
    }

    @GetMapping("/customers")
    public List<UserResponse> customers() {
        return userRepository.findByRoleOrderByCreatedAtDesc(Role.CUSTOMER).stream().map(UserResponse::from).toList();
    }

    @PutMapping("/settings")
    public SettingResponse settings(@Valid @RequestBody SettingRequest request) {
        return catalogService.saveSettings(request);
    }
}
