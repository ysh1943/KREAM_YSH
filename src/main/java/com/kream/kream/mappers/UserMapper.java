package com.kream.kream.mappers;

import com.kream.kream.entities.UserEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {

    int selectUserCount();

    int selectUserCountBySearch(String filter, String keyword);

    UserEntity[] selectUser();

    UserEntity[] selectUserByPage(@Param("limitCount") int limitCount,
                                  @Param("offsetCount") int offsetCount);

    UserEntity[] selectUserBySearch(@Param("filter") String filter,
                                    @Param("keyword") String keyword,
                                    @Param("limitCount") int limitCount,
                                    @Param("offsetCount") int offsetCount);


    int deleteUserByEmail(@Param("email") String email);

    int insertUser(UserEntity user);

    UserEntity selectUserById(@Param("id") int id);

    UserEntity selectUserByEmail(@Param("email") String email);

    UserEntity selectUserByContact(@Param("contact") String contact);

    UserEntity selectUserByNickname(@Param("nickname") String nickname);

    UserEntity selectUserBySocialTypeCodeAndSocialId(@Param("socialTypeCode") String socialTypeCode,
                                                     @Param("socialId") String socialId);

    int updateUser(UserEntity user);
}
