package com.kream.kream.controllers;

import com.kream.kream.dtos.SearchKeywordDTO;
import com.kream.kream.entities.PopularKeywordEntity;
import com.kream.kream.entities.UserEntity;
import com.kream.kream.repositories.PopularKeywordsRepo;
import com.kream.kream.repositories.UserRecentKeywordsRepo;
import com.kream.kream.results.CommonResult;
import com.kream.kream.services.SearchService;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;


import java.util.ArrayList;
import java.util.List;


@Slf4j
@Controller
@RequestMapping(value = "/")
public class SearchController {
    public final SearchService searchService;
    public final UserRecentKeywordsRepo userRecentKeywordsRepo;
    public final PopularKeywordsRepo popularKeywordsRepo;

    @Autowired
    public SearchController(SearchService searchService, UserRecentKeywordsRepo userRecentKeywordsRepo, PopularKeywordsRepo popularKeywordsRepo) {
        this.searchService = searchService;
        this.userRecentKeywordsRepo = userRecentKeywordsRepo;
        this.popularKeywordsRepo = popularKeywordsRepo;

    }

    @RequestMapping(value = "/search", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getSearch() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("home/search");

        return modelAndView;
    }

    //region 검색 리스트
    @RequestMapping(value = "/search-list", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getSearchList(@RequestParam(value = "keyword", required = false) String keyword) {
        List<SearchKeywordDTO> result = this.searchService.SearchKeyword(keyword);
        JSONArray response = new JSONArray();
        int count = 0;
        for (SearchKeywordDTO searchKeywordDTO : result) {
            JSONObject searchKeyword = new JSONObject();
            searchKeyword.put("productId", searchKeywordDTO.getProductId());
            searchKeyword.put("productNameKo", searchKeywordDTO.getProductNameKo());
            searchKeyword.put("productNameEn", searchKeywordDTO.getProductNameEn());
            searchKeyword.put("brand", searchKeywordDTO.getBrand());
            response.put(searchKeyword);
            count++;
            if (count == 10) {
                break;
            }
        }
        return response.toString();
    }
    //endregion

    //region 최신 검색
    @RequestMapping(value = "/recent-keyword", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getRecentKeyword(@SessionAttribute(value = "user", required = false) UserEntity user) {
        List<String> recentKeywords = this.searchService.getRecentKeywords(user);
        JSONArray response = new JSONArray();
        for (String keyword : recentKeywords) {
            JSONObject keywordResponse = new JSONObject();
            keywordResponse.put("keyword", keyword);
            response.put(keywordResponse);
        }
        return response.toString();
    }

    @RequestMapping(value = "/recent-keyword", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postRecentKeyword(@SessionAttribute(value = "user", required = false) UserEntity user,
                                    @RequestParam(value = "keyword", required = false) String keyword) {
        CommonResult result = this.searchService.postRecentKeywords(user, keyword);
        JSONObject response = new JSONObject();
        response.put("result", result.name().toLowerCase());

        return response.toString();
    }

    @RequestMapping(value = "/recent-keyword", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String deleteRecentKeyword(@SessionAttribute(value = "user", required = false) UserEntity user) {
        CommonResult result = this.searchService.deleteRecentKeywords(user);
        JSONObject response = new JSONObject();
        response.put("result", result.name().toLowerCase());

        return response.toString();
    }
    //endregion

    //region 인기 검색
    @RequestMapping(value = "/popular-keyword", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getPopularKeyword() {
        Iterable<PopularKeywordEntity> popularKeywords = this.popularKeywordsRepo
                .findAll();
        List<PopularKeywordEntity> popularKeywordList = new ArrayList<>();

        for (PopularKeywordEntity popularKeyword : popularKeywords) {
            if (popularKeyword != null) {
                popularKeywordList.add(popularKeyword);
            }
        }

        popularKeywordList.sort((k1, k2) -> {
            if (k1 == null || k2 == null) {
                return 0;
            }
            return Integer.compare(k2.getCount(), k1.getCount());
        });

        List<PopularKeywordEntity> top20PopularKeywords = popularKeywordList.stream()
                .limit(20)
                .toList();

        JSONArray response = new JSONArray();
        for (PopularKeywordEntity popularKeyword : top20PopularKeywords) {
            JSONObject keywordResponse = new JSONObject();
            keywordResponse.put("keyword", popularKeyword.getKeyword());
            response.put(keywordResponse);
        }
        return response.toString();
    }

    @RequestMapping(value = "/popular-keyword", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postPopularKeyword(@RequestParam(value = "keyword", required = false) String keyword) {
        if (keyword == null || keyword.isEmpty() || keyword.length() > 100) {
            keyword = "";
        }
        PopularKeywordEntity popularKeyword = this.popularKeywordsRepo
                .findById(keyword)
                .orElse(new PopularKeywordEntity(keyword, 0));
        popularKeyword.setCount(popularKeyword.getCount() + 1);
        this.popularKeywordsRepo.save(popularKeyword);


        return "{\"result\":\"success\"}";
    }
    //endregion
}



