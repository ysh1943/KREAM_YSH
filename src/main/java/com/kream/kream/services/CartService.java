package com.kream.kream.services;

import com.kream.kream.dtos.CartDTO;
import com.kream.kream.entities.CartEntity;
import com.kream.kream.exceptions.TransactionalException;
import com.kream.kream.mappers.CartMapper;
import com.kream.kream.results.CommonResult;
import com.kream.kream.results.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class CartService {
    private final CartMapper cartMapper;

    @Autowired
    public CartService(CartMapper cartMapper) {
        this.cartMapper = cartMapper;
    }

    @Transactional
    public Result addCart(CartEntity cart) {
        if (cart.getUserId() < 1 ||
                cart.getSellerBidId() < 1) {
            return CommonResult.FAILURE;
        }
        cart.setCreatedAt(LocalDateTime.now());
        if (this.cartMapper.insertCart(cart) == 0) {
            throw new TransactionalException();
        }
        return CommonResult.SUCCESS;
    }

    public CartDTO[] selectCart(Integer userId) {
        if (userId < 1) {
            return null;
        }
        return this.cartMapper.selectCartByUserId(userId);
    }

    public Integer counting(Integer userId) {
        if (userId < 1) {
            return null;
        }
        return this.cartMapper.countCart(userId);
    }

    public Result delete(int id) {
        if (id < 1) {
            return CommonResult.FAILURE;
        }

        return this.cartMapper.deleteCart(id) > 0 ? CommonResult.SUCCESS : CommonResult.FAILURE;
    }


}
