package com.kream.kream.services;

import com.kream.kream.dtos.ProductDTO;
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

    public List<ProductDTO> getPopularProducts() {
        List<ProductDTO> popularProducts = this.orderMapper.selectPopularProducts();
        if (popularProducts == null || popularProducts.isEmpty()) {
            return new ArrayList<>();
        }
        return popularProducts;
    }

    public List<ProductDTO> filterPopularProducts(String filter) {
//        if (filter == null || !filter.equals("all") && !filter.equals("top") && !filter.equals("bottom") && !filter.equals("shoes") && !filter.equals("accessories")) {
//            filter = "all";
//        }
        return this.productMapper.selectPopularProductsByFilter(filter);
    }
}
