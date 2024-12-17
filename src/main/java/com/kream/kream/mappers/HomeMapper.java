package com.kream.kream.mappers;

import com.kream.kream.dtos.NewProductDTO;
import com.kream.kream.dtos.PopularProductDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface HomeMapper {
    List<PopularProductDTO> selectPopularProducts();

    List<NewProductDTO> selectNewProducts();
}
