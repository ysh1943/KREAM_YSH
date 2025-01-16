package com.kream.kream.mappers;

import com.kream.kream.dtos.SearchKeywordDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SearchMapper {
    List<SearchKeywordDTO> selectKeywordBySearch(@Param(value = "keyword") String keyword);
}
