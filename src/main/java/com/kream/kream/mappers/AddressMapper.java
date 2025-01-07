package com.kream.kream.mappers;

import com.kream.kream.entities.AccountEntity;
import com.kream.kream.entities.AddressEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface AddressMapper {
    AddressEntity selectAddressByUserId(Integer userId);

    int insertAddress(AddressEntity address);

    AddressEntity[] selectAddressById(@Param("userId")int userId);

    AddressEntity selectmodifyAddressById(@Param("id")int id);

    AddressEntity deleteAddressById(@Param("id")int id);

    int deleteAddress(AddressEntity address);

    AddressEntity[] selectAllAddress(@Param("userId")int userId);

    int modifyAddress(AddressEntity address);

    int isdefault(AddressEntity address);
}
