package com.kream.kream.mappers;

import com.kream.kream.entities.EmailTokenEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface EmailTokenMapper {
    int insertEmailToken(EmailTokenEntity emailToken);

    EmailTokenEntity selectEmailTokenByUserEmailTokenKey(@Param("userEmail") String userEmail,
                                                         @Param("key")String key);

    int updateEmailToken(EmailTokenEntity emailToken);
}
