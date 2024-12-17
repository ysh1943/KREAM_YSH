package com.kream.kream.mappers;

import com.kream.kream.entities.UserEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {
    UserEntity[] selectUser();

    UserEntity[] selectUserBySearch(@Param("filter") String filter,
                                    @Param("keyword") String keyword);

    int deleteUserByEmail(@Param("email") String email);

    int insertUser(UserEntity user);

    UserEntity selectUserByEmail(@Param("email") String email);

    UserEntity selectUserByContact(@Param("contact") String contact);

    UserEntity selectUserByNickname(@Param("nickname") String nickname);

    UserEntity selectUserBySocialTypeCodeAndSocialId(@Param("socialTypeCode") String socialTypeCode,
                                                     @Param("socialId") String socialId);

    int updateUser(UserEntity user);

}
