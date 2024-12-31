package com.kream.kream.mappers;

import com.kream.kream.dtos.OrderDTO;
import com.kream.kream.dtos.ShopProductDTO;
import com.kream.kream.dtos.OrderChartDTO;
import com.kream.kream.dtos.ProductDTO;
import com.kream.kream.entities.BuyerBidEntity;
import com.kream.kream.entities.OrderEntity;
import com.kream.kream.entities.SellerBidEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface OrderMapper {
    int insertOrder(OrderEntity order);


    List<ProductDTO> selectPopularProducts();
    int selectOrderCount();
    int selectStatePendingCount();
    int selectStateInspectingCount();

    OrderDTO[] selectOrder();

    OrderDTO[] selectOrderBySearch(@Param("filter") String filter,
                                   @Param("keyword") String keyword);

    OrderEntity selectOrderById(@Param("id") int id);

    List<OrderChartDTO> selectOrderByProductId(Integer id);
    int updateOrder(OrderEntity order);

    List<ShopProductDTO> selectPopularProductsByFilter(@Param("filter") String filter,
                                                       @Param("keyword") String keyword,
                                                       @Param("brand") String brand,
                                                       @Param("category") String[] category,
                                                       @Param("gender") String[] gender,
                                                       @Param("color") String[] color,
                                                       @Param("price") String[] price);
}
