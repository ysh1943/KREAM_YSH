package com.kream.kream.controllers;

import com.kream.kream.entities.CategoryDetailEntity;
import com.kream.kream.entities.ImageEntity;
import com.kream.kream.entities.ProductEntity;
import com.kream.kream.entities.UserEntity;
import com.kream.kream.results.CommonResult;
import com.kream.kream.services.AdminService;
import org.apache.catalina.User;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import java.io.IOException;

@Controller
@RequestMapping(value = "/admin")
public class AdminController {
    private AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public ModelAndView getProduct() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("admin/index");
        return modelAndView;
    }

    @RequestMapping(value = "/user", method = RequestMethod.GET)
    public ModelAndView getUser(@RequestParam(value = "filter", required = false) String filter,
                                @RequestParam(value = "keyword", required = false) String keyword) {
        ModelAndView modelAndView = new ModelAndView();
        if (filter == null && keyword == null) {
            UserEntity[] users = this.adminService.selectUser();
            modelAndView.addObject("users", users);
        } else {
            UserEntity[] users = this.adminService.searchUser(filter, keyword);
            modelAndView.addObject("users", users);
            modelAndView.addObject("filter", filter);
            modelAndView.addObject("keyword", keyword);
        }
        modelAndView.setViewName("admin/user");
        return modelAndView;
    }

    @RequestMapping(value = "/product", method = RequestMethod.GET)
    public ModelAndView getProduct(@RequestParam(value = "filter", required = false) String filter,
                                   @RequestParam(value = "keyword", required = false) String keyword) {
        ModelAndView modelAndView = new ModelAndView();
        if (filter == null && keyword == null) {
            ProductEntity[] products = this.adminService.selectProduct();
            modelAndView.addObject("products", products);
        } else {
            ProductEntity[] products = this.adminService.searchProduct(filter, keyword);
            modelAndView.addObject("products", products);
            modelAndView.addObject("filter", filter);
            modelAndView.addObject("keyword", keyword);
        }
        modelAndView.setViewName("admin/product");
        return modelAndView;
    }

    @RequestMapping(value = "/image", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<byte[]> getImage(@RequestParam(value = "id", required = false) Integer id) {
        ProductEntity product = this.adminService.getProductById(id);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }
        ImageEntity image = this.adminService.selectImageByProductId(id);
        if (image == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity
                .ok()
                .contentType(MediaType.parseMediaType(image.getType()))
                .contentLength(image.getData().length)
                .body(image.getData());
    }

    @RequestMapping(value = "/product", method = RequestMethod.DELETE)
    @ResponseBody
    public String deleteMusicIndex(@RequestParam(value = "ids", required = false) Integer[] ids) {
        CommonResult result = this.adminService.deleteProducts(ids);
        JSONObject response = new JSONObject();
        response.put("result", result.name().toLowerCase());
        return response.toString();
    }

    @RequestMapping(value = "/product", method = RequestMethod.POST)
    @ResponseBody
    // @SessionAttribute(value = "user", required = false) UserEntity user 로그인된경우 서버로 요청받기 위해 적어야함
    public String postProduct(ProductEntity product,
                              @RequestParam("categoryDetail") String categoryDetailType,
                              @RequestParam("files") MultipartFile[] files) throws IOException {
        CategoryDetailEntity categoryDetail = adminService.findByCategoryId(categoryDetailType);
        CommonResult result = this.adminService.addProduct(product, categoryDetail, files);
        JSONObject response = new JSONObject();
        response.put("result", result.name().toLowerCase());
        return response.toString();
    }

    @RequestMapping(value = "/order", method = RequestMethod.GET)
    public ModelAndView getOrder() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("admin/order");
        return modelAndView;
    }
}
