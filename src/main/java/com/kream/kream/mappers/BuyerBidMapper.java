package com.kream.kream.mappers;

import com.kream.kream.entities.BuyerBidEntity;
import com.kream.kream.entities.SellerBidEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface BuyerBidMapper {
    int insertBuyerBid(BuyerBidEntity buyerBid);

    BuyerBidEntity selectPriceBySizeIdAndBuyerBidId(@Param(value = "sizeId") int sizeId,
                                                      @Param(value = "buyerBidId") int buyerBidId);

    BuyerBidEntity selectBuyerBidById(int buyerBidId);

    int updateBuyerBid(BuyerBidEntity buyerBid);
}
