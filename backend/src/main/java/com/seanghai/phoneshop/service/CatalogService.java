package com.seanghai.phoneshop.service;

import com.seanghai.phoneshop.dto.Dtos.*;
import com.seanghai.phoneshop.entity.*;
import com.seanghai.phoneshop.exception.ApiException;
import com.seanghai.phoneshop.repository.*;
import com.seanghai.phoneshop.util.SlugUtil;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CatalogService {

    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;
    private final BannerRepository bannerRepository;
    private final StoreLocationRepository storeLocationRepository;
    private final ShopSettingRepository shopSettingRepository;

    public CatalogService(
            BrandRepository brandRepository,
            CategoryRepository categoryRepository,
            BannerRepository bannerRepository,
            StoreLocationRepository storeLocationRepository,
            ShopSettingRepository shopSettingRepository
    ) {
        this.brandRepository = brandRepository;
        this.categoryRepository = categoryRepository;
        this.bannerRepository = bannerRepository;
        this.storeLocationRepository = storeLocationRepository;
        this.shopSettingRepository = shopSettingRepository;
    }

    public List<BrandResponse> brands() {
        return brandRepository.findAllByOrderBySortOrderAscNameAsc().stream().map(BrandResponse::from).toList();
    }

    public BrandResponse brand(String slug) {
        return BrandResponse.from(brandRepository.findBySlug(slug)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Brand not found")));
    }

    public List<CategoryResponse> categories() {
        return categoryRepository.findAllByOrderBySortOrderAscNameAsc().stream().map(CategoryResponse::from).toList();
    }

    public List<BannerResponse> banners() {
        return bannerRepository.findByActiveTrueOrderBySortOrderAsc().stream().map(BannerResponse::from).toList();
    }

    public List<StoreResponse> stores() {
        return storeLocationRepository.findAllByOrderBySortOrderAsc().stream().map(StoreResponse::from).toList();
    }

    public SettingResponse settings() {
        return SettingResponse.from(currentSettings());
    }

    private ShopSetting currentSettings() {
        return shopSettingRepository.findAll().stream().findFirst()
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Shop settings not found"));
    }

    @Transactional
    public BrandResponse saveBrand(Long id, BrandRequest request) {
        Brand brand = id == null ? new Brand() : brandRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Brand not found"));
        brand.setName(request.name());
        brand.setSlug(SlugUtil.slugify(request.name()));
        brand.setLogoUrl(request.logoUrl());
        brand.setSortOrder(request.sortOrder() == null ? 0 : request.sortOrder());
        brand.setFeatured(request.featured() == null || request.featured());
        brand.setShowOnHome(Boolean.TRUE.equals(request.showOnHome()));
        return BrandResponse.from(brandRepository.save(brand));
    }

    public void deleteBrand(Long id) {
        brandRepository.deleteById(id);
    }

    @Transactional
    public CategoryResponse saveCategory(Long id, CategoryRequest request) {
        Category category = id == null ? new Category() : categoryRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Category not found"));
        category.setName(request.name());
        category.setSlug(SlugUtil.slugify(request.name()));
        category.setDescription(request.description());
        category.setSortOrder(request.sortOrder() == null ? 0 : request.sortOrder());
        return CategoryResponse.from(categoryRepository.save(category));
    }

    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }

    @Transactional
    public BannerResponse saveBanner(Long id, BannerRequest request) {
        Banner banner = id == null ? new Banner() : bannerRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Banner not found"));
        banner.setTitle(request.title());
        banner.setSubtitle(request.subtitle());
        banner.setImageUrl(request.imageUrl());
        banner.setLinkUrl(request.linkUrl());
        banner.setButtonText(request.buttonText());
        banner.setTheme(request.theme());
        banner.setSortOrder(request.sortOrder() == null ? 0 : request.sortOrder());
        banner.setActive(request.active() == null || request.active());
        return BannerResponse.from(bannerRepository.save(banner));
    }

    public void deleteBanner(Long id) {
        bannerRepository.deleteById(id);
    }

    public List<BannerResponse> allBanners() {
        return bannerRepository.findAllByOrderBySortOrderAsc().stream().map(BannerResponse::from).toList();
    }

    @Transactional
    public StoreResponse saveStore(Long id, StoreRequest request) {
        StoreLocation store = id == null ? new StoreLocation() : storeLocationRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Store not found"));
        store.setName(request.name());
        store.setAddressKh(request.addressKh());
        store.setAddressEn(request.addressEn());
        store.setPhones(request.phones());
        store.setFacebookUrl(request.facebookUrl());
        store.setMapUrl(request.mapUrl());
        store.setSortOrder(request.sortOrder() == null ? 0 : request.sortOrder());
        return StoreResponse.from(storeLocationRepository.save(store));
    }

    public void deleteStore(Long id) {
        storeLocationRepository.deleteById(id);
    }

    @Transactional
    public SettingResponse saveSettings(SettingRequest request) {
        ShopSetting setting = currentSettings();
        setting.setShopName(request.shopName());
        setting.setTagline(request.tagline());
        setting.setKhmerPhone(request.khmerPhone());
        setting.setEnglishPhone(request.englishPhone());
        setting.setEmail(request.email());
        setting.setTelegramUrl(request.telegramUrl());
        setting.setTelegramChannelUrl(request.telegramChannelUrl());
        setting.setFacebookUrl(request.facebookUrl());
        setting.setAnnouncement(request.announcement());
        setting.setAbout(request.about());
        setting.setFreeDeliveryNote(request.freeDeliveryNote());
        return SettingResponse.from(shopSettingRepository.save(setting));
    }
}
