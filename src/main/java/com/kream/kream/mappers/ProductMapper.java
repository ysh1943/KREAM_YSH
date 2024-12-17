package com.kream.kream.mappers;

import com.kream.kream.entities.ProductEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ProductMapper {
    int insertProduct(ProductEntity product);

    ProductEntity[] selectProduct();

    ProductEntity selectProductById(Integer id);

    ProductEntity[] selectProductBySearch(@Param("filter") String filter,
                                          @Param("keyword") String keyword);

    int updateProduct(@Param("product") ProductEntity product);
}
