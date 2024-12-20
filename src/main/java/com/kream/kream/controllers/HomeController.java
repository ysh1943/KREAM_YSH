package com.kream.kream.controllers;

import com.kream.kream.dtos.ProductDTO;
import com.kream.kream.entities.UserEntity;
import com.kream.kream.services.HomeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@Controller
@RequestMapping(value = "/")
public class HomeController {
    private final HomeService homeService;

    @Autowired
    public HomeController(HomeService homeService) {
        this.homeService = homeService;
    }

    @RequestMapping(value = "/", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getIndex(@SessionAttribute(value = "user", required = false) UserEntity user) {
        List<ProductDTO> popularProducts = this.homeService.getPopularProducts();
        List<ProductDTO> newProducts = this.homeService.getNewProducts();
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("user", user);
        modelAndView.addObject("popularProducts", popularProducts);
        modelAndView.addObject("newProducts", newProducts);
        modelAndView.setViewName("home/index");
        return modelAndView;
    }
}