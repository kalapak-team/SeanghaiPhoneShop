package com.seanghai.phoneshop.service;

import com.seanghai.phoneshop.dto.Dtos.*;
import com.seanghai.phoneshop.entity.Product;
import com.seanghai.phoneshop.entity.ProductCondition;
import com.seanghai.phoneshop.exception.ApiException;
import com.seanghai.phoneshop.repository.BrandRepository;
import com.seanghai.phoneshop.repository.CategoryRepository;
import com.seanghai.phoneshop.repository.ProductRepository;
import com.seanghai.phoneshop.util.SlugUtil;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(
            ProductRepository productRepository,
            BrandRepository brandRepository,
            CategoryRepository categoryRepository
    ) {
        this.productRepository = productRepository;
        this.brandRepository = brandRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<ProductCardResponse> search(
            String q, String brand, String category, String condition, Boolean featured, int page, int size, String sort
    ) {
        Specification<Product> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.isTrue(root.get("active")));
            if (q != null && !q.isBlank()) {
                String like = "%" + q.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), like),
                        cb.like(cb.lower(root.get("description")), like)
                ));
            }
            if (brand != null && !brand.isBlank()) {
                predicates.add(cb.equal(root.get("brand").get("slug"), brand));
            }
            if (category != null && !category.isBlank()) {
                predicates.add(cb.equal(root.get("category").get("slug"), category));
            }
            if (condition != null && !condition.isBlank()) {
                predicates.add(cb.equal(root.get("condition"), ProductCondition.valueOf(condition.toUpperCase())));
            }
            if (Boolean.TRUE.equals(featured)) {
                predicates.add(cb.isTrue(root.get("featured")));
            }
            return cb.and(predicates.toArray(Predicate[]::new));
        };

        Sort sortSpec = switch (sort == null ? "newest" : sort) {
            case "price_asc" -> Sort.by("price").ascending();
            case "price_desc" -> Sort.by("price").descending();
            case "name" -> Sort.by("name").ascending();
            default -> Sort.by("id").descending();
        };

        Page<Product> result = productRepository.findAll(spec, PageRequest.of(page, size, sortSpec));
        return new PageResponse<>(
                result.getContent().stream().map(ProductCardResponse::from).toList(),
                result.getNumber(),
                result.getSize(),
                result.getTotalElements(),
                result.getTotalPages()
        );
    }

    @Transactional(readOnly = true)
    public ProductDetailResponse getBySlug(String slug) {
        Product product = productRepository.findDetailBySlug(slug)
                .or(() -> trailingId(slug).flatMap(productRepository::findById))
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Product not found"));
        return ProductDetailResponse.from(product);
    }

    @Transactional(readOnly = true)
    public ProductDetailResponse getById(Long id) {
        return ProductDetailResponse.from(require(id));
    }

    @Transactional
    public ProductDetailResponse save(Long id, ProductRequest request) {
        Product product = id == null ? new Product() : require(id);
        product.setName(request.name());
        String baseSlug = SlugUtil.slugify(request.name());
        String slug = baseSlug;
        int i = 1;
        while (productRepository.findBySlug(slug)
                .filter(existing -> product.getId() == null || !existing.getId().equals(product.getId()))
                .isPresent()) {
            slug = baseSlug + "-" + i++;
        }
        product.setSlug(slug);
        product.setDescription(request.description());
        product.setSku(request.sku());
        product.setStorage(request.storage());
        product.setColor(request.color());
        product.setWarranty(request.warranty());
        product.setSpecs(request.specs());
        product.setPrice(request.price());
        product.setCompareAtPrice(request.compareAtPrice());
        product.setStock(request.stock() == null ? 0 : request.stock());
        product.setCondition(request.condition() == null ? ProductCondition.NEW : request.condition());
        product.setConditionPercent(request.conditionPercent());
        product.setBrand(brandRepository.findById(request.brandId())
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Brand not found")));
        product.setCategory(categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Category not found")));
        product.setImages(request.images() == null ? List.of() : request.images());
        product.setFeatured(Boolean.TRUE.equals(request.featured()));
        product.setActive(request.active() == null || request.active());
        return ProductDetailResponse.from(productRepository.save(product));
    }

    public void delete(Long id) {
        productRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<ProductCardResponse> allAdmin() {
        return productRepository.findAll(Sort.by("id").descending()).stream().map(ProductCardResponse::from).toList();
    }

    private Product require(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Product not found"));
    }

    private Optional<Long> trailingId(String slug) {
        int dash = slug.lastIndexOf('-');
        if (dash < 0 || dash == slug.length() - 1) return Optional.empty();
        try {
            return Optional.of(Long.parseLong(slug.substring(dash + 1)));
        } catch (NumberFormatException e) {
            return Optional.empty();
        }
    }
}
