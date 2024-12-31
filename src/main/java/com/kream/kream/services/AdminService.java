package com.kream.kream.services;

import com.kream.kream.dtos.OrderDTO;
import com.kream.kream.dtos.ProductDTO;
import com.kream.kream.entities.*;
import com.kream.kream.exceptions.TransactionalException;
import com.kream.kream.mappers.*;
import com.kream.kream.results.CommonResult;
import com.kream.kream.results.Result;
import org.apache.catalina.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class AdminService {
    private final UserMapper userMapper;
    private final ProductMapper productMapper;
    private final CategoryDetailMapper categoryDetailMapper;
    private final SizeMapper sizeMapper;
    private final ImageMapper imageMapper;
    private final OrderMapper orderMapper;

    public AdminService(UserMapper userMapper, ProductMapper productMapper, CategoryDetailMapper categoryDetailMapper, SizeMapper sizeMapper, ImageMapper imageMapper, OrderMapper orderMapper) {
        this.userMapper = userMapper;
        this.productMapper = productMapper;
        this.categoryDetailMapper = categoryDetailMapper;
        this.sizeMapper = sizeMapper;
        this.imageMapper = imageMapper;
        this.orderMapper = orderMapper;
    }

    public int selectUserCount() {
        return this.userMapper.selectUserCount();
    }

    public int selectOrderCount() {
        return this.orderMapper.selectOrderCount();
    }

    public int selectStatePendingCount() {
        return this.orderMapper.selectStatePendingCount();
    }

    public int selectStateInspectingCount() {
        return this.orderMapper.selectStateInspectingCount();
    }

    public UserEntity[] selectUserByLimit() {
        UserEntity[] users = this.userMapper.selectUser();

        // 5개만 담을 배열을 새로 생성
        int limit = Math.min(users.length, 5); // 원본 배열 길이와 5 중 작은 값 사용
        UserEntity[] limitedUsers = new UserEntity[limit];

        // 배열을 5개까지만 할당
        for (int i = 0; i < limit; i++) {
            limitedUsers[i] = users[i];
        }
        return limitedUsers;
    }

    public OrderDTO[] selectOrderByLimit() {
        OrderDTO[] orders = this.orderMapper.selectOrder();
        int limit = Math.min(orders.length, 5);
        OrderDTO[] limitedOrders = new OrderDTO[limit];
        for (int i = 0; i < limit; i++) {
            limitedOrders[i] = orders[i];
        }
        return limitedOrders;
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

    public CommonResult patchUser(String userEmail, boolean suspend) {
        UserEntity user = this.userMapper.selectUserByEmail(userEmail);
        if (user == null || user.getDeletedAt() != null) {
            return CommonResult.FAILURE;
        }
        user.setSuspended(suspend);
        user.setUpdatedAt(LocalDateTime.now());
        user.setDeletedAt(null);
        return this.userMapper.updateUser(user) > 0
                ? CommonResult.SUCCESS
                : CommonResult.FAILURE;
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

    public CommonResult addProduct(ProductEntity product, CategoryDetailEntity categoryDetail, MultipartFile[] files, String[] sizes) throws IOException {
        if (product == null ||
                product.getModelNumber() == null || product.getModelNumber().isEmpty() || product.getModelNumber().length() > 50 ||
                product.getBaseName() == null || product.getBaseName().isEmpty() || product.getBaseName().length() > 100 ||
                product.getProductNameKo() == null || product.getProductNameKo().isEmpty() || product.getProductNameKo().length() > 100 ||
                product.getProductNameEn() == null || product.getProductNameEn().isEmpty() || product.getProductNameEn().length() > 100 ||
                product.getGender() == null || product.getCategory() == null || product.getColor() == null) {
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

        if (sizes == null || sizes.length == 0) {
            return CommonResult.SUCCESS;
        } else {
            for (String size : sizes) {
                SizeEntity dbsize = new SizeEntity();
                dbsize.setProductId(product.getId());
                dbsize.setType(size);
                this.sizeMapper.insertSize(dbsize);
            }
        }

        if (files == null || files.length == 0) {
            return CommonResult.FAILURE;
        } else {
            for (int i = 0; i < files.length; i++) {
                MultipartFile file = files[i];
                ImageEntity image = new ImageEntity();
                image.setProductId(product.getId());
                image.setData(file.getBytes());
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

    public OrderDTO[] selectOrder() {
        return this.orderMapper.selectOrder();
    }

    public OrderDTO[] searchOrder(String filter, String keyword) {
        if (filter == null || !filter.equals("all") && !filter.equals("productName") && !filter.equals("email") && !filter.equals("state")) {
            filter = "all";
        }
        if (keyword == null) {
            keyword = "";
        }
        return this.orderMapper.selectOrderBySearch(filter, keyword);
    }

    public CommonResult patchOrder(int id, String state) {
        OrderEntity order = this.orderMapper.selectOrderById(id);
        if (order == null) {
            return CommonResult.FAILURE;
        }
        order.setState(state);
        order.setUpdatedAt(LocalDateTime.now());
        order.setDeletedAt(null);

        return this.orderMapper.updateOrder(order) > 0
                ? CommonResult.SUCCESS
                : CommonResult.FAILURE;
    }
}