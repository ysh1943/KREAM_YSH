package com.kream.kream.controllers;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
public class PaymentController {

    @Value("2715783764766221")
    private String apiKey;

    @Value("COfgxTxLq9Mh0S0v03RTgXrpnMDhhQEb3d6KkvyqxcZ2xwqt4IT8z7p9eZqZpcfhxFTQbEPgplKgT9QN")
    private String apiSecret;

    private String getAccessToken() {
        String url = "https://api.iamport.kr/users/getToken";

        RestTemplate restTemplate = new RestTemplate();

        // 요청 데이터
        JSONObject request = new JSONObject();
        request.put("imp_key", apiKey);
        request.put("imp_secret", apiSecret);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>(request.toString(), headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

        // 응답에서 액세스 토큰 추출
        JSONObject responseBody = new JSONObject(response.getBody());
        return responseBody.getJSONObject("response").getString("access_token");
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verifyPayment(@RequestBody PaymentVerificationRequest request) {
        String impUid = request.getImpUid();
        String token = getAccessToken();

        String url = "https://api.iamport.kr/payments/" + impUid;

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", token);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

        // 응답에서 검증 결과 처리
        JSONObject responseBody = new JSONObject(response.getBody());
        boolean isValid = responseBody.getJSONObject("response").getString("status").equals("paid");

        if (isValid) {
            return ResponseEntity.ok("결제 검증 성공: " + impUid);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("결제 검증 실패: " + impUid);
        }
    }

    // 요청 데이터를 위한 DTO
    static class PaymentVerificationRequest {
        private String impUid;

        public String getImpUid() {
            return impUid;
        }

        public void setImpUid(String impUid) {
            this.impUid = impUid;
        }
    }
}
