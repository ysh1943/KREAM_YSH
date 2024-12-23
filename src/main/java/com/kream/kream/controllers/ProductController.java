package com.kream.kream.controllers;

import com.kream.kream.dtos.SimilarProductImageDTO;
import com.kream.kream.dtos.SizeDTO;
import com.kream.kream.entities.ImageEntity;
import com.kream.kream.entities.ProductEntity;
import com.kream.kream.entities.UserEntity;
import com.kream.kream.services.ProductService;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.io.IOException;
import java.util.List;

@Controller
@RequestMapping(value = "/")
public class ProductController {
    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @RequestMapping(value = "/products", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getProducts(@SessionAttribute(value = "user", required = false) UserEntity user,
                                    @RequestParam(value = "id", required = false) Integer id) {
        ModelAndView modelAndView = new ModelAndView();
        ProductEntity product = this.productService.getProductDetailById(id);
        if (product == null) {
            modelAndView.setViewName("redirect:/");
        } else {
            SimilarProductImageDTO[] similarImages = this.productService.getImageByBaseName(product.getBaseName());
            ImageEntity[] images = this.productService.getImageById(id);
            List<SizeDTO> sizes = this.productService.getSizeByProductId(id);
            modelAndView.addObject("sizes", sizes);
            modelAndView.addObject("similarImages", similarImages);
            modelAndView.addObject("user", user);
            modelAndView.addObject("images", images);
            modelAndView.addObject("product", product);
            modelAndView.setViewName("product-detail/products");
        }
        return modelAndView;
    }

    @RequestMapping(value = "/products",method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getSizeByProduct(@RequestParam(value = "id", required = false) Integer id) throws IOException {
        List<SizeDTO> sizes = this.productService.getSizeByProductId(id);
        JSONArray response = new JSONArray();
        for (SizeDTO size : sizes) {
            JSONObject result = new JSONObject();
            result.put("sizeId", size.getSizeId());
            result.put("type", size.getType());
            result.put("sellPrice", size.getSellPrice());
            result.put("buyPrice", size.getBuyPrice());
            result.put("lowestSellPrice", size.getLowestSellPrice());
            result.put("highestBuyPrice", size.getHighestBuyPrice());
            result.put("nameEn", size.getNameEn());
            result.put("nameKo", size.getNameKo());
            result.put("modelNumber", size.getModelNumber());
            result.put("base64Image", size.getBase64Image());
            response.put(result);
        }
        return response.toString();
    }
}
