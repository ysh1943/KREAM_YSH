package com.kream.kream.services;

import com.kream.kream.dtos.ResultDto;
import com.kream.kream.entities.EmailTokenEntity;
import com.kream.kream.entities.UserEntity;
import com.kream.kream.exceptions.TransactionalException;
import com.kream.kream.mappers.EmailTokenMapper;
import com.kream.kream.mappers.UserMapper;
import com.kream.kream.regexes.UserRegex;
import com.kream.kream.results.CommonResult;
import com.kream.kream.results.LoginResult;
import com.kream.kream.results.Result;
import com.kream.kream.results.enums.SocialTypes;
import com.kream.kream.results.user.HandleKakaoLoginResult;
import com.kream.kream.results.user.HandleNaverLoginResult;
import com.kream.kream.results.user.ValidationEmailTokenResult;
import com.kream.kream.secureRandom.PasswordUtil;
import com.kream.kream.utils.CryptoUtils;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.HttpServletRequest;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDateTime;

@Service
public class UserService {
    private final UserMapper userMapper;
    private final EmailTokenMapper emailTokenMapper;
    private final SpringTemplateEngine templateEngine;
    private final JavaMailSender mailSender;

    @Value("${custom.property.kakao-client-id}")
    private String kakaoClientId;
    @Value("${custom.property.naver-client-id}")
    private String naverClientId;
    @Value("${custom.property.naver-client-secret}")
    private String naverClientSecret;

    @Autowired
    public UserService(UserMapper userMapper, EmailTokenMapper emailTokenMapper, SpringTemplateEngine templateEngine, JavaMailSender mailSender) {
        this.userMapper = userMapper;
        this.emailTokenMapper = emailTokenMapper;
        this.templateEngine = templateEngine;
        this.mailSender = mailSender;
    }

