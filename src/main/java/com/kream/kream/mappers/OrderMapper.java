package com.kream.kream.mappers;

import com.kream.kream.dtos.*;
import com.kream.kream.entities.OrderEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.security.core.parameters.P;

import java.util.List;

@Mapper
public interface OrderMapper {
    int insertOrder(OrderEntity order);

    int selectOrderCountsByPage();

    OrderCountDTO selectOrderCounts();

    int selectOrderCountsBySearch(@Param("filter") String filter,
                                  @Param("keyword") String keyword);

    OrderDTO[] selectOrder();

    OrderDTO[] selectOrderByPage(@Param("limitCount") int limitCount,
                                 @Param("offsetCount") int offsetCount);

    OrderDTO[] selectOrderBySearch(@Param("filter") String filter,
                                   @Param("keyword") String keyword,
                                   @Param("limitCount") int limitCount,
                                   @Param("offsetCount") int offsetCount);

    int updateOrder(OrderEntity order);

    OrderEntity selectOrderById(@Param("id") int id);

    int selectOrderListByUserCount(@Param("id") int id);

    SellingOrderListDTO[] selectOrderListByUser(@Param("id") int id,
                                                @Param("tab") String tab,
                                                @Param("state") String state);

    int selectOrderCompleteListByUserCount(@Param("id") int id);

    SellingOrderCompleteListDTO[] selectOrderCompleteListByUser(@Param("id") int id,
                                                        @Param("tab") String tab,
                                                        @Param("state") String state);

    List<ProductDTO> selectPopularProducts();

    List<OrderChartDTO> selectOrderByProductId(Integer id);

    List<ShopProductDTO> selectPopularProductsByFilter(@Param("filter") String filter,
                                                       @Param("keyword") String keyword,
                                                       @Param("brand") String brand,
                                                       @Param("category") String[] category,
                                                       @Param("gender") String[] gender,
                                                       @Param("color") String[] color,
                                                       @Param("price") String[] price);

    List<OrderStateDTO> selectBuyerOrderByState(@Param(value = "userId") int userId,
                                              @Param(value = "state") String state);

    int selectBuyerOrderCountByPending(@Param(value = "userId") int userId);

    int selectBuyerOrderCountByFinish(@Param(value = "userId") int userId);

    int selectOrderCountByUserId(int id);
}
