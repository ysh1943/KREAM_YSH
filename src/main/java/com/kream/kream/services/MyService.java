package com.kream.kream.services;

import com.kream.kream.dtos.*;
import com.kream.kream.entities.*;
import com.kream.kream.exceptions.TransactionalException;
import com.kream.kream.mappers.*;
import com.kream.kream.results.AddressResult;
import com.kream.kream.results.CommonResult;
import com.kream.kream.results.LoginResult;
import com.kream.kream.results.Result;
import com.kream.kream.results.user.SocialResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.parameters.P;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class MyService {
    private final UserMapper userMapper;
    private final AddressMapper addressMapper;
    private final AccountMapper accountMapper;
    private final BuyerBidMapper buyerBidMapper;
    private final OrderMapper orderMapper;
    private final SellerBidMapper sellerBidMapper;

    @Autowired
    public MyService(UserMapper userMapper, OrderMapper orderMapper, AddressMapper addressMapper, AccountMapper accountMapper, BuyerBidMapper buyerBidMapper, SellerBidMapper sellerBidMapper) {
        this.userMapper = userMapper;
        this.addressMapper = addressMapper;
        this.accountMapper = accountMapper;
        this.orderMapper = orderMapper;
        this.buyerBidMapper = buyerBidMapper;
        this.sellerBidMapper = sellerBidMapper;
    }

    public List<BidStateDTO> getBuyerBidList(Integer userId, String state){
        if (state == null) {
            state = "all";
        }
        List<BidStateDTO> buyerBids = this.buyerBidMapper.selectBuyerBidByState(userId, state);
        if (buyerBids == null || buyerBids.isEmpty()){
            return new ArrayList<>();
        }
        return buyerBids;
    }

   public int getCountBuyerBid(Integer userId) {
        if (userId == null) {
            return 0;
        }
        return this.buyerBidMapper.selectBuyerBidCountByState(userId);
   }

   public int getCountBuyerPending(Integer userId) {
        if (userId == null) {
            return 0;
        }
        return this.buyerBidMapper.selectBuyerBidCountByPending(userId);
   }

   public int getCountOrderPending(Integer userId) {
        if (userId == null){
            return 0;
        }
        return this.orderMapper.selectBuyerOrderCountByPending(userId);
   }

   public int getCountOrderFinish(Integer userId) {
        if (userId == null) {
            return 0;
        }
        return this.orderMapper.selectBuyerOrderCountByFinish(userId);
   }

   public int getCountBuyerFinish(Integer userId) {
        if (userId == null) {
            return 0;
        }
        return this.buyerBidMapper.selectBuyerBidCountByFinish(userId);
   }

    public List<OrderStateDTO> getBuyerOrderList(Integer userId, String state){
        if (state == null) {
            state = "ALL";
        }
        List<OrderStateDTO> buyerBidOrders = this.buyerBidMapper.selectBuyerBidByOrderState(userId, state);
        System.out.println(buyerBidOrders);
        List<OrderStateDTO> buyerOrders = this.orderMapper.selectBuyerOrderByState(userId, state);
        System.out.println(buyerOrders);
        if (buyerBidOrders == null || buyerOrders == null){
            return new ArrayList<>();
        }
        List<OrderStateDTO> combinedBuyerOrders = new ArrayList<>();
        combinedBuyerOrders.addAll(buyerBidOrders);
        combinedBuyerOrders.addAll(buyerOrders);

        return combinedBuyerOrders;
    }

    public Result deleteBuyerBid(Integer buyerBidId) {
        if (buyerBidId == null || buyerBidId < 1) {
            return CommonResult.FAILURE;
        }
        BuyerBidEntity buyerBid = this.buyerBidMapper.selectBuyerBidById(buyerBidId);
        if (buyerBid == null) {
            return CommonResult.FAILURE;
        } else {
            buyerBid.setDeleted(true);

        }
        return this.buyerBidMapper.updateBuyerBid(buyerBid) > 0
                ? CommonResult.SUCCESS
                : CommonResult.FAILURE;
    }

    public Result resolveRecoverPassword(UserEntity user, String newPassword) {
        if (user == null ||
                user.getEmail() == null || user.getEmail().length() < 8 || user.getEmail().length() > 50 ||
                newPassword == null || newPassword.length() < 8 || newPassword.length() > 50) {
            return CommonResult.FAILURE;
        }


        if (user.getSocialTypeCode() != null || user.getSocialId() != null) {
            return SocialResult.SOCIAL_PASSWORD_FAILURE;
        }

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        UserEntity dbUser = this.userMapper.selectUserByEmail(user.getEmail());
        if (!encoder.matches(user.getPassword(), dbUser.getPassword())) { // 임시 비번 불일치
            return LoginResult.FAILURE_DUPLICATE_PASSWORD;
        }

        dbUser.setPassword(encoder.encode(newPassword));
        dbUser.setTemporaryPassword(null);

        if (this.userMapper.updateUser(dbUser) == 0) {
            throw new TransactionalException();
        }

        return CommonResult.SUCCESS;
    }


    @Transactional
    public Result addAddress(AddressEntity address) {
        if (address == null ||
                address.getName().length() < 2 || address.getName().length() > 20 ||
                address.getDetailAddress().length() < 2 || address.getDetailAddress().length() > 50) {
            return CommonResult.FAILURE;
        }

        AddressEntity[] dbAddress = this.addressMapper.selectAddressById(address.getUserId());
        for (int i = 0; i < dbAddress.length; i++) {
            if (address.getPostal().equals(dbAddress[i].getPostal()) && address.getDetailAddress().equals(dbAddress[i].getDetailAddress())) {
                return AddressResult.FAILURE_DUPLICATE_ADDRESS;
            }

            if (address.getContact().equals(dbAddress[i].getContact())) {
                return LoginResult.FAILURE_DUPLICATE_CONTACT;
            }
        }

        address.setCreatedAt(LocalDateTime.now());
        if (this.addressMapper.insertAddress(address) == 0) {
            throw new TransactionalException();
        }

        return CommonResult.SUCCESS;
    }

    public AddressEntity[] getAddressByUserId(int userId) {
        if (userId < 1) {
            return null;
        }
        return this.addressMapper.selectAllAddress(userId);
    }

    public AccountEntity[] getAccountByUserId(int userId) {
        if (userId < 1) {
            return null;
        }
        return this.accountMapper.selectAccount(userId);
    }

    @Transactional
    public Result modify(AddressEntity address) {
        if (address == null ||
                address.getName().length() < 2 || address.getName().length() > 20 ||
                address.getDetailAddress().length() < 2 || address.getDetailAddress().length() > 50) {
            return CommonResult.FAILURE;
        }
        AddressEntity dbAddress = this.addressMapper.selectmodifyAddressById(address.getId());

        if (address.getPostal().equals(dbAddress.getPostal()) && address.getDetailAddress().equals(dbAddress.getDetailAddress())) {
            return AddressResult.FAILURE_DUPLICATE_ADDRESS;
        }

        if (address.getContact().equals(dbAddress.getContact())) {
            return LoginResult.FAILURE_DUPLICATE_CONTACT;
        }

        address.setUpdatedAt(LocalDateTime.now());
        if (this.addressMapper.modifyAddress(address) == 0) {
            throw new TransactionalException();
        }

        return CommonResult.SUCCESS;
    }

    @Transactional
    public Result modifyaccount(AccountEntity account) {
        if (account == null ||
                account.getUserId() < 1 ||
                account.getBankName() == null ||
                account.getAccountNumber().length() < 6 || account.getAccountNumber().length() > 15 ||
                account.getAccountOwner().length() < 2 || account.getAccountOwner().length() > 10) {
            return CommonResult.FAILURE;
        }
        AccountEntity dbaccount = this.accountMapper.selectAccountByUserId(account.getUserId());
        if (account.getUserId() < 1 ||
                (account.getBankName().equals(dbaccount.getBankName()) && account.getAccountNumber().equals(dbaccount.getAccountNumber()))) {
            return CommonResult.FAILURE;
        }

        account.setUpdatedAt(LocalDateTime.now());
        if (this.accountMapper.updateAccount(account) == 0) {
            throw new TransactionalException();
        }
        return CommonResult.SUCCESS;
    }

    public AddressEntity getAddressById(int id) {
        if (id < 1) {
            return null;
        }
        return this.addressMapper.selectmodifyAddressById(id);
    }

    public Result Delete(AddressEntity address) {
        if (address.getId() < 1) {
            return CommonResult.FAILURE;
        }
        AddressEntity dbaddress = this.addressMapper.deleteAddressById(address.getId());

        if (dbaddress == null || dbaddress.isDeleted()) {
            return CommonResult.FAILURE;
        }
        address.setDeleted(true);
        if (this.addressMapper.deleteAddress(address) == 0) {
            throw new TransactionalException();
        }
        return CommonResult.SUCCESS;
    }

    @Transactional
    public Result getAccount(AccountEntity account) {
        if (account == null ||
                account.getUserId() < 1 ||
                account.getBankName() == null ||
                account.getAccountNumber().length() < 6 || account.getAccountNumber().length() > 15 ||
                account.getAccountOwner().length() < 2 || account.getAccountOwner().length() > 10) {
            return CommonResult.FAILURE;
        }

        AccountEntity[] dbAccount = this.accountMapper.selectAccount(account.getUserId());

        for (int i = 0; i < dbAccount.length; i++) {
            if (account.getUserId() == dbAccount[i].getUserId()) {
                return CommonResult.FAILURE;
            }
        }
        account.setCreatedAt(LocalDateTime.now());
        if (this.accountMapper.insertAccount(account) == 0) {
            throw new TransactionalException();
        }

        return CommonResult.SUCCESS;
    }

    @Transactional
    public Result accountdelete(AccountEntity account) {
        if (account.getUserId() < 1) {
            return CommonResult.FAILURE;
        }
        AccountEntity dbaccount = this.accountMapper.selectdelete(account.getUserId());
        if (dbaccount == null || dbaccount.isDeleted()) {
            return CommonResult.FAILURE;
        }

        if (this.accountMapper.deleteAccount(account.getUserId()) == 0) {
            throw new TransactionalException();
        }
        return CommonResult.SUCCESS;
    }

    public int getSellerBidListCount(int id) {
        return this.sellerBidMapper.selectSellerBidByUserCount(id);
    }

    public SellingBidListDTO[] getSellerBidList(int id, String tab, String state) {
        return this.sellerBidMapper.selectSellerBidByUser(id, tab, state);
    }

    public CommonResult deleteSellerBid(Integer id) {
        if (id == null || id < 1) {
            return CommonResult.FAILURE;
        }
        SellerBidEntity sellerBid = this.sellerBidMapper.selectSellerBidById(id);
        if (sellerBid == null) {
            return CommonResult.FAILURE;
        } else {
            sellerBid.setDeleted(true);
        }
        return this.sellerBidMapper.updateSellerBid(sellerBid) > 0
                ? CommonResult.SUCCESS
                : CommonResult.FAILURE;
    }

    public int getSellerOrderListCount(int id) {
        return this.orderMapper.selectOrderListByUserCount(id);
    }

    public SellingOrderListDTO[] getSellerOrderList(int id, String tab, String state) {
        return this.orderMapper.selectOrderListByUser(id, tab, state);
    }

    public CommonResult patchOrderState(Integer id) {
        if (id == null || id < 1) {
            return CommonResult.FAILURE;
        }
        OrderEntity order = this.orderMapper.selectOrderById(id);
        if (order == null) {
            return CommonResult.FAILURE;
        } else {
            if (order.getSellerBidId() != null) {
                SellerBidEntity sellerBid = this.sellerBidMapper.selectSellerBidById(order.getSellerBidId());
                sellerBid.setOrderState("FAILED");
                this.sellerBidMapper.updateSellerBid(sellerBid);
            }
            order.setState("FAILED");
            this.orderMapper.updateOrder(order);
        }
        return CommonResult.SUCCESS;
    }

    public int getSellerOrderCompleteListCount(int id) {
        return this.orderMapper.selectOrderCompleteListByUserCount(id);
    }

    public SellingOrderCompleteListDTO[] getSellerOrderCompleteList(int id, String tab, String state) {
        return this.orderMapper.selectOrderCompleteListByUser(id, tab, state);
    }
}
