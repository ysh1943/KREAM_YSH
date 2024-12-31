package com.kream.kream.controllers;

import com.kream.kream.dtos.OrderProductDTO;
import com.kream.kream.dtos.ProductPriceDTO;
import com.kream.kream.entities.*;
import com.kream.kream.results.OrderValidationResult;
import com.kream.kream.results.Result;
import com.kream.kream.services.OrderService;

import com.kream.kream.services.PaymentService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping(value = "/")
public class OrderController {
    private final OrderService orderService;
    private final PaymentService paymentService;


    @Autowired
    public OrderController(OrderService orderService, PaymentService paymentService) {
        this.orderService = orderService;
        this.paymentService = paymentService;
    }

    @RequestMapping(value = "/order", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getOrder(@SessionAttribute(value = "user", required = false) UserEntity user,
                               @RequestParam(value = "size-id", required = false) Integer id,
                               @RequestParam(value = "type", required = false) String type) {
        ModelAndView modelAndView = new ModelAndView();
        if (type.equals("bid") || type.equals("buy")) {
            modelAndView.setViewName("order/buy");
        } else if (type.equals("add") || type.equals("sell")) {
            modelAndView.setViewName("order/sell");
        }
        else {
            modelAndView.setViewName("product/product");
        }
        OrderProductDTO orderProduct = this.orderService.getOrderProduct(id);
        ProductPriceDTO productPrice = this.orderService.selectProductPriceBySizeId(id);
        modelAndView.addObject("productPrice", productPrice);
        modelAndView.addObject("orderProduct", orderProduct);
        modelAndView.addObject("user", user);
        return modelAndView;
    }

    @RequestMapping(value = "/address", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getAddress(@RequestParam(value = "user-id", required = false) Integer userId) {
        AddressEntity address = this.orderService.getAddressByUserId(userId);
        JSONObject response = new JSONObject();
        if (address == null) {
            response.put("result", "empty");
            return response.toString();
        }
        response.put("id", address.getId());
        response.put("userId", address.getUserId());
        response.put("name", address.getName());
        response.put("contact", address.getContact());
        response.put("postal", address.getPostal());
        response.put("basicAddress", address.getBasicAddress());
        response.put("detailAddress", address.getDetailAddress());
        return response.toString();
    }

    @RequestMapping(value = "/account", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getAccount(@RequestParam(value = "user-id", required = false) Integer userId) {
        AccountEntity account = this.orderService.getAccountByUserId(userId);
        JSONObject response = new JSONObject();
        if (account == null) {
            response.put("result", "empty");
            return response.toString();
        }
        response.put("id", account.getId());
        response.put("userId", account.getUserId());
        response.put("bankName", account.getBankName());
        response.put("accountNumber", account.getAccountNumber());
        response.put("accountOwner", account.getAccountOwner());
        return response.toString();
    }

    @RequestMapping(value = "/buy-bid", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postBuyerBid(BuyerBidEntity buyerBid) {
        Result result = this.orderService.insertBuyerBid(buyerBid);
        JSONObject response = new JSONObject();
        response.put(Result.NAME, result.nameToLower());
        return response.toString();
    }

    @RequestMapping(value = "/buy-order", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postBuyOrder(OrderEntity order,
                               @RequestParam(value = "sizeId", required = false) Integer sizeId,
                               @RequestParam(value = "sellerBidId", required = false) Integer sellerBidId,
                               @RequestParam(value = "merchantUid", required = false) String merchantUid) {
        Result result = this.orderService.insertBuyOrder(order, sizeId, sellerBidId);
        JSONObject response = new JSONObject();
//        boolean isPaymentValid = this.paymentService.verifyPayment(merchantUid, sizeId, sellerBidId);
//
//        if (!isPaymentValid) {
//            response.put(Result.NAME, OrderValidationResult.FAILURE_PRICE.nameToLower());
//            return response.toString();
//        }
        response.put(Result.NAME, result.nameToLower());
        return response.toString();
    }

    @RequestMapping(value = "/sell-add", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postSellerBid(SellerBidEntity sellerBid) {
        Result result = this.orderService.insertSellerBid(sellerBid);
        JSONObject response = new JSONObject();
        response.put(Result.NAME, result.nameToLower());
        return response.toString();
    }

    @RequestMapping(value = "/sell-order", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postSellOrder(OrderEntity order) {
        Result result = this.orderService.insertSellOrder(order);
        System.out.println(result);
        JSONObject response = new JSONObject();
        response.put(Result.NAME, result.nameToLower());
        return response.toString();
    }

}
