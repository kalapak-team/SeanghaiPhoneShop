package com.seanghai.phoneshop.repository;

import com.seanghai.phoneshop.entity.Product;
import com.seanghai.phoneshop.entity.ProductCondition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    Optional<Product> findBySlug(String slug);

    @Query("select distinct p from Product p left join fetch p.images left join fetch p.brand left join fetch p.category where p.slug = :slug")
    Optional<Product> findDetailBySlug(@Param("slug") String slug);
    List<Product> findTop10ByActiveTrueAndFeaturedTrueOrderByIdDesc();
    List<Product> findTop10ByActiveTrueAndBrandSlugAndConditionOrderByIdDesc(String brandSlug, ProductCondition condition);
    List<Product> findTop10ByActiveTrueAndCategorySlugAndConditionOrderByIdDesc(String categorySlug, ProductCondition condition);
    List<Product> findTop20ByActiveTrueAndConditionOrderByIdDesc(ProductCondition condition);
}
