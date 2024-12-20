package com.kream.kream.mappers;

import com.kream.kream.dtos.SimilarProductImageDTO;
import com.kream.kream.entities.ImageEntity;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ImageMapper {

    int insertImage(ImageEntity image);

    ImageEntity selectImageByProductIdAndIsPrimary(Integer id);

    ImageEntity[] selectImageById(Integer id);
}
