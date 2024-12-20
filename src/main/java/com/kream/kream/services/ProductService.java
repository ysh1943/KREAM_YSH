package com.kream.kream.services;

import com.kream.kream.dtos.SimilarProductImageDTO;
import com.kream.kream.entities.ImageEntity;
import com.kream.kream.entities.ProductEntity;
import com.kream.kream.mappers.ImageMapper;
import com.kream.kream.mappers.ProductMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {
    private final ProductMapper productMapper;
    private final ImageMapper imageMapper;

    @Autowired
    public ProductService(ProductMapper productMapper, ImageMapper imageMapper) {
        this.productMapper = productMapper;
        this.imageMapper = imageMapper;
    }

    public ProductEntity getProductDetailById(Integer id) {
        if (id == null || id < 1) {
            return null;
        }
        return this.productMapper.selectProductById(id);
    }

    public ImageEntity[] getImageById(Integer id) {
        if (id == null || id < 1) {
            return null;
        }
        return this.imageMapper.selectImageById(id);
    }

    public SimilarProductImageDTO[] getImageByBaseName(String baseName) {
        if (baseName == null) {
            return new SimilarProductImageDTO[0];
        }
        return this.productMapper.selectProductImagesByBaseName(baseName);
    }
}
