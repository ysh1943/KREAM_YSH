package com.kream.kream.services;

import com.kream.kream.dtos.ProductDTO;
import com.kream.kream.dtos.ShopProductDTO;
import com.kream.kream.mappers.OrderMapper;
import com.kream.kream.mappers.ProductMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ShopService {
    private final ProductMapper productMapper;
    private final OrderMapper orderMapper;

    @Autowired
    public ShopService(ProductMapper productMapper, OrderMapper orderMapper) {
        this.productMapper = productMapper;
        this.orderMapper = orderMapper;
    }

    public List<ShopProductDTO> getPopularProducts(String filter, String keyword, String brand, String[] category, String[] gender, String[] color, String[] price) {
        List<ShopProductDTO> popularProducts = this.orderMapper.selectPopularProductsByFilter(filter, keyword, brand, category, gender, color, price);
        if (popularProducts == null || popularProducts.isEmpty()) {
            return new ArrayList<>();
        }
        return popularProducts;
    }

    public List<ShopProductDTO> getNewProducts(String filter, String keyword, String brand, String[] category, String[] gender, String[] color, String[] price) {
        List<ShopProductDTO> newProducts = this.productMapper.selectNewProductsByFilter(filter, keyword, brand, category, gender, color, price);
        if (newProducts == null || newProducts.isEmpty()) {
            return new ArrayList<>();
        }
        return newProducts;
    }
}
