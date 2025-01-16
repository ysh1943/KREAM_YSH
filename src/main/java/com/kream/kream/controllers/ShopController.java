package com.kream.kream.controllers;

import com.kream.kream.dtos.ShopProductDTO;
import com.kream.kream.entities.UserEntity;
import com.kream.kream.services.ShopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@Controller
@RequestMapping(value = "/")
public class ShopController {
    private final ShopService shopService;

    @Autowired
    public ShopController(ShopService shopService) {
        this.shopService = shopService;
    }

    @RequestMapping(value = "/shop", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getIndex(@SessionAttribute(value = "user", required = false) UserEntity user,
                                 @RequestParam(value = "filter", required = false) String filter,
                                 @RequestParam(value = "keyword", required = false) String keyword,
                                 @RequestParam(value = "brand", required = false) String brand,
                                 @RequestParam(value = "category", required = false) String[] category,
                                 @RequestParam(value = "gender", required = false) String[] gender,
                                 @RequestParam(value = "color", required = false) String[] color,
                                 @RequestParam(value = "price", required = false) String[] price) {
        ModelAndView modelAndView = new ModelAndView();
        List<ShopProductDTO> popularProducts = this.shopService.getPopularProducts(filter, keyword, brand, category, gender, color, price);
        List<ShopProductDTO> newProducts = this.shopService.getNewProducts(filter, keyword, brand, category, gender, color, price);
        modelAndView.addObject("popularProducts", popularProducts);
        modelAndView.addObject("newProducts", newProducts);
        modelAndView.addObject("filter", filter);
        modelAndView.addObject("user", user);
        modelAndView.setViewName("shop/index");
        return modelAndView;
    }
}
