package com.kream.kream.mappers;

import com.kream.kream.entities.AddressEntity;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AddressMapper {
    AddressEntity selectAddressByUserId(Integer userId);
}
