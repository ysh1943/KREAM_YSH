package com.kream.kream.controllers;

import com.kream.kream.dtos.SellingBidListDTO;
import com.kream.kream.dtos.SellingOrderCompleteListDTO;
import com.kream.kream.dtos.SellingOrderListDTO;
import com.kream.kream.entities.*;
import com.kream.kream.results.CommonResult;
import com.kream.kream.dtos.BidStateDTO;
import com.kream.kream.dtos.OrderStateDTO;
import com.kream.kream.entities.AccountEntity;
import com.kream.kream.entities.AddressEntity;
import com.kream.kream.entities.UserEntity;
import com.kream.kream.results.Result;
import com.kream.kream.services.MyService;
import jakarta.servlet.http.HttpSession;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Controller
@RequestMapping(value = "/my")
public class MyController {
    private final MyService myService;

    @Autowired
    public MyController(MyService myService) {
        this.myService = myService;
    }

    @RequestMapping(value = "/", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public ModelAndView getMypage(@SessionAttribute(value = UserEntity.NAME_SINGULAR, required = false) UserEntity user) {
        ModelAndView modelAndView = new ModelAndView();
        if (user == null) {
            modelAndView.setViewName("redirect:/login");
        }
        modelAndView.addObject("user", user);

        modelAndView.setViewName("my/index");
        return modelAndView;
    }

    @RequestMapping(value = "/buying-bid", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getBidBuying(@SessionAttribute(value = UserEntity.NAME_SINGULAR, required = false) UserEntity user,
                               @RequestParam(value = "state", required = false) String state) throws IOException {
        if (user == null) {
            return "{\"result\":\"logout\"}";
        }
        JSONArray response = new JSONArray();
        List<BidStateDTO> bidsState = myService.getBuyerBidList(user.getId(), state);
        for (BidStateDTO bidState : bidsState) {
            JSONObject result = new JSONObject();
            result.put("buyerBidId", bidState.getBuyerBidId());
            result.put("productId", bidState.getProductId());
            result.put("image", bidState.getBase64Image());
            result.put("size", bidState.getSizeType());
            result.put("baseName", bidState.getProductNameEn());
            result.put("price", bidState.getPrice());
            result.put("deadline", bidState.getDeadline());
            result.put("state", bidState.getState());
            response.put(result);
        }
        return response.toString();
    }

    @RequestMapping(value = "/buying-bid", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String deleteBidBuying(@RequestParam(value = "buyerBidId", required = false) Integer buyerBidId) {
        Result result = this.myService.deleteBuyerBid(buyerBidId);
        JSONObject response = new JSONObject();
        response.put(Result.NAME, result.nameToLower());
        return response.toString();
    }

    @RequestMapping(value = "/buying-order", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getOrderBuying(@SessionAttribute(value = UserEntity.NAME_SINGULAR, required = false) UserEntity user,
                                 @RequestParam(value = "state", required = false) String state) throws IOException {
        if (user == null) {
            return "{\"result\":\"logout\"}";
        }
        JSONArray response = new JSONArray();
        List<OrderStateDTO> ordersState = myService.getBuyerOrderList(user.getId(), state);
        for (OrderStateDTO orderState : ordersState) {
            JSONObject result = new JSONObject();
            result.put("productId", orderState.getProductId());
            result.put("price", orderState.getPrice());
            result.put("image", orderState.getBase64Image());
            result.put("size", orderState.getSizeType());
            result.put("baseName", orderState.getProductNameEn());
            result.put("state", orderState.getState().getKoreaName());
            response.put(result);
        }
        return response.toString();
    }

    @RequestMapping(value = "/buying", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody

    public ModelAndView getBuying(@SessionAttribute(value = UserEntity.NAME_SINGULAR, required = false) UserEntity user) {
        ModelAndView modelAndView = new ModelAndView();
        if (user == null) {
            modelAndView.setViewName("redirect:/login");
        } else {
            int countBuyerBid = this.myService.getCountBuyerBid(user.getId());
            int countBuyerPending = this.myService.getCountBuyerPending(user.getId());
            int countOrderPending = this.myService.getCountOrderPending(user.getId());
            int countBuyerFinish = this.myService.getCountBuyerFinish(user.getId());
            int countOrderFinish = this.myService.getCountOrderFinish(user.getId());
            modelAndView.addObject("countBuyerBid", countBuyerBid);
            modelAndView.addObject("countBuyerPending", countBuyerPending);
            modelAndView.addObject("countOrderPending", countOrderPending);
            modelAndView.addObject("countOrderFinish", countOrderFinish);
            modelAndView.addObject("countBuyerFinish", countBuyerFinish);
            modelAndView.addObject("user", user);
            modelAndView.setViewName("my/buying");
        }
        return modelAndView;
    }

    @RequestMapping(value = "/selling", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public ModelAndView getSelling(@SessionAttribute(value = "user", required = false) UserEntity user,
                                   @RequestParam(value = "tab", required = false) String tab,
                                   @RequestParam(value = "state", required = false) String state) {
        ModelAndView modelAndView = new ModelAndView();
        if (user == null) {
            modelAndView.setViewName("redirect:/");
            return modelAndView;
        }
        int sellerBidsCount = myService.getSellerBidListCount(user.getId());
        SellingBidListDTO[] sellerBids = myService.getSellerBidList(user.getId(), tab, state);
        int sellerOrdersCount = myService.getSellerOrderListCount(user.getId());
        SellingOrderListDTO[] sellerOrders = myService.getSellerOrderList(user.getId(), tab, state);
        int sellerOrdersCompleteCount = myService.getSellerOrderCompleteListCount(user.getId());
        SellingOrderCompleteListDTO[] sellerOrdersComplete = myService.getSellerOrderCompleteList(user.getId(), tab, state);
        modelAndView.addObject("user", user);
        modelAndView.addObject("tab", tab);
        modelAndView.addObject("sellerBidsCount", sellerBidsCount);
        modelAndView.addObject("sellerBids", sellerBids);
        modelAndView.addObject("sellerOrdersCount", sellerOrdersCount);
        modelAndView.addObject("sellerOrders", sellerOrders);
        modelAndView.addObject("sellerOrdersCompleteCount", sellerOrdersCompleteCount);
        modelAndView.addObject("sellerOrdersComplete", sellerOrdersComplete);
        modelAndView.setViewName("my/selling");
        return modelAndView;
    }

    @RequestMapping(value = "/selling", method = RequestMethod.DELETE)
    @ResponseBody
    public String deleteSellerBidId(@RequestParam(value = "id", required = false) Integer id) {
        CommonResult result = this.myService.deleteSellerBid(id);
        JSONObject response = new JSONObject();
        response.put("result", result.name().toLowerCase());
        return response.toString();
    }

    @RequestMapping(value = "/selling", method = RequestMethod.PATCH)
    @ResponseBody
    public String patchOrderState(@RequestParam(value = "id") Integer id) {
        CommonResult result = this.myService.patchOrderState(id);
        JSONObject response = new JSONObject();
        response.put("result", result.name().toLowerCase());
        return response.toString();
    }

    @RequestMapping(value = "/profile", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public ModelAndView getMy(@SessionAttribute(value = UserEntity.NAME_SINGULAR, required = false) UserEntity user) {
        ModelAndView modelAndView = new ModelAndView();
        if (user == null) {
            modelAndView.setViewName("redirect:/login");
        } else {
            modelAndView.addObject("user", user);
            modelAndView.setViewName("my/profile");
        }
        return modelAndView;
    }

    @RequestMapping(value = "/recover-password", method = RequestMethod.PATCH, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String patchRecoverPassword(UserEntity user,
                                       @RequestParam(value = "newPassword", required = false) String newPassword) {
        Result result = this.myService.resolveRecoverPassword(user, newPassword);
        JSONObject response = new JSONObject();
        response.put(Result.NAME, result.nameToLower());
        return response.toString();
    }

    @RequestMapping(value = "/modify-contact", method = RequestMethod.PATCH, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String patchContact(@SessionAttribute("user") UserEntity signedUser, UserEntity user) {
        Result result = this.myService.modifyContact(user);
        if (result == CommonResult.SUCCESS) {
            signedUser.setContact(user.getContact());
        }
        JSONObject response = new JSONObject();
        response.put("contact",user.getContact());
        response.put(Result.NAME, result.nameToLower());
        return response.toString();
    }

    @RequestMapping(value = "/address", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public ModelAndView getAddress(@SessionAttribute(value = UserEntity.NAME_SINGULAR) UserEntity user) {
        ModelAndView modelAndView = new ModelAndView();
        if (user != null) {
            modelAndView.addObject("user", user);
            modelAndView.setViewName("my/address");
        } else {
            modelAndView.setViewName("redirect:/login");
        }
        return modelAndView;
    }

    @RequestMapping(value = "/address", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postAddress(AddressEntity address, @RequestParam(value = "setDefault", required = false, defaultValue = "false") boolean setDefault) {
        Result result = this.myService.addAddress(address, setDefault);
        JSONObject response = new JSONObject();
        response.put(Result.NAME, result.nameToLower());
        return response.toString();
    }

    @RequestMapping(value = "/address/", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<AddressEntity[]> getAddr(
            @SessionAttribute(value = UserEntity.NAME_SINGULAR) UserEntity user
    ) {
        if (Objects.isNull(user)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // 로그인 안됨 (401)
        }
        AddressEntity[] address = this.myService.getAddressByUserId(user.getId());
        if (address == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(address);
    }

    @RequestMapping(value = "/address-modify", method = RequestMethod.PATCH, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String modifyAddress(AddressEntity address,
                                @RequestParam(value = "setDefault", required = false, defaultValue = "false") boolean setDefault) {
        Result result = this.myService.modify(address, setDefault);
        JSONObject response = new JSONObject();
        response.put(Result.NAME, result.nameToLower());
        return response.toString();
    }

    @RequestMapping(value = "/address-delete", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String deleteAddress(AddressEntity address) {
        Result result = this.myService.Delete(address);
        JSONObject response = new JSONObject();
        response.put(Result.NAME, result.nameToLower());
        return response.toString();
    }

    @RequestMapping(value = "/account", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public ModelAndView getAccount(@SessionAttribute(value = UserEntity.NAME_SINGULAR) UserEntity user) {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("user", user);
        modelAndView.setViewName("my/account");
        return modelAndView;
    }

    @RequestMapping(value = "/account", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postAccount(AccountEntity account) {
        Result result = this.myService.getAccount(account);
        JSONObject response = new JSONObject();
        response.put(Result.NAME, result.nameToLower());
        return response.toString();
    }

    @RequestMapping(value = "/account/", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<AccountEntity[]> getAccounted(@SessionAttribute(value = UserEntity.NAME_SINGULAR) UserEntity user) {
        if (Objects.isNull(user)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // 로그인 안됨 (401)
        }
        AccountEntity[] account = this.myService.getAccountByUserId(user.getId());
        if (account == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(account);
    }

    @RequestMapping(value = "/account-delete", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String deleteAccount(AccountEntity account) {
        Result result = this.myService.accountdelete(account);
        JSONObject response = new JSONObject();
        response.put(Result.NAME, result.nameToLower());
        return response.toString();
    }

    @RequestMapping(value = "/account-modify", method = RequestMethod.PATCH, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String modifyAccount(AccountEntity account) {
        Result result = this.myService.modifyaccount(account);
        JSONObject response = new JSONObject();
        response.put(Result.NAME, result.nameToLower());
        return response.toString();
    }


}
