package com.kream.kream.mappers;

import com.kream.kream.entities.SellerBidEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface SellerBidMapper {
    int insertSellerBid(SellerBidEntity sellerBid);

    SellerBidEntity selectPriceBySizeIdAndSellerBidId(@Param(value = "sizeId") int sizeId,
                                     @Param(value = "sellerBidId") int sellerBidId);

    SellerBidEntity selectSellerBidById(int sellerBidId);

    int updateSellerBid(SellerBidEntity sellerBid);
}
