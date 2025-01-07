package com.kream.kream.services;

import com.kream.kream.dtos.OrderCountDTO;
import com.kream.kream.dtos.OrderDTO;
import com.kream.kream.entities.*;
import com.kream.kream.exceptions.TransactionalException;
import com.kream.kream.mappers.*;
import com.kream.kream.results.CommonResult;
import com.kream.kream.vos.PageVo;
import com.kream.kream.vos.ProductPageVo;
import org.apache.catalina.User;

import org.apache.commons.lang3.tuple.Pair;
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
    private final SizeMapper sizeMapper;
    private final ImageMapper imageMapper;
    private final SellerBidMapper sellerBidMapper;
    private final BuyerBidMapper buyerBidMapper;
    private final OrderMapper orderMapper;

    public AdminService(UserMapper userMapper, ProductMapper productMapper, CategoryDetailMapper categoryDetailMapper, SizeMapper sizeMapper, ImageMapper imageMapper, SellerBidMapper sellerBidMapper, BuyerBidMapper buyerBidMapper, OrderMapper orderMapper) {
        this.userMapper = userMapper;
        this.productMapper = productMapper;
        this.categoryDetailMapper = categoryDetailMapper;
        this.sizeMapper = sizeMapper;
        this.imageMapper = imageMapper;
        this.sellerBidMapper = sellerBidMapper;
        this.buyerBidMapper = buyerBidMapper;
        this.orderMapper = orderMapper;
    }

    public int selectUserCount() {
        return this.userMapper.selectUserCount();
    }

    public OrderCountDTO selectOrderCount() {
        return this.orderMapper.selectOrderCounts();
    }

    public UserOrderCountEntity[] selectUserByLimit() {
        UserOrderCountEntity[] users = this.userMapper.selectUser();

        // 5개만 담을 배열을 새로 생성
        int limit = Math.min(users.length, 5); // 원본 배열 길이와 5 중 작은 값 사용
        UserOrderCountEntity[] limitedUsers = new UserOrderCountEntity[limit];

        for (int i = 0; i < limit; i++) {
            UserOrderCountEntity user = users[i]; // users 배열에서 하나씩 가져옴

            // 각 사용자의 추가 정보를 계산
            int orderCount = this.orderMapper.selectOrderCountByUserId(user.getId());
            int sellerBidCount = this.sellerBidMapper.selectSellerBidByUserCount(user.getId());
            int buyerBidCount = this.buyerBidMapper.selectBuyerBidUserCount(user.getId());

            // 사용자 정보에 추가 데이터를 설정
            user.setUserOrderCount(orderCount);
            user.setUserSellerBidCount(sellerBidCount);
            user.setUserBuyerBidCount(buyerBidCount);

            // limitedUsers 배열에 설정된 데이터를 복사
            limitedUsers[i] = user;
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

    public Pair<PageVo, UserOrderCountEntity[]> selectUser(int page) {
        page = Math.max(1, page);
        int totalCount = this.userMapper.selectUserCount();
        PageVo pageVo = new PageVo(page, totalCount);
        UserOrderCountEntity[] users = this.userMapper.selectUserByPage(pageVo.countPerPage,
                pageVo.offsetCount);
        for (UserOrderCountEntity user : users) {
            int orderCount = this.orderMapper.selectOrderCountByUserId(user.getId());
            int sellerBidCount = this.sellerBidMapper.selectSellerBidByUserCount(user.getId());
            int buyerBidCount = this.buyerBidMapper.selectBuyerBidUserCount(user.getId());
            user.setUserOrderCount(orderCount);
            user.setUserSellerBidCount(sellerBidCount);
            user.setUserBuyerBidCount(buyerBidCount);
        }
        return Pair.of(pageVo, users);
    }

    public Pair<PageVo, UserOrderCountEntity[]> searchUser(int page, String filter, String keyword) {
        page = Math.max(1, page);
        if (filter == null || !filter.equals("all") && !filter.equals("email") && !filter.equals("nickName") && !filter.equals("suspended")) {
            filter = "all";
        }
        if (keyword == null) {
            keyword = "";
        }
        int totalCount = this.userMapper.selectUserCountBySearch(filter, keyword);
        PageVo pageVo = new PageVo(page, totalCount);
        UserOrderCountEntity[] users = this.userMapper.selectUserBySearch(filter, keyword, pageVo.countPerPage, pageVo.offsetCount);
        for (UserOrderCountEntity user : users) {
            int orderCount = this.orderMapper.selectOrderCountByUserId(user.getId());
            int sellerBidCount = this.sellerBidMapper.selectSellerBidByUserCount(user.getId());
            int buyerBidCount = this.buyerBidMapper.selectBuyerBidUserCount(user.getId());
            user.setUserOrderCount(orderCount);
            user.setUserSellerBidCount(sellerBidCount);
            user.setUserBuyerBidCount(buyerBidCount);
        }
        return Pair.of(pageVo, users);
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

    public Pair<ProductPageVo, ProductEntity[]> selectProduct(int page) {
        page = Math.max(1, page); // page = page < 1 ? 1 : page; 페이지 번호가 1보다 작으면 1로 설정 ( 페이지 번호는 1이상 이야함 )
        int totalCount = this.productMapper.selectProductCount(); // 전체 게시글의 개수
        ProductPageVo pageVo = new ProductPageVo(page, totalCount);
        ProductEntity[] products = this.productMapper.selectProduct(pageVo.countPerPage,
                pageVo.offsetCount);
        return Pair.of(pageVo, products);
    }

    public Pair<ProductPageVo, ProductEntity[]> searchProduct(int page, String filter, String keyword) {
        page = Math.max(1, page);
        if (filter == null || !filter.equals("all") && !filter.equals("modelNum") && !filter.equals("name") && !filter.equals("brand") && !filter.equals("category")) {
            filter = "all";
        }
        if (keyword == null) {
            keyword = "";
        }
        int totalCount = this.productMapper.selectProductCountBySearch(filter, keyword);
        ProductPageVo pageVo = new ProductPageVo(page, totalCount);
        ProductEntity[] products = this.productMapper.selectProductBySearch(filter, keyword, pageVo.countPerPage,
                pageVo.offsetCount);
        return Pair.of(pageVo, products);
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
    }

    ;

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
    }

    ;

    public Pair<PageVo, OrderDTO[]> selectOrder(int page) {
        page = Math.max(1, page); // page = page < 1 ? 1 : page; 페이지 번호가 1보다 작으면 1로 설정 ( 페이지 번호는 1이상 이야함 )
        int totalCount = this.orderMapper.selectOrderCountsByPage(); // 전체 게시글의 개수
        PageVo pageVo = new PageVo(page, totalCount);
        OrderDTO[] orders = this.orderMapper.selectOrderByPage(pageVo.countPerPage,
                pageVo.offsetCount);
        return Pair.of(pageVo, orders);
    }

    public Pair<PageVo, OrderDTO[]> searchOrder(int page, String filter, String keyword) {
        page = Math.max(1, page);
        if (filter == null || !filter.equals("all") && !filter.equals("productName") && !filter.equals("email") && !filter.equals("state")) {
            filter = "all";
        }
        if (keyword == null) {
            keyword = "";
        }
        int totalCount = this.orderMapper.selectOrderCountsBySearch(filter, keyword);
        PageVo pageVo = new PageVo(page, totalCount);
        OrderDTO[] orders = this.orderMapper.selectOrderBySearch(filter, keyword, pageVo.countPerPage, pageVo.offsetCount);
        return Pair.of(pageVo, orders);
    }

    public CommonResult patchOrder(int id, String state) {
        // 주문 엔티티 조회
        OrderEntity order = this.orderMapper.selectOrderById(id);
        Integer sellerBidId = order.getSellerBidId();
        Integer buyerBidId = order.getBuyerBidId();
        System.out.println(sellerBidId);
        if (order == null) {
            return CommonResult.FAILURE; // 주문이 존재하지 않으면 실패
        }
        if (sellerBidId == null && buyerBidId == null) {
            return CommonResult.FAILURE;
        } else if (sellerBidId != null && buyerBidId == null) {
            SellerBidEntity sellerBid = this.sellerBidMapper.selectSellerBidById(sellerBidId);
            if (state.equals("DELIVERED")) {
                order.setState(state);
                order.setUpdatedAt(LocalDateTime.now());
                order.setDeletedAt(null);
                sellerBid.setOrderState("SETTLED");
                sellerBid.setUpdatedAt(LocalDateTime.now());
                this.orderMapper.updateOrder(order);
                this.sellerBidMapper.updateSellerBid(sellerBid);
                return CommonResult.SUCCESS;
            } else if (state.equals("IN_TRANSIT")) {
                order.setState(state);
                order.setUpdatedAt(LocalDateTime.now());
                order.setDeletedAt(null);
                sellerBid.setOrderState("SETTLING");
                sellerBid.setUpdatedAt(LocalDateTime.now());
                this.orderMapper.updateOrder(order);
                this.sellerBidMapper.updateSellerBid(sellerBid);
                return CommonResult.SUCCESS;
            } else if (state.equals("SETTLED")) {
                order.setState("DELIVERED");
                order.setUpdatedAt(LocalDateTime.now());
                order.setDeletedAt(null);
                sellerBid.setOrderState("SETTLED");
                sellerBid.setUpdatedAt(LocalDateTime.now());
                this.orderMapper.updateOrder(order);
                this.sellerBidMapper.updateSellerBid(sellerBid);
                return CommonResult.SUCCESS;
            }
            sellerBid.setOrderState(state);
            sellerBid.setUpdatedAt(LocalDateTime.now());
            this.sellerBidMapper.updateSellerBid(sellerBid);
        } else if (sellerBidId == null && buyerBidId != null) {
            BuyerBidEntity buyerBid = this.buyerBidMapper.selectBuyerBidById(buyerBidId);
            if (state.equals("SETTLED")) {
                order.setState(state);
                order.setUpdatedAt(LocalDateTime.now());
                order.setDeletedAt(null);
                buyerBid.setOrderState("DELIVERED");
                buyerBid.setUpdatedAt(LocalDateTime.now());
                this.orderMapper.updateOrder(order);
                this.buyerBidMapper.updateBuyerBid(buyerBid);
                return CommonResult.SUCCESS;
            } else if (state.equals("SETTLING")) {
                order.setState(state);
                order.setUpdatedAt(LocalDateTime.now());
                order.setDeletedAt(null);
                buyerBid.setOrderState("IN_TRANSIT");
                buyerBid.setUpdatedAt(LocalDateTime.now());
                this.orderMapper.updateOrder(order);
                this.buyerBidMapper.updateBuyerBid(buyerBid);
                return CommonResult.SUCCESS;
            } else if (state.equals("DELIVERED")) {
                order.setState("SETTLED");
                order.setUpdatedAt(LocalDateTime.now());
                order.setDeletedAt(null);
                buyerBid.setOrderState("DELIVERED");
                buyerBid.setUpdatedAt(LocalDateTime.now());
                this.orderMapper.updateOrder(order);
                this.buyerBidMapper.updateBuyerBid(buyerBid);
                return CommonResult.SUCCESS;
            }
            buyerBid.setOrderState(state);
            buyerBid.setUpdatedAt(LocalDateTime.now());
            this.buyerBidMapper.updateBuyerBid(buyerBid);
        }
        order.setState(state);
        order.setUpdatedAt(LocalDateTime.now());
        order.setDeletedAt(null);
        return this.orderMapper.updateOrder(order) > 0
                ? CommonResult.SUCCESS
                : CommonResult.FAILURE;
    }
}