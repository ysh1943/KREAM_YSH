package com.kream.kream.mappers;

import com.kream.kream.entities.BuyerBidEntity;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface BuyerBidMapper {
    int insertBuyerBid(BuyerBidEntity buyerBid);

    BuyerBidEntity selectBuyerBidById(int buyerBidId);

    int updateBuyerBid(BuyerBidEntity buyerBid);
}
