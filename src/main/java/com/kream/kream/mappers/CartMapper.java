package com.kream.kream.mappers;

import com.kream.kream.dtos.CartDTO;
import com.kream.kream.entities.CartEntity;
import com.kream.kream.results.Result;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CartMapper {
    int insertCart(CartEntity cart);

    CartDTO[] selectCartByUserId(Integer userId);

    Integer countCart(@Param("userId")Integer userId);

    int deleteCart(@Param("id")int id);

}
