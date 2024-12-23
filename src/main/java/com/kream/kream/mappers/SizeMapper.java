package com.kream.kream.mappers;

import com.kream.kream.dtos.SizeDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface SizeMapper {
    List<SizeDTO> searchByProductId(int id);
}
