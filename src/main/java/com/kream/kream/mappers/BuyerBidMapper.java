package com.kream.kream.mappers;

import com.kream.kream.dtos.BidStateDTO;
import com.kream.kream.dtos.OrderStateDTO;
import com.kream.kream.entities.BuyerBidEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BuyerBidMapper {
    int insertBuyerBid(BuyerBidEntity buyerBid);

    BuyerBidEntity selectPriceBySizeIdAndBuyerBidId(@Param(value = "sizeId") int sizeId,
                                                      @Param(value = "buyerBidId") int buyerBidId);

    BuyerBidEntity selectBuyerBidById(int buyerBidId);

    List<BidStateDTO> selectBuyerBidByState(@Param(value = "userId") int userId,
                                            @Param(value = "state") String state);

    List<OrderStateDTO> selectBuyerBidByOrderState(@Param(value = "userId") int userId,
                                                   @Param(value = "state") String state);

    int selectBuyerBidCountByState(@Param(value = "userId") int userId);

    int selectBuyerBidCountByPending(@Param(value = "userId") int userId);

    int selectBuyerBidCountByFinish(@Param(value = "userId") int userId);

    int updateBuyerBid(BuyerBidEntity buyerBid);

    int selectBuyerBidUserCount(@Param(value = "id") int id);
}
