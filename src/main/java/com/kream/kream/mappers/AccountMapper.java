package com.kream.kream.mappers;

import com.kream.kream.entities.AccountEntity;
import com.kream.kream.entities.AddressEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface AccountMapper {
    int insertAccount(AccountEntity account);

    AccountEntity[] selectAccount(@Param("userId")int userId);

    int deleteAccount(@Param("userId")int userId);

    AccountEntity selectAccountByUserId(@Param("userId")int userId);

    int updateAccount(AccountEntity account);

    AccountEntity selectdelete(@Param("userId")int userId);
}
