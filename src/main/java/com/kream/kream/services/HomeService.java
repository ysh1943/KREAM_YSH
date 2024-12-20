package com.kream.kream.services;

import com.kream.kream.dtos.ProductDTO;
import com.kream.kream.mappers.ProductMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class HomeService {
    public final ProductMapper productMapper;

    @Autowired
    public HomeService(ProductMapper productMapper1) {
        this.productMapper = productMapper1;
    }

    //region 홈페이지 상품 나열

    // 인기 상품
    public List<ProductDTO> getPopularProducts() {
        List<ProductDTO> popularProducts = this.productMapper.selectPopularProducts();
        if (popularProducts == null || popularProducts.isEmpty()) {
            return new ArrayList<>();
        }
        return popularProducts;
    }

    // 신규 상품
    public List<ProductDTO> getNewProducts() {
        List<ProductDTO> newProducts = this.productMapper.selectNewProducts();
        if (newProducts == null || newProducts.isEmpty()) {
            return new ArrayList<>();
        }
        System.out.println();
        return newProducts;
    }
    //endregion
}
