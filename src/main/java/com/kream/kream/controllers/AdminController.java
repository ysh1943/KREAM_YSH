package com.kream.kream.controllers;

import com.kream.kream.dtos.OrderCountDTO;
import com.kream.kream.dtos.OrderDTO;
import com.kream.kream.entities.*;
import com.kream.kream.results.CommonResult;
import com.kream.kream.services.AdminService;
import com.kream.kream.vos.PageVo;
import com.kream.kream.vos.ProductPageVo;
import org.apache.commons.lang3.tuple.Pair;
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
    private final AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public ModelAndView getIndex(@SessionAttribute(value = "user", required = false) UserEntity user) {
        if (user == null || !user.isAdmin()) {
            return new ModelAndView("redirect:/");
        }
        ModelAndView modelAndView = new ModelAndView();
        int userCount = this.adminService.selectUserCount();
        OrderCountDTO orderCounts = this.adminService.selectOrderCount();
        UserOrderCountEntity[] users = this.adminService.selectUserByLimit();
        OrderDTO[] orders = this.adminService.selectOrderByLimit();
        modelAndView.addObject("userCount", userCount);
        modelAndView.addObject("orderCounts", orderCounts);
        modelAndView.addObject("users", users);
        modelAndView.addObject("orders", orders);
        modelAndView.setViewName("admin/index");
        return modelAndView;
    }

    @RequestMapping(value = "/user", method = RequestMethod.GET)
    public ModelAndView getUser(@SessionAttribute(value = "user", required = false) UserEntity user,
                                @RequestParam(value = "page", required = false, defaultValue = "1") int page,
                                @RequestParam(value = "filter", required = false) String filter,
                                @RequestParam(value = "keyword", required = false) String keyword) {
        if (user == null || !user.isAdmin()) {
            return new ModelAndView("redirect:/");
        }
        ModelAndView modelAndView = new ModelAndView();
        if (filter == null && keyword == null) {
            Pair<PageVo, UserOrderCountEntity[]> pair = this.adminService.selectUser(page);
            modelAndView.addObject("PageVo", pair.getLeft());
            modelAndView.addObject("users", pair.getRight());
        } else {
            Pair<PageVo, UserOrderCountEntity[]> pair = this.adminService.searchUser(page, filter, keyword);
            modelAndView.addObject("PageVo", pair.getLeft());
            modelAndView.addObject("users", pair.getRight());
            modelAndView.addObject("filter", filter);
            modelAndView.addObject("keyword", keyword);
        }
        modelAndView.setViewName("admin/user");
        return modelAndView;
    }

    @RequestMapping(value = "/user", method = RequestMethod.PATCH)
    @ResponseBody
    public String patchUser(@RequestParam(value = "userEmail") String userEmail,
                            @RequestParam(value = "suspend") boolean suspend) {
        System.out.println(userEmail + suspend);
        CommonResult result = this.adminService.patchUser(userEmail, suspend);
        JSONObject response = new JSONObject();
        response.put("result", result.name().toLowerCase());
        return response.toString();
    }

    @RequestMapping(value = "/product", method = RequestMethod.GET)
    public ModelAndView getProduct(@SessionAttribute(value = "user", required = false) UserEntity user,
                                   @RequestParam(value = "page", required = false, defaultValue = "1") int page,
                                   @RequestParam(value = "filter", required = false) String filter,
                                   @RequestParam(value = "keyword", required = false) String keyword) {
        if (user == null || !user.isAdmin()) {
            return new ModelAndView("redirect:/");
        }
        ModelAndView modelAndView = new ModelAndView();
        if (filter == null && keyword == null) {
            Pair<ProductPageVo, ProductEntity[]> pair = this.adminService.selectProduct(page);
            modelAndView.addObject("ProductPageVo", pair.getLeft());
            modelAndView.addObject("products", pair.getRight());
        } else {
            Pair<ProductPageVo, ProductEntity[]> pair = this.adminService.searchProduct(page, filter, keyword);
            modelAndView.addObject("ProductPageVo", pair.getLeft());
            modelAndView.addObject("products", pair.getRight());
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

    @RequestMapping(value = "/product", method = RequestMethod.POST)
    @ResponseBody
    // @SessionAttribute(value = "user", required = false) UserEntity user 로그인된경우 서버로 요청받기 위해 적어야함
    public String postProduct(ProductEntity product,
                              @RequestParam("categoryDetail") String categoryDetailType,
                              @RequestParam("files") MultipartFile[] files,
                              @RequestParam("sizes") String[] sizes) throws IOException {
        CategoryDetailEntity categoryDetail = adminService.findByCategoryId(categoryDetailType);
        CommonResult result = this.adminService.addProduct(product, categoryDetail, files, sizes);
        JSONObject response = new JSONObject();
        response.put("result", result.name().toLowerCase());
        return response.toString();
    }

    @RequestMapping(value = "/product", method = RequestMethod.DELETE)
    @ResponseBody
    public String deleteProductIndex(@RequestParam(value = "ids", required = false) Integer[] ids) {
        CommonResult result = this.adminService.deleteProducts(ids);
        JSONObject response = new JSONObject();
        response.put("result", result.name().toLowerCase());
        return response.toString();
    }

    @RequestMapping(value = "/order", method = RequestMethod.GET)
    public ModelAndView getOrder(@SessionAttribute(value = "user", required = false) UserEntity user,
                                 @RequestParam(value = "page", required = false, defaultValue = "1") int page,
                                 @RequestParam(value = "filter", required = false) String filter,
                                 @RequestParam(value = "keyword", required = false) String keyword) {
        if (user == null || !user.isAdmin()) {
            return new ModelAndView("redirect:/");
        }
        ModelAndView modelAndView = new ModelAndView();
        if (filter == null && keyword == null) {
            Pair<PageVo, OrderDTO[]> pair = this.adminService.selectOrder(page);
            modelAndView.addObject("PageVo", pair.getLeft());
            modelAndView.addObject("orders", pair.getRight());
        } else {
            Pair<PageVo, OrderDTO[]> pair = this.adminService.searchOrder(page, filter, keyword);
            modelAndView.addObject("PageVo", pair.getLeft());
            modelAndView.addObject("orders", pair.getRight());
            modelAndView.addObject("filter", filter);
            modelAndView.addObject("keyword", keyword);
        }
        modelAndView.setViewName("admin/order");
        return modelAndView;
    }

    @RequestMapping(value = "/order", method = RequestMethod.PATCH)
    @ResponseBody
    public String patchOrder(@RequestParam(value = "id") int id,
                             @RequestParam(value = "state", required = false) String state) {
        CommonResult result = this.adminService.patchOrder(id, state);
        JSONObject response = new JSONObject();
        response.put("result", result.name().toLowerCase());
        return response.toString();
    }
}
