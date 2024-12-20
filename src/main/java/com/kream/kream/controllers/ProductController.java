package com.kream.kream.controllers;

import com.kream.kream.dtos.SimilarProductImageDTO;
import com.kream.kream.entities.ImageEntity;
import com.kream.kream.entities.ProductEntity;
import com.kream.kream.entities.UserEntity;
import com.kream.kream.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.servlet.ModelAndView;

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
        ImageEntity[] images = this.productService.getImageById(id);
        ProductEntity product = this.productService.getProductDetailById(id);
        if (product == null) {
            modelAndView.setViewName("redirect:/");
        } else {
            SimilarProductImageDTO[] similarImages = this.productService.getImageByBaseName(product.getBaseName());
            modelAndView.addObject("similarImages", similarImages);
        }
        modelAndView.addObject("user", user);
        modelAndView.addObject("images", images);
        modelAndView.addObject("product", product);
        modelAndView.setViewName("product-detail/products");
        return modelAndView;
    }
}
