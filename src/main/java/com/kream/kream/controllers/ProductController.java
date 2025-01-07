package com.kream.kream.controllers;

import com.kream.kream.dtos.*;
import com.kream.kream.entities.ImageEntity;
import com.kream.kream.entities.ProductEntity;
import com.kream.kream.entities.UserEntity;
import com.kream.kream.services.ProductService;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.io.IOException;
import java.util.List;
import java.util.Objects;

@Controller
@RequestMapping(value = "/")
public class ProductController {
    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @RequestMapping(value = "/product", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getProducts(@SessionAttribute(value = "user", required = false) UserEntity user,
                                    @RequestParam(value = "id", required = false) Integer id) {
        ModelAndView modelAndView = new ModelAndView();
        ProductEntity product = this.productService.getProductDetailById(id);
        if (user != null) {
            modelAndView.addObject("user", user);
        }
        if (product == null) {
            modelAndView.setViewName("redirect:/");
        } else {
            SimilarProductImageDTO[] similarImages = this.productService.getImageByBaseName(Objects.requireNonNull(product).getBaseName());
            ImageEntity[] images = this.productService.getImageById(id);
            List<SizeDTO> sizes = this.productService.getSizeByProductId(id);
            List<OrderChartDTO> orderCharts = this.productService.getOrderChartByProductId(id);
            modelAndView.addObject("orderCharts", orderCharts);
            modelAndView.addObject("sizes", sizes);
            modelAndView.addObject("similarImages", similarImages);

            modelAndView.addObject("images", images);
            modelAndView.addObject("product", product);
            modelAndView.setViewName("product/product");
        }

        return modelAndView;
    }

    @RequestMapping(value = "/product", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getSizeByProduct(@SessionAttribute(value = "user", required = false) UserEntity user,
                                   @RequestParam(value = "id", required = false) Integer id) throws IOException {
        if (user == null) {
            JSONObject response = new JSONObject();
            response.put("result", "logout");
            return response.toString();
        } else {
            List<SizeDTO> sizes = this.productService.getSizeByProductId(id);
            JSONArray response = new JSONArray();
            for (SizeDTO size : sizes) {
                JSONObject result = new JSONObject();
                result.put("sizeId", size.getSizeId());
                result.put("sellerBidId", size.getSellerBidId());
                result.put("type", size.getType());
                result.put("sellPrice", size.getSellPrice());
                result.put("buyPrice", size.getBuyPrice());
                result.put("lowestSellPrice", size.getLowestSellPrice());
                result.put("highestBuyPrice", size.getHighestBuyPrice());
                result.put("nameEn", size.getNameEn());
                result.put("nameKo", size.getNameKo());
                result.put("modelNumber", size.getModelNumber());
                result.put("base64Image", size.getBase64Image());
                result.put("userId",user.getId());
                response.put(result);
            }
            return response.toString();
        }
    }

    @RequestMapping(value = "/product-order-chart", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getOrderChat(@RequestParam(value = "id", required = false) Integer id) {
        List<OrderChartDTO> orderCharts = this.productService.getOrderChartByProductId(id);
        JSONArray response = new JSONArray();
        for (OrderChartDTO orderChart : orderCharts) {
            JSONObject result = new JSONObject();
            result.put("orderId", orderChart.getOrderId());
            result.put("sizeType", orderChart.getSizeType());
            result.put("orderPrice", orderChart.getOrderPrice());
            result.put("orderDate", orderChart.getOrderDate());
            response.put(result);
        }
        return response.toString();
    }

    @RequestMapping(value = "/product-sell-chart", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getSellBidChart(@RequestParam(value = "id", required = false) Integer id) {
        List<SellBidChartDTO> sellBidCharts = this.productService.getSellBidChartByProductId(id);
        JSONArray response = new JSONArray();
        for (SellBidChartDTO sellBidChart : sellBidCharts) {
            JSONObject result = new JSONObject();
            result.put("sizeType", sellBidChart.getSizeType());
            result.put("sellPrice", sellBidChart.getSellPrice());
            result.put("sellCount", sellBidChart.getSellCount());
            response.put(result);
        }
        return response.toString();
    }

    @RequestMapping(value = "/product-buy-chart", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getBuyBidChart(@RequestParam(value = "id", required = false) Integer id) {
        List<BuyBidChartDTO> buyBidCharts = this.productService.getBuyBidChartByProductId(id);
        JSONArray response = new JSONArray();
        for (BuyBidChartDTO buyBidChart : buyBidCharts) {
            JSONObject result = new JSONObject();
            result.put("sizeType", buyBidChart.getSizeType());
            result.put("buyPrice", buyBidChart.getBuyPrice());
            result.put("buyCount", buyBidChart.getBuyCount());
            response.put(result);
        }
        return response.toString();
    }
}
