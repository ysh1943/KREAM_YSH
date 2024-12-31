package com.kream.kream.mappers;

import com.kream.kream.entities.SizeEntity;
import com.kream.kream.dtos.BuyBidChartDTO;
import com.kream.kream.dtos.SellBidChartDTO;
import com.kream.kream.dtos.SizeDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface SizeMapper {
    int insertSize(SizeEntity size);
    List<SizeDTO> selectSizeByProductId(Integer id);

    List<SellBidChartDTO> selectSellBidChartByProductId(Integer id);

    List<BuyBidChartDTO> selectBuyBidChartByProductId(Integer id);
}
