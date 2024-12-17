package com.kream.kream.services;

import com.kream.kream.entities.CategoryDetailEntity;
import com.kream.kream.entities.ImageEntity;
import com.kream.kream.entities.ProductEntity;
import com.kream.kream.entities.UserEntity;
import com.kream.kream.exceptions.TransactionalException;
import com.kream.kream.mappers.*;
import com.kream.kream.results.CommonResult;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;

@Service
public class AdminService {
    private final UserMapper userMapper;
    private final ProductMapper productMapper;
    private final CategoryDetailMapper categoryDetailMapper;
    private final ImageMapper imageMapper;

    public AdminService(UserMapper userMapper, ProductMapper productMapper, CategoryDetailMapper categoryDetailMapper, ImageMapper imageMapper) {
        this.userMapper = userMapper;
        this.productMapper = productMapper;
        this.categoryDetailMapper = categoryDetailMapper;
        this.imageMapper = imageMapper;
    }

    public UserEntity[] selectUser() {
        return this.userMapper.selectUser();
    }

    public UserEntity[] searchUser(String filter, String keyword) {
        if (filter == null || !filter.equals("all") && !filter.equals("email") && !filter.equals("nickName") && !filter.equals("suspended")) {
            filter = "all";
        }
        if (keyword == null) {
            keyword = "";
        }
        return this.userMapper.selectUserBySearch(filter, keyword);
    }

    public ProductEntity[] selectProduct() {
        return this.productMapper.selectProduct();
    }

    public ProductEntity[] searchProduct(String filter, String keyword) {
        if (filter == null || !filter.equals("all") && !filter.equals("modelNum") && !filter.equals("name") && !filter.equals("brand") && !filter.equals("category")) {
            filter = "all";
        }
        if (keyword == null) {
            keyword = "";
        }
        return this.productMapper.selectProductBySearch(filter, keyword);
    }

    public ProductEntity getProductById(Integer id) {
        if (id == null || id < 1) {
            return null;
        }
        return this.productMapper.selectProductById(id);
    }

    public ImageEntity selectImageByProductId(Integer id) {
        if (id == null || id < 1) {
            return null;
        }
        return this.imageMapper.selectImageByProductIdAndIsPrimary(id);
    }

    @Transactional
    public CommonResult deleteProducts(Integer[] ids) {
        if (ids == null || ids.length == 0) {
            return CommonResult.FAILURE;
        }
        for (int id : ids) {
            ProductEntity product = this.productMapper.selectProductById(id);
            if (product == null || product.isDeleted()) {
                throw new TransactionalException();
            }
            product.setDeleted(true);
            if (this.productMapper.updateProduct(product) == 0) {
                throw new TransactionalException();
            }
        }
        return CommonResult.SUCCESS;
    }

    public CategoryDetailEntity findByCategoryId(String categoryDetailType) {
        if (categoryDetailType == null) {
            return null;
        }
        return this.categoryDetailMapper.selectByCategoryId(categoryDetailType);
    };

    // UserEntity user 넣어서 관리자 아닐시 null 조건 적어야함.
    public CommonResult addProduct(ProductEntity product, CategoryDetailEntity categoryDetail, MultipartFile[] files) throws IOException {
//        if (user == null || user.isAdmin == false || user.isSuspended() || user.getDeletedAt() != null) {
//            return CommonResult.FAILURE_UNSIGNED;
//        }
        if (product == null ||
                product.getModelNumber() == null || product.getModelNumber().isEmpty() || product.getModelNumber().length() > 50 ||
                product.getProductNameKo() == null || product.getProductNameKo().isEmpty() || product.getProductNameKo().length() > 100 ||
                product.getProductNameEn() == null || product.getProductNameEn().isEmpty() || product.getProductNameEn().length() > 100 || product.getGender() == null || product.getCategory() == null || product.getColor() == null) {
            return CommonResult.FAILURE;
        }
        if (categoryDetail == null) {
            return CommonResult.FAILURE;
        }
        product.setCategoryDetailId(categoryDetail.getId());
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(null);
        product.setDeleted(false);

        this.productMapper.insertProduct(product);

        if (files == null || files.length == 0) {
            return CommonResult.FAILURE;

        } else {
            for (int i = 0; i < files.length; i++) {
                MultipartFile file = files[i];
                ImageEntity image = new ImageEntity();
                image.setProductId(product.getId());
                image.setData(file.getBytes()); // 바이 배열로 벼화는 중 예외 발생 가능
                image.setType(file.getContentType());
                image.setName(file.getOriginalFilename());
                image.setCreatedAt(LocalDateTime.now());

                if (i == 0) {
                    image.setPrimary(true);
                } else {
                    image.setPrimary(false);
                }
                this.imageMapper.insertImage(image);
            }
        }
        return CommonResult.SUCCESS;
    };
}
