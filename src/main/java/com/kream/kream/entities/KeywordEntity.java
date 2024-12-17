package com.kream.kream.entities;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@EqualsAndHashCode(of = {"id"})
public class KeywordEntity {
    private int id;
    private String keyword;
    private int searchCount;
    private LocalDateTime lastSearch;
}
