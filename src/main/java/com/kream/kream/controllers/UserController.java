package com.kream.kream.controllers;

import com.kream.kream.dtos.ResultDto;
import com.kream.kream.entitys.EmailTokenEntity;
import com.kream.kream.entitys.UserEntity;
import com.kream.kream.result.CommonResult;
import com.kream.kream.result.Result;
import com.kream.kream.result.user.HandleKakaoLoginResult;
import com.kream.kream.result.user.HandleNaverLoginResult;
import com.kream.kream.services.UserService;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.json.HTTP;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.io.IOException;
import java.net.URISyntaxException;
import java.net.http.HttpRequest;

@Controller
@RequestMapping(value = "/user")
public class UserController extends AbstractGeneralController {
    private final UserService userService;

    // application.properties 또는 application.yml 파일에 정의된 카카오 클라이언트 ID를 주입받음
    @Value("${custom.property.kakao-client-id}")
    private String kakaoClientId;

    // application.properties 또는 application.yml 파일에 정의된 카카오 리다이렉트 URI를 주입받음
    @Value("${custom.property.kakao-redirect-uri}")
    private String kakaoRedirectUri;

    // application.properties 또는 application.yml 파일에 정의된 네이버 클라이언트 ID를 주입받음
    @Value("${custom.property.naver-client-id}")
    private String naverClientId;

