package com.kream.kream.services;

import com.kream.kream.dtos.NewProductDTO;
import com.kream.kream.dtos.PopularProductDTO;
import com.kream.kream.mappers.HomeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class HomeService {
    public final HomeMapper homeMapper;

    @Autowired
    public HomeService(HomeMapper homeMapper) {
        this.homeMapper = homeMapper;
    }

    //region 홈페이지 상품 나열

    // 인기 상품
    public List<PopularProductDTO> getPopularProducts() {
        List<PopularProductDTO> popularProducts = this.homeMapper.selectPopularProducts();
        if (popularProducts == null || popularProducts.isEmpty()) {
            return new ArrayList<>();
        }
        return popularProducts;
    }

    // 신규 상품
    public List<NewProductDTO> getNewProducts() {
        List<NewProductDTO> newProducts = this.homeMapper.selectNewProducts();
        if (newProducts == null || newProducts.isEmpty()) {
            return new ArrayList<>();
        }
        return newProducts;
    }
    //endregion
}
