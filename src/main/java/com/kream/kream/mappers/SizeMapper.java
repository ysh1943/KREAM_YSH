package com.kream.kream.mappers;

import com.kream.kream.entities.SizeEntity;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface SizeMapper {
    int insertSize(SizeEntity size);
}
