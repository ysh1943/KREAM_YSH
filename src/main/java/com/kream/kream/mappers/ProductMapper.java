package com.kream.kream.mappers;

import com.kream.kream.dtos.ProductDTO;
import com.kream.kream.entities.ProductEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ProductMapper {
    int insertProduct(ProductEntity product);

    ProductEntity[] selectProduct();

    ProductEntity selectProductById(Integer id);

    ProductEntity[] selectProductBySearch(@Param("filter") String filter,
                                          @Param("keyword") String keyword);

    List<ProductDTO> selectPopularProducts();

    List<ProductDTO> selectPopularProductsByFilter(@Param("filter") String filter);

    List<ProductDTO> selectNewProducts();

    int updateProduct(@Param("product") ProductEntity product);
}
