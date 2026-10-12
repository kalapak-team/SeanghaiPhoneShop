package com.seanghai.phoneshop.service;

import com.seanghai.phoneshop.dto.Dtos.*;
import com.seanghai.phoneshop.entity.ProductCondition;
import com.seanghai.phoneshop.repository.BrandRepository;
import com.seanghai.phoneshop.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class HomeService {

    private final CatalogService catalogService;
    private final ProductRepository productRepository;
    private final BrandRepository brandRepository;

    public HomeService(CatalogService catalogService, ProductRepository productRepository, BrandRepository brandRepository) {
        this.catalogService = catalogService;
        this.productRepository = productRepository;
        this.brandRepository = brandRepository;
    }

    @Transactional(readOnly = true)
    public HomeResponse home() {
        var featured = productRepository.findTop10ByActiveTrueAndFeaturedTrueOrderByIdDesc()
                .stream().map(ProductCardResponse::from).toList();
        var brandSections = brandRepository.findByShowOnHomeTrueOrderBySortOrderAsc().stream()
                .map(brand -> new BrandSectionResponse(
                        BrandResponse.from(brand),
                        productRepository.findTop10ByActiveTrueAndBrandSlugAndConditionOrderByIdDesc(brand.getSlug(), ProductCondition.NEW)
                                .stream().map(ProductCardResponse::from).toList()
                ))
                .toList();
        var secondhand = productRepository.findTop20ByActiveTrueAndConditionOrderByIdDesc(ProductCondition.SECONDHAND)
                .stream().map(ProductCardResponse::from).toList();
        var accessories = productRepository.findTop10ByActiveTrueAndCategorySlugAndConditionOrderByIdDesc("accessories", ProductCondition.NEW)
                .stream().map(ProductCardResponse::from).toList();

        return new HomeResponse(
                catalogService.settings(),
                catalogService.banners(),
                catalogService.brands(),
                catalogService.categories(),
                featured,
                brandSections,
                secondhand,
                accessories,
                catalogService.stores()
        );
    }
}
