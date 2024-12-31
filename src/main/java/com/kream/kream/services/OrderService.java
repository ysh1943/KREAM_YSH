package com.kream.kream.services;

import com.kream.kream.dtos.OrderProductDTO;
import com.kream.kream.dtos.ProductPriceDTO;
import com.kream.kream.entities.*;
import com.kream.kream.mappers.*;
import com.kream.kream.results.OrderValidationResult;
import com.kream.kream.results.CommonResult;
import com.kream.kream.results.Result;
import com.siot.IamportRestClient.IamportClient;
import com.siot.IamportRestClient.response.IamportResponse;
import com.siot.IamportRestClient.response.Payment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class OrderService {
    private final SizeMapper sizeMapper;
    private final AddressMapper addressMapper;
    private final BuyerBidMapper buyerBidMapper;
    private final SellerBidMapper sellerBidMapper;
    private final OrderMapper orderMapper;
    private final AccountMapper accountMapper;

    @Autowired
    public OrderService(SizeMapper sizeMapper, AddressMapper addressMapper, BuyerBidMapper buyerBidMapper, SellerBidMapper sellerBidMapper, OrderMapper orderMapper, AccountMapper accountMapper) {
        this.sizeMapper = sizeMapper;
        this.addressMapper = addressMapper;
        this.buyerBidMapper = buyerBidMapper;
        this.sellerBidMapper = sellerBidMapper;
        this.orderMapper = orderMapper;
        this.accountMapper = accountMapper;
    }

    public OrderProductDTO getOrderProduct(Integer id) {
        if (id == null || id < 1) {
            return null;
        }
        return this.sizeMapper.selectProductBySizeId(id);
    }

    public ProductPriceDTO selectProductPriceBySizeId(Integer id) {
        if (id == null || id < 1) {
            return null;
        }
        return this.sizeMapper.selectProductPriceBySizeId(id);
    }

    public AddressEntity getAddressByUserId(Integer userId) {
        if (userId == null || userId < 1) {
            return null;
        }
        return this.addressMapper.selectAddressByUserId(userId);
    }

    public AccountEntity getAccountByUserId(Integer userId) {
        if (userId == null || userId < 1) {
            return null;
        }
        return this.accountMapper.selectAccountByUserId(userId);
    }

    public Result insertBuyerBid(BuyerBidEntity buyerBid) {
        if (buyerBid == null || buyerBid.getUserId() < 1 || buyerBid.getSizeId() < 1 || buyerBid.getAddressId() < 1 || buyerBid.getDeadline() == null) {
            return CommonResult.FAILURE;
        }
        if (buyerBid.getPrice() < 20000 || buyerBid.getPrice() % 1000 != 0) {
            return OrderValidationResult.FAILURE_PRICE;
        }
        if (LocalDate.now().isAfter(buyerBid.getDeadline())) {
            buyerBid.setState(BuyerBidEntity.State.DEADLINE.name());
        }
        buyerBid.setCreatedAt(LocalDateTime.now());
        buyerBid.setState(BuyerBidEntity.State.BIDDING.name());

        return this.buyerBidMapper.insertBuyerBid(buyerBid) > 0
                ? CommonResult.SUCCESS
                : CommonResult.FAILURE;
    }

    public Result insertSellerBid(SellerBidEntity sellerBid) {
        if (sellerBid == null || sellerBid.getUserId() < 1 || sellerBid.getSizeId() < 1 || sellerBid.getAddressId() < 1 || sellerBid.getDeadline() == null) {
            return CommonResult.FAILURE;
        }
        if (sellerBid.getPrice() < 20000 || sellerBid.getPrice() % 1000 != 0) {
            return OrderValidationResult.FAILURE_PRICE;
        }
        if (LocalDate.now().isAfter(sellerBid.getDeadline())) {
            sellerBid.setState(BuyerBidEntity.State.DEADLINE.name());
        }
        sellerBid.setCreatedAt(LocalDateTime.now());
        sellerBid.setState(BuyerBidEntity.State.BIDDING.name());

        return this.sellerBidMapper.insertSellerBid(sellerBid) > 0
                ? CommonResult.SUCCESS
                : CommonResult.FAILURE;
    }


    public Result insertBuyOrder(OrderEntity order, int sizeId, int sellerBidId) {
        SellerBidEntity sellerBidEntity = this.sellerBidMapper.selectPriceBySizeIdAndSellerBidId(sizeId, sellerBidId);
        if (order == null || order.getUserId() < 1 || order.getSellerBidId() < 1  || order.getAddressId() < 1) {
            return CommonResult.FAILURE;
        }
        if (order.getPrice() < 0 || order.getPrice() != (sellerBidEntity.getPrice() + 3000)) {
            return OrderValidationResult.FAILURE_PRICE;
        }
        order.setBuyerBidId(null);
        order.setState(OrderEntity.Type.BUY.name());
        order.setState(OrderEntity.State.PENDING.name());
        order.setCreatedAt(LocalDateTime.now());
        order.setDeliveryNote(null);

        return this.orderMapper.insertOrder(order) > 0
                ? CommonResult.SUCCESS
                : CommonResult.FAILURE;
    }

    public Result insertSellOrder(OrderEntity order) {
        if (order == null || order.getUserId() < 1 || order.getSellerBidId() < 1  || order.getAddressId() < 1) {
            return CommonResult.FAILURE;
        }
        if (order.getPrice() < 0) {
            return OrderValidationResult.FAILURE_PRICE;
        }
        order.setSellerBidId(null);
        order.setState(OrderEntity.Type.SELL.name());
        order.setState(OrderEntity.State.PENDING.name());
        order.setCreatedAt(LocalDateTime.now());
        order.setDeliveryNote(null);

        return this.orderMapper.insertOrder(order) > 0
                ? CommonResult.SUCCESS
                : CommonResult.FAILURE;
    }

}