    // application.properties 또는 application.yml 파일에 정의된 네이버 리다이렉트 URI를 주입받음
    @Value("${custom.property.naver-redirect-uri}")
    private String naverRedirectUri;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @RequestMapping(value = "/", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getIndex(@SessionAttribute(value = UserEntity.NAME_SINGULAR, required = false) UserEntity user) {
        ModelAndView modelAndView = new ModelAndView();
        if (user == null) { // 세션에 UserEntity 정보가 없을 경우
            modelAndView.setViewName("user/login"); // "user/index" 뷰를 설정
            modelAndView.addObject("kakaoClientId", this.kakaoClientId); // 카카오 클라이언트 ID를 모델에 추가
            modelAndView.addObject("kakaoRedirectUri", this.kakaoRedirectUri); // 카카오 리다이렉트 URI를 모델에 추가
            modelAndView.addObject("naverClientId", this.naverClientId); // 네이버 클라이언트 ID를 모델에 추가
            modelAndView.addObject("naverRedirectUri", this.naverRedirectUri); // 네이버 리다이렉트 URI를 모델에 추가
        } else { // 세션에 UserEntity 정보가 있는 경우
            modelAndView.setViewName("redirect:/user/my"); // "redirect:/user/my"로 리다이렉트
        }
        return modelAndView; // ModelAndView 객체 반환
    }

    // 삭제
    @RequestMapping(value = "/", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String deleteIndex(HttpSession session,
                              @SessionAttribute(value = UserEntity.NAME_SINGULAR, required = false) UserEntity user) throws URISyntaxException, IOException, InterruptedException {
        // UserService를 사용해 현재 세션 사용자(user)의 계정을 삭제하는 로직 실행
        Result result = this.userService.deleteUser(user);

        // 삭제가 성공적으로 이루어진 경우 세션에서 사용자 정보를 제거
        if (result == CommonResult.SUCCESS) {
            session.setAttribute(UserEntity.NAME_SINGULAR, null);
        }

        // 삭제 결과를 REST 응답 형식(JSON)으로 변환하여 반환
        return this.generateRestResponse(result).toString();
    }

    // 마이 페이지
    @RequestMapping(value = "/my", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getMy(@SessionAttribute(value = UserEntity.NAME_SINGULAR, required = false) UserEntity user) {
        ModelAndView modelAndView = new ModelAndView();
        if (user == null) {
            modelAndView.setViewName("redirect:/user/");
        } else {
            modelAndView.setViewName("user/my");
        }
        return modelAndView;
    }

    @RequestMapping(value = "/login/kakao", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getLoginKakao(HttpSession session,
                                      @RequestParam(value = "code", required = false) String code) throws URISyntaxException, IOException, InterruptedException {
        ResultDto<Result, UserEntity> result = this.userService.handleKakaoLogin(code);
        ModelAndView modelAndView = new ModelAndView();
        if (result.getResult() == HandleKakaoLoginResult.FAILURE_NOT_REGISTERED) {
            modelAndView.addObject("socialTypeCode", result.getPayload().getSocialTypeCode());
            modelAndView.addObject("socialId", result.getPayload().getSocialId());
            modelAndView.addObject("isSocialRegister", true);
            modelAndView.setViewName("user/join");
        } else if (result.getResult() == CommonResult.SUCCESS) {
            session.setAttribute(UserEntity.NAME_SINGULAR, result.getPayload());
            modelAndView.setViewName("redirect:/user/my");
        } else {
            modelAndView.setViewName("redirect:https://kauth.kakao.com/oauth/authorize?response_type");
        }
        return modelAndView;
    }

    @RequestMapping(value = "/login/naver", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getLoginNaver(HttpSession session,
                                      @RequestParam(value = "code", required = false) String code) throws URISyntaxException, IOException, InterruptedException {
        System.out.println("실행은 되었어요~");
        // UserService를 사용해 네이버 로그인 처리 로직을 수행
        // 네이버 OAuth에서 전달받은 인증 코드("code")를 사용
        ResultDto<Result, UserEntity> result = this.userService.handleNaverLogin(code);
        System.out.println(result);
        // 응답 데이터를 담을 ModelAndView 객체 생성
        ModelAndView modelAndView = new ModelAndView();

        // 처리 결과가 '사용자 미등록'인 경우
        if (result.getResult() == HandleNaverLoginResult.FAILURE_NOT_REGISTERED) {
            // 소셜 등록 플래그와 네이버 소셜 정보 추가
            modelAndView.addObject("socialTypeCode", result.getPayload().getSocialTypeCode()); // 소셜 타입 코드
            modelAndView.addObject("socialId", result.getPayload().getSocialId()); // 소셜 사용자 ID
            modelAndView.addObject("isSocialRegister", true); // 소셜 회원가입 플래그
            modelAndView.setViewName("user/join"); // 다시 "user/login" 뷰로 이동
            System.out.println("이건 소셜 타입 코드 :" + result.getPayload().getSocialTypeCode());
            System.out.println("이건 소셜 아이디 :" + result.getPayload().getSocialId());

            // 처리 결과가 '성공'인 경우
        } else if (result.getResult() == CommonResult.SUCCESS) {
            session.setAttribute(UserEntity.NAME_SINGULAR, result.getPayload()); // 사용자 정보를 세션에 저장
            modelAndView.setViewName("redirect:/user/my"); // 사용자의 마이페이지로 리다이렉트

            // 그 외 실패 처리
        } else {
            // 네이버 인증 URL로 리다이렉트
            modelAndView.setViewName("redirect:https://kauth.naver.com/oauth/authorize?response_type");
        }

        // ModelAndView 객체 반환
        return modelAndView;
    }

    @RequestMapping(value = "/join", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public ModelAndView getJoin() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("/user/join");
        return modelAndView;
    }

    @RequestMapping(value = "/join", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postJoin(UserEntity user, HttpServletRequest request) throws MessagingException {
        CommonResult result = this.userService.register(request, user);
        JSONObject response = new JSONObject();
        response.put("result", result.name().toLowerCase());
        return response.toString();
    }

    @RequestMapping(value = "/login", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getLogin(HttpSession session, UserEntity user)  {
        Result result = this.userService.login(user);
        if (result == CommonResult.SUCCESS) {
            session.setAttribute("user", user); // 로그인 성공 시 세션에 사용자 정보를 저장
        }
        JSONObject response = new JSONObject();
        response.put(Result.NAME, result.nameToLower());
        return response.toString();
    }

    @RequestMapping(value = "logout", method = RequestMethod.GET)
    public ModelAndView logout(HttpSession session) {
        session.setAttribute(UserEntity.NAME_SINGULAR, null);
        return new ModelAndView("redirect:/user/");
    }

    @RequestMapping(value = "/validate-email-token", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getValidateEmailToken(EmailTokenEntity emailToken) {
        Result result = this.userService.validateEmailToken(emailToken);
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject(Result.NAME, result.nameToLower());
        modelAndView.setViewName("user/validateEmailToken");
        return modelAndView;
    }
}
