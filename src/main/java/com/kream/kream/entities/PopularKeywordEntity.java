package com.kream.kream.entities;


import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@Builder
@Getter
@Setter
@EqualsAndHashCode(of = "keyword")
@AllArgsConstructor
@NoArgsConstructor
@RedisHash(value = "popularKeyword", timeToLive = 604800)
public class PopularKeywordEntity {
    @Id
    private String keyword;

    private int count;
}
