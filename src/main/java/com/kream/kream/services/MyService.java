package com.kream.kream.services;

import com.kream.kream.entities.AccountEntity;
import com.kream.kream.entities.AddressEntity;
import com.kream.kream.entities.UserEntity;
import com.kream.kream.exceptions.TransactionalException;
import com.kream.kream.mappers.AccountMapper;
import com.kream.kream.mappers.AddressMapper;
import com.kream.kream.mappers.UserMapper;
import com.kream.kream.results.AddressResult;
import com.kream.kream.results.CommonResult;
import com.kream.kream.results.LoginResult;
import com.kream.kream.results.Result;
import com.kream.kream.results.user.SocialResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Objects;

@Service
public class MyService {
    private final UserMapper userMapper;
    private final AddressMapper addressMapper;
    private final AccountMapper accountMapper;

    @Autowired
    public MyService(UserMapper userMapper, AddressMapper addressMapper, AccountMapper accountMapper) {
        this.userMapper = userMapper;
        this.addressMapper = addressMapper;
        this.accountMapper = accountMapper;
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


}
