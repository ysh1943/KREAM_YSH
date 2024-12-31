package com.kream.kream.services;

import com.kream.kream.dtos.ProductDTO;
import com.kream.kream.mappers.OrderMapper;
import com.kream.kream.mappers.ProductMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Service
public class HomeService {
    public final ProductMapper productMapper;
    public final OrderMapper orderMapper;

    @Autowired
    public HomeService(ProductMapper productMapper, OrderMapper orderMapper) {
        this.productMapper = productMapper;
        this.orderMapper = orderMapper;
    }

    //region 홈페이지 상품 나열
    // 인기 상품
    public List<ProductDTO> getPopularProducts() {
        List<ProductDTO> popularProducts = this.orderMapper.selectPopularProducts();
        if (popularProducts == null || popularProducts.isEmpty()) {
            return new ArrayList<>();
        }
        ValidProducts(popularProducts);
        return popularProducts;
    }

    // 신규 상품
    public List<ProductDTO> getNewProducts() {
        List<ProductDTO> newProducts = this.productMapper.selectNewProducts();
        if (newProducts == null || newProducts.isEmpty()) {
            return new ArrayList<>();
        }
        ValidProducts(newProducts);
        return newProducts;
    }
    //endregion

    //region productDTO 유효성 검사
    private void ValidProducts(List<ProductDTO> products) {
        for (ProductDTO product : products) {
            if (product == null || product.getProductId() < 1) {
                continue;
            }
            if (product.getProductNameEn() == null || product.getProductNameEn().isEmpty() || product.getProductNameEn().length() > 100) {
                product.setProductNameEn("상품명 없음");
            }
            if (product.getBrand() == null || product.getBrand().isEmpty() || product.getBrand().length() > 50) {
                product.setBrand("브랜드명 없음");
            }
            if (product.getCategory() == null) {
                product.setCategory("etc");
            }
            if (product.getLowestPrice() < 0) {
                product.setLowestPrice(0);
            }
            if (product.getTransactionCount() < 0) {
                product.setTransactionCount(0);
            }
            if (product.getImageType() == null || product.getImageData() == null) {
                if (product.getCategory().equals("top")) {
                    product.setImageData(getDefaultImageData("top"));
                }
                if (product.getCategory().equals("bottom")) {
                    product.setImageData(getDefaultImageData("bottom"));
                }
                if (product.getCategory().equals("shoes")) {
                    product.setImageData(getDefaultImageData("shoes"));
                }
            }
        }
    }
    //endregion

    private byte[] getDefaultImageData(String category) {
        String imagePath = "";

        switch (category) {
            case "top":
                imagePath = "/static/home/assets/images/top.png";
                break;
            case "bottom":
                imagePath = "/static/home/assets/images/bottom.png";
                break;
            case "shoes":
                imagePath = "/static/home/assets/images/shoes.png";
                break;
            default:
                imagePath = "/static/home/assets/images/no-image.png";
                break;
        }

        try (InputStream inputStream = getClass().getResourceAsStream(imagePath)) {
            if (inputStream == null) {
                throw new RuntimeException("기본 이미지를 찾을수 없습니다.");
            }
            return inputStream.readAllBytes();
        } catch (IOException e) {
            throw new RuntimeException("기본이미지를 찾는데 실패했습니다.", e);
        }
    }
}
