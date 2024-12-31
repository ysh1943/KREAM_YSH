package com.kream.kream.services;

import com.kream.kream.dtos.SearchKeywordDTO;
import com.kream.kream.entities.RecentKeywordEntity;
import com.kream.kream.entities.UserEntity;
import com.kream.kream.mappers.SearchMapper;
import com.kream.kream.repositories.UserRecentKeywordsRepo;
import com.kream.kream.results.CommonResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SearchService {
    public final SearchMapper searchMapper;
    public final UserRecentKeywordsRepo userRecentKeywordsRepo;

    @Autowired
    public SearchService(SearchMapper searchMapper, UserRecentKeywordsRepo userRecentKeywordsRepo) {
        this.searchMapper = searchMapper;
        this.userRecentKeywordsRepo = userRecentKeywordsRepo;
    }

    //검색 리스트
    public List<SearchKeywordDTO> SearchKeyword(String keyword) {
        if (keyword == null || keyword.length() > 100) {
            keyword = "";
        }
        List<SearchKeywordDTO> searchKeywords = this.searchMapper.selectKeywordBySearch(keyword);
        if (searchKeywords == null || searchKeywords.isEmpty()) {
            return new ArrayList<>();
        }
        return searchKeywords;
    }

    //최신 검색 GET
    public List<String> getRecentKeywords(UserEntity user) {
        if (user == null || user.isSuspended() || !user.isVerified() || user.getDeletedAt() != null) {
            return new ArrayList<>();
        }
        RecentKeywordEntity recentKeyword = this.userRecentKeywordsRepo
                .findById(user.getEmail())
                .orElse(RecentKeywordEntity.builder().build());
        List<String> recentKeywords = recentKeyword.getKeywords();
        if (recentKeywords == null) {
            recentKeywords = new ArrayList<>();
        }
        return recentKeywords;
    }

    //최신 검색 POST
    public CommonResult postRecentKeywords(UserEntity user, String keyword) {
        if (user == null) {
            return CommonResult.FAILURE_UNSIGNED;
        }
        if (user.isSuspended() || !user.isVerified() || user.getDeletedAt() != null) {
            return CommonResult.FAILURE;
        }
        if (keyword == null || keyword.isEmpty() || keyword.length() > 100) {
            keyword = "";
        }
        RecentKeywordEntity recentKeyword = this.userRecentKeywordsRepo
                .findById(user.getEmail())
                .orElse(RecentKeywordEntity.builder().email(user.getEmail()).build());
        List<String> recentKeywords = recentKeyword.getKeywords();
        if (recentKeywords == null) {
            recentKeywords = new ArrayList<>();
        }
        recentKeywords.add(keyword);
        recentKeyword.setKeywords(recentKeywords);
        this.userRecentKeywordsRepo.save(recentKeyword);
        return CommonResult.SUCCESS;
    }

    //최신 검색 DELETE
    public CommonResult deleteRecentKeywords(UserEntity user) {
        if (user == null || user.isSuspended() || !user.isVerified() || user.getDeletedAt() != null) {
            return CommonResult.FAILURE_UNSIGNED;
        }
        RecentKeywordEntity recentKeyword = this.userRecentKeywordsRepo
                .findById(user.getEmail())
                .orElse(RecentKeywordEntity.builder().build());
        if (recentKeyword.getKeywords() == null) {
            return CommonResult.FAILURE;
        }
        this.userRecentKeywordsRepo.delete(recentKeyword);
        return CommonResult.SUCCESS;
    }
}
