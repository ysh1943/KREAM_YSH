package com.kream.kream.mappers;

import com.kream.kream.entities.ImageEntity;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ImageMapper {

    int insertImage(ImageEntity image);

    ImageEntity selectImageByProductIdAndIsPrimary(Integer id);
}
