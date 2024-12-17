package com.kream.kream.dtos;

import com.kream.kream.result.Result;
import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResultDto<TResult extends Result, TPayload> {
    private TResult result;
    private TPayload payload;
}