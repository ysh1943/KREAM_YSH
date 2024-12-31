package com.kream.kream.mappers;

import com.kream.kream.dtos.*;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface SizeMapper {
    List<SizeDTO> selectSizeByProductId(Integer id);

    List<SellBidChartDTO> selectSellBidChartByProductId(Integer id);

    List<BuyBidChartDTO> selectBuyBidChartByProductId(Integer id);

    OrderProductDTO selectProductBySizeId(Integer id);

    ProductPriceDTO selectProductPriceBySizeId(Integer id);
}
