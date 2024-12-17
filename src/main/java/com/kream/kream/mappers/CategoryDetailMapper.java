package com.kream.kream.mappers;

import com.kream.kream.entities.CategoryDetailEntity;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CategoryDetailMapper {
    CategoryDetailEntity selectByCategoryId(String categoryDetailType);
}
