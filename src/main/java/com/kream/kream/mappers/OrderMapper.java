package com.kream.kream.mappers;

import com.kream.kream.dtos.OrderDTO;
import com.kream.kream.dtos.ShopProductDTO;
import com.kream.kream.entities.OrderEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface OrderMapper {
    int selectOrderCount();
    int selectStatePendingCount();
    int selectStateInspectingCount();

    OrderDTO[] selectOrder();

    OrderDTO[] selectOrderBySearch(@Param("filter") String filter,
                                   @Param("keyword") String keyword);

    OrderEntity selectOrderById(@Param("id") int id);

    int updateOrder(OrderEntity order);

    List<ShopProductDTO> selectPopularProductsByFilter(@Param("filter") String filter,
                                                       @Param("keyword") String keyword,
                                                       @Param("brand") String brand,
                                                       @Param("category") String[] category,
                                                       @Param("gender") String[] gender,
                                                       @Param("color") String[] color,
                                                       @Param("price") String[] price);
}
