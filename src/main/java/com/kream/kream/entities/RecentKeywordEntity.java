package com.kream.kream.entities;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.util.List;

@Builder
@Getter
@Setter
@EqualsAndHashCode(of = "email")
@AllArgsConstructor
@NoArgsConstructor
@RedisHash(value = "recentKeyword", timeToLive = 86400)
public class RecentKeywordEntity {
    @Id
    private String email;
    private List<String> keywords;
}
