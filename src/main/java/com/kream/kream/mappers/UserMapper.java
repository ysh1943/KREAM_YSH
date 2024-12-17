package com.kream.kream.mappers;

import com.kream.kream.entities.UserEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {
    UserEntity[] selectUser();

    UserEntity[] selectUserBySearch(@Param("filter") String filter,
                                    @Param("keyword") String keyword);
}
