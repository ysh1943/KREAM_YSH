package com.kream.kream.mappers;

import com.kream.kream.entities.AccountEntity;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AccountMapper {
    AccountEntity selectAccountByUserId(Integer userId);
}
