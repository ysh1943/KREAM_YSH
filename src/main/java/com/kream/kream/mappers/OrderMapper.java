package com.kream.kream.mappers;

import com.kream.kream.dtos.OrderChartDTO;
import com.kream.kream.dtos.ProductDTO;
import com.kream.kream.entities.BuyerBidEntity;
import com.kream.kream.entities.OrderEntity;
import com.kream.kream.entities.SellerBidEntity;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface OrderMapper {
    List<ProductDTO> selectPopularProducts();

    List<OrderChartDTO> selectOrderById(Integer id);
}
