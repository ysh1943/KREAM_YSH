package com.kream.kream.controllers;

import com.kream.kream.dtos.ProductDTO;
import com.kream.kream.services.ShopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
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
    public ModelAndView getIndex(@RequestParam(value = "filter", required = false) String filter) {
        ModelAndView modelAndView = new ModelAndView();
        if (filter == null) {
            List<ProductDTO> popularProducts = this.shopService.getPopularProducts();
            modelAndView.addObject("popularProducts", popularProducts);
        } else {
            List<ProductDTO> popularProducts = this.shopService.filterPopularProducts(filter);
            modelAndView.addObject("popularProducts", popularProducts);
            modelAndView.addObject("filter", filter);
        }
        modelAndView.setViewName("shop/index");
        return modelAndView;
    }
}
