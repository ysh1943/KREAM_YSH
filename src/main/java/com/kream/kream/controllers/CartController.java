package com.kream.kream.controllers;

import com.kream.kream.dtos.CartDTO;
import com.kream.kream.entities.CartEntity;
import com.kream.kream.entities.UserEntity;
import com.kream.kream.results.Result;
import com.kream.kream.services.CartService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping(value = "/cart")

public class CartController {
    private final CartService cartService;

    @Autowired
    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public ModelAndView getIndex(@SessionAttribute(value = UserEntity.NAME_SINGULAR) UserEntity user, Model model) {

        CartDTO[] cart = this.cartService.selectCart(user.getId());
        Integer count = this.cartService.counting(user.getId());

        int cartindex = cart.length * 3000;

        ModelAndView modelAndView = new ModelAndView();
        if (user == null) {
            modelAndView.setViewName("redirect:/login");
        } else {
            modelAndView.setViewName("cart/index");
            modelAndView.addObject("cartIndex", cartindex);
            modelAndView.addObject("cart", cart);
            modelAndView.addObject("count", count);

        }
        return modelAndView;
    }

    @RequestMapping(value = "/", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String PostIndex(CartEntity cart) {
        Result result = this.cartService.addCart(cart);
        JSONObject response = new JSONObject();
        response.put(Result.NAME, result.nameToLower());
        return response.toString();
    }


    @RequestMapping(value = "/delete", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String cartdelete(@RequestParam(value = "id", required = false, defaultValue = "0") int id) {
        Result result = this.cartService.delete(id);
        JSONObject response = new JSONObject();
        response.put(Result.NAME, result.nameToLower());
        return response.toString();
    }
}