    // 삭제 로직
    @Transactional
    public Result deleteUser(UserEntity user) throws URISyntaxException, IOException, InterruptedException {
        if (user == null || !UserRegex.checkEmail(user.getEmail())) {
            return CommonResult.FAILURE;
        }
        if (this.userMapper.deleteUserByEmail(user.getEmail()) == 0) {
            return CommonResult.FAILURE;
        }
        if (SocialTypes.KAKAO.getCode().equals(user.getSocialTypeCode())) {
            HttpClient client = HttpClient.newBuilder().build();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI("https://kapi.kakao.com/v1/user/unlink"))
                    .setHeader("Authorization", String.format("Bearer %s", user.getPassword()))
                    .POST(HttpRequest.BodyPublishers.noBody())
                    .build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            System.out.println(response.body());
            if (response.statusCode() < 200 || response.statusCode() >= 400) {
                throw new RuntimeException();
            }
        } else if (SocialTypes.NAVER.getCode().equals(user.getSocialTypeCode())) {
            HttpClient client = HttpClient.newBuilder().build();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI(String.format("https://nid.naver.com/oauth2.0/token?grant_type=delete&client_id=%s&client_secret=%s&access_token=%s",
                            this.naverClientId,
                            this.naverClientSecret,
                            user.getPassword())))
                    .POST(HttpRequest.BodyPublishers.noBody())
                    .build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 400) {
                throw new RuntimeException();
            }
        }
        return CommonResult.SUCCESS;
    }

    // 카카오 핸들러
    public ResultDto<Result, UserEntity> handleKakaoLogin(String code) throws URISyntaxException, IOException, InterruptedException {
        if (code == null) {
            return ResultDto.<Result, UserEntity>builder().result(CommonResult.FAILURE).build();
        }
        HttpClient client = HttpClient.newBuilder().build();
        URI uri = new URI(String.format("https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=%s&code=%s", this.kakaoClientId, code));
        HttpRequest request = HttpRequest.newBuilder()
                .uri(uri)
                .setHeader("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.noBody())
                .build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() < 200 || response.statusCode() >= 400) {
            return ResultDto.<Result, UserEntity>builder().result(CommonResult.FAILURE).build();
        }
        JSONObject responseObject;
        try {
            responseObject = new JSONObject(response.body());
        } catch (JSONException ignored) {
            return ResultDto.<Result, UserEntity>builder().result(CommonResult.FAILURE).build();
        }
        if (!responseObject.has("access_token")) {
            return ResultDto.<Result, UserEntity>builder().result(CommonResult.FAILURE).build();
        }
        String accessToken = responseObject.getString("access_token");

        uri = new URI("https://kapi.kakao.com/v2/user/me");
        request = HttpRequest.newBuilder()
                .uri(uri)
                .setHeader("Authorization", String.format("Bearer %s", accessToken))
                .setHeader("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.noBody())
                .build();
        response = client.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() < 200 || response.statusCode() >= 400) {
            return ResultDto.<Result, UserEntity>builder().result(CommonResult.FAILURE).build();
        }
        try {
            responseObject = new JSONObject(response.body());
        } catch (JSONException ignored) {
            return ResultDto.<Result, UserEntity>builder().result(CommonResult.FAILURE).build();
        }
        if (!responseObject.has("id")) {
            return ResultDto.<Result, UserEntity>builder().result(CommonResult.FAILURE).build();
        }
        String id = String.valueOf(responseObject.getLong("id"));
        UserEntity user = this.userMapper.selectUserBySocialTypeCodeAndSocialId(SocialTypes.KAKAO.getCode(), id);
        if (user == null) {
            return ResultDto.<Result, UserEntity>builder()
                    .result(HandleKakaoLoginResult.FAILURE_NOT_REGISTERED)
                    .payload(UserEntity.builder()
                            .socialTypeCode(SocialTypes.KAKAO.getCode())
                            .socialId(id)
                            .build())
                    .build();
        }
        user.setPassword(accessToken);
        return ResultDto.<Result, UserEntity>builder()
                .result(CommonResult.SUCCESS)
                .payload(user)
                .build();
    }

    // 네이버 핸들러
    public ResultDto<Result, UserEntity> handleNaverLogin(String code) throws URISyntaxException, IOException, InterruptedException {
        // 네이버 로그인 인증 코드가 없으면 실패 결과 반환
        if (code == null) {
            return ResultDto.<Result, UserEntity>builder().result(CommonResult.FAILURE).build();
        }

        // HttpClient 생성 및 네이버 토큰 발급 요청 URI 구성
        HttpClient client = HttpClient.newBuilder().build();
        URI uri = new URI(String.format("https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&state=study&client_id=%s&client_secret=%s&code=%s",
                this.naverClientId, this.naverClientSecret, code));

        // 네이버 토큰 발급 요청 생성 (POST 요청)
        HttpRequest request = HttpRequest.newBuilder()
                .uri(uri)
                .POST(HttpRequest.BodyPublishers.noBody())
                .build();

        // 요청을 보내고 응답 수신
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        // 응답 상태 코드가 2xx가 아니면 실패 결과 반환
        if (response.statusCode() < 200 || response.statusCode() >= 400) {
            return ResultDto.<Result, UserEntity>builder().result(CommonResult.FAILURE).build();
        }

        // 응답 바디를 JSON 객체로 변환
        JSONObject responseObject;
        try {
            responseObject = new JSONObject(response.body());
        } catch (JSONException ignored) {
            // JSON 변환 실패 시 실패 결과 반환
            return ResultDto.<Result, UserEntity>builder().result(CommonResult.FAILURE).build();
        }

        // 응답 데이터에 액세스 토큰이 없으면 실패 결과 반환
        if (!responseObject.has("access_token")) {
            return ResultDto.<Result, UserEntity>builder().result(CommonResult.FAILURE).build();
        }

        // 액세스 토큰 추출
        String accessToken = responseObject.getString("access_token");

        // 네이버 사용자 정보 요청 URI 구성
        uri = new URI("https://openapi.naver.com/v1/nid/me");

        // 네이버 사용자 정보 요청 생성 (POST 요청)
        request = HttpRequest.newBuilder()
                .uri(uri)
                .setHeader("Authorization", String.format("Bearer %s", accessToken))
                .POST(HttpRequest.BodyPublishers.noBody())
                .build();

        // 요청을 보내고 응답 수신
        response = client.send(request, HttpResponse.BodyHandlers.ofString());

        // 응답 상태 코드가 2xx가 아니면 실패 결과 반환
        if (response.statusCode() < 200 || response.statusCode() >= 400) {
            return ResultDto.<Result, UserEntity>builder().result(CommonResult.FAILURE).build();
        }

        // 응답 바디를 JSON 객체로 변환
        try {
            responseObject = new JSONObject(response.body());
        } catch (JSONException ignored) {
            // JSON 변환 실패 시 실패 결과 반환
            return ResultDto.<Result, UserEntity>builder().result(CommonResult.FAILURE).build();
        }

        // 네이버 사용자 ID 추출
        String id = responseObject.getJSONObject("response").getString("id");

        // 소셜 타입과 소셜 ID를 기반으로 사용자 조회
        UserEntity user = this.userMapper.selectUserBySocialTypeCodeAndSocialId(SocialTypes.NAVER.getCode(), id);

        // 사용자가 존재하지 않으면 미등록 사용자 처리 결과 반환
        if (user == null) {
            return ResultDto.<Result, UserEntity>builder()
                    .result(HandleNaverLoginResult.FAILURE_NOT_REGISTERED)
                    .payload(UserEntity.builder()
                            .socialTypeCode(SocialTypes.NAVER.getCode()) // 소셜 타입 코드 설정
                            .socialId(id) // 네이버 사용자 ID 설정
                            .build())
                    .build();
        }

//        if(!user.isVerified()){
//            return ResultDto.<Result, UserEntity>builder()
//                    .result(LoginResult.FAILURE_NOT_VERIFIED)
//                    .build();
//        }


        // 사용자 객체에 액세스 토큰 저장 (비밀번호 필드에 저장)
        user.setPassword(accessToken);

        // 성공적으로 처리된 결과 반환
        return ResultDto.<Result, UserEntity>builder()
                .result(CommonResult.SUCCESS)
                .payload(user)
                .build();
    }

    public Result login(UserEntity user)   {
        if (user == null ||
                user.getEmail() == null || user.getEmail().length() < 8 || user.getEmail().length() > 50 ||
                user.getPassword() == null || user.getPassword().length() < 6 || user.getPassword().length() > 50) {
            return CommonResult.FAILURE; // 실패 상태 반환
        }
        UserEntity dbUser = this.userMapper.selectUserByEmail(user.getEmail());
        if (dbUser == null || dbUser.getDeletedAt() != null) {
            return CommonResult.FAILURE;
        }

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        if (!encoder.matches(user.getPassword(), dbUser.getPassword())) {
            return CommonResult.FAILURE; // 비밀번호 불일치로 실패 반환
        }

        if (!dbUser.isVerified()) {
            return LoginResult.FAILURE_NOT_VERIFIED;
        }

        if (dbUser.isSuspended()) {
            return LoginResult.FAILURE_SUSPENDED;
        }

        if (dbUser.getTemporaryPassword() != null && dbUser.getTemporaryPassword().isBefore(LocalDateTime.now())) {
            return CommonResult.EXPIRED_PASSWORD;
        }

        user.setId(dbUser.getId());
        user.setPassword(dbUser.getPassword());
        user.setNickname(dbUser.getNickname());
        user.setContact(dbUser.getContact());
        user.setCreatedAt(dbUser.getCreatedAt());
        user.setAdmin(dbUser.isAdmin());
        user.setSuspended(dbUser.isSuspended());
        user.setVerified(dbUser.isVerified());
        user.setTemporaryPassword(dbUser.getTemporaryPassword());
        return CommonResult.SUCCESS;
    }

    @Transactional
    public Result register(HttpServletRequest request, UserEntity user) throws MessagingException {
        if (user == null ||
                !UserRegex.checkEmail(user.getEmail()) ||
                !UserRegex.checkNickname(user.getNickname()) || user.getContact() == null) {
            return CommonResult.FAILURE;
        }
        boolean isSocialRegister = user.getSocialTypeCode() != null && user.getSocialId() != null;
        if (isSocialRegister) {
            if (user.getSocialTypeCode().isEmpty() || user.getSocialId().isEmpty() || SocialTypes.parse(user.getSocialTypeCode()).isEmpty()) {
                return CommonResult.FAILURE;
            }
            if (this.userMapper.selectUserBySocialTypeCodeAndSocialId(user.getSocialTypeCode(), user.getSocialId()) != null) {
                return CommonResult.FAILURE;
            }
            user.setPassword("");
            user.setVerified(true);

            if (this.userMapper.selectUserByEmail(user.getEmail()) != null) {
                return LoginResult.FAILURE_DUPLICATE_EMAIL; // 이메일 중복
            }
            if (this.userMapper.selectUserByContact(user.getContact()) != null) {
                return LoginResult.FAILURE_DUPLICATE_CONTACT; // 연락처 중복
            }
            if (this.userMapper.selectUserByNickname(user.getNickname()) != null) {
                return LoginResult.FAILURE_DUPLICATE_NICKNAME; // 닉네임 중복
            }
            user.setCreatedAt(LocalDateTime.now());

            // 4. 사용자 정보 데이터베이스에 삽입
            if (this.userMapper.insertUser(user) == 0) {
                throw new TransactionalException();
            }
            return LoginResult.SOCIAL_SUCCESS;


        } else {
            if (!UserRegex.checkPassword(user.getPassword())) {
                return CommonResult.FAILURE;
            }
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            user.setPassword(encoder.encode(user.getPassword()));
        }
        if (this.userMapper.selectUserByEmail(user.getEmail()) != null) {
            return LoginResult.FAILURE_DUPLICATE_EMAIL; // 이메일 중복
        }
        if (this.userMapper.selectUserByContact(user.getContact()) != null) {
            return LoginResult.FAILURE_DUPLICATE_CONTACT; // 연락처 중복
        }
        if (this.userMapper.selectUserByNickname(user.getNickname()) != null) {
            return LoginResult.FAILURE_DUPLICATE_NICKNAME; // 닉네임 중복
        }
        user.setCreatedAt(LocalDateTime.now());

        // 4. 사용자 정보 데이터베이스에 삽입
        if (this.userMapper.insertUser(user) == 0) {
            throw new TransactionalException();
        }

        EmailTokenEntity emailToken = new EmailTokenEntity();
        if (user.getSocialId() == null || user.getSocialTypeCode() == null) {
            emailToken.setUserEmail(user.getEmail()); // 생성한 사용자 이메일 연결
            emailToken.setKey(CryptoUtils.hashSha512(String.format("%s%s%f%f",
                    user.getEmail(),
                    user.getPassword(),
                    Math.random(),
                    Math.random()))); // 고유 키 생성 및 암호화
            emailToken.setCreatedAt(LocalDateTime.now()); // 토큰 생성 시간 설정
            emailToken.setExpiresAt(LocalDateTime.now().plusHours(24)); // 24시간 유효 기간 설정
            emailToken.setUsed(false); // 토큰 초기화: 사용되지 않은 상태로 설정


            // 6. 이메일 토큰 데이터베이스에 삽입
            if (this.emailTokenMapper.insertEmailToken(emailToken) == 0) {
                throw new TransactionalException(); // 삽입 실패 시 트랜잭션 롤백
            }
            String validationLink = String.format("%s://%s:%d/validate-email-token?userEmail=%s&key=%s",
                    request.getScheme(),
                    request.getServerName(),
                    request.getServerPort(),
                    emailToken.getUserEmail(),
                    emailToken.getKey());
            Context context = new Context();
            context.setVariable("validationLink", validationLink);
            String mailText = this.templateEngine.process("email/register", context);

            MimeMessage mimeMessage = this.mailSender.createMimeMessage(); // MimeMessage 객체 생성
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage); // 메시지 헬퍼 객체 생성
            mimeMessageHelper.setFrom("yangsehun1943@gmail.com"); // 발신자 이메일 설정
            mimeMessageHelper.setTo(emailToken.getUserEmail()); // 수신자 이메일 설정
            mimeMessageHelper.setSubject("[Kream] 회원가입 인증 링크"); // 이메일 제목 설정
            mimeMessageHelper.setText(mailText, true); // 이메일 본문 설정 (HTML 형식으로 처리)
            this.mailSender.send(mimeMessage);
        }

        return CommonResult.SUCCESS;
    }

    public Result validateEmailToken(EmailTokenEntity emailToken) {
        if (emailToken == null ||
                emailToken.getUserEmail() == null || emailToken.getUserEmail().length() < 8 || emailToken.getUserEmail().length() > 50 ||
                emailToken.getKey() == null || emailToken.getKey().length() != 128) {
            return CommonResult.FAILURE;
        }

        EmailTokenEntity dbemailToken = this.emailTokenMapper.selectEmailTokenByUserEmailTokenKey(emailToken.getUserEmail(), emailToken.getKey());
        if (dbemailToken == null || dbemailToken.isUsed()) { // db에 존재하지 않거나 이미 사용된 토큰이면
            return CommonResult.FAILURE;
        }

        if (dbemailToken.getExpiresAt().isBefore(LocalDateTime.now())) { // 이메일 토큰의 만료 일시가 현재 일시보다 과거(isBefore)면,
            return ValidationEmailTokenResult.FAILURE_EXPIRED;
        }
        dbemailToken.setUsed(true); // 토큰을 사용된 것으로 처리 ( 인증은 한 번만 가능함)
        if (this.emailTokenMapper.updateEmailToken(dbemailToken) == 0) {
            throw new TransactionalException();
        }
        UserEntity user = this.userMapper.selectUserByEmail(emailToken.getUserEmail()); // 사용자 가져오기
        user.setVerified(true); // 사용자에 대해 인증처리 된 것으로 수정

        if (this.userMapper.updateUser(user) == 0) {
            throw new TransactionalException();
        }

        return CommonResult.SUCCESS;
    }

    public Result recoverEmail(UserEntity user) {
        if (user == null ||
                user.getContact() == null || user.getContact().length() != 11) {
            return CommonResult.FAILURE;
        }

        UserEntity dbUser = this.userMapper.selectUserByContact(user.getContact());
        if (dbUser == null || dbUser.getDeletedAt() != null) {
            return CommonResult.FAILURE;
        }

        user.setEmail(dbUser.getEmail());
        return CommonResult.SUCCESS;
    }

    @Transactional
    public Result provokeRecoverPassword(HttpServletRequest request, String email, String contact) throws MessagingException {
        if (email == null || email.length() < 8 || email.length() >= 50 ||
                contact == null || contact.length() != 11) {
            return CommonResult.FAILURE;
        }

        UserEntity user = this.userMapper.selectUserByEmail(email);
        if (user == null || user.getDeletedAt() != null) { // 유저가 없거나 탈퇴한 유저인 경우
            return CommonResult.FAILURE; // 실패 상태 반환
        }

        // 임시 비밀번호 생성
        String tempPassword = PasswordUtil.generateTemporaryPassword(12);
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        System.out.println("임시 비밀번호: " + tempPassword);

        LocalDateTime expiryTime = LocalDateTime.now().plusHours(1);
        user.setTemporaryPassword(expiryTime);

        // 이메일 메시지 구성
        MimeMessage mimeMessage = this.mailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage);
        mimeMessageHelper.setFrom("yangsehun1943@gmail.com"); // 발신자 이메일 설정
        mimeMessageHelper.setTo(user.getEmail()); // 수신자 이메일 설정
        mimeMessageHelper.setSubject("KreamProject 임시 비밀번호"); // 이메일 제목 설정
        mimeMessageHelper.setText("임시 비밀번호는 다음과 같습니다:\n" + tempPassword + "\n로그인 후 반드시 비밀번호를 변경해 주세요. 임시 비밀번호는 " + expiryTime + "까지 유효합니다."); // 본문을 HTML 형식으로 설정
        this.mailSender.send(mimeMessage); // 이메일 전송

        // 임시 비번 hash
        String hashedPassword = encoder.encode(tempPassword);
        user.setPassword(hashedPassword);

        if (this.userMapper.updateUser(user) == 0) {
            throw new TransactionalException();
        }

        return CommonResult.SUCCESS;
    }

}
