package com.kream.kream.services;

import com.kream.kream.entities.SellerBidEntity;
import com.kream.kream.mappers.SellerBidMapper;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class PaymentService {
    private final SellerBidMapper sellerBidMapper;

    @Value("${imp.api.key}")
    private String impKey;

    @Value("${imp.api.secret}")
    private String impSecret;

    @Autowired
    public PaymentService(SellerBidMapper sellerBidMapper) {
        this.sellerBidMapper = sellerBidMapper;
    }

    public boolean verifyPayment(String merchantUid, int sizeId, int sellerBidId) {
        SellerBidEntity sellerBid = this.sellerBidMapper.selectPriceBySizeIdAndSellerBidId(sizeId, sellerBidId);
        try {

            String accessToken = getAccessToken();
            System.out.println("Access Token: " + accessToken);
            if (accessToken == null) {
                return false;
            }

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI("https://api.iamport.kr/payments/" + merchantUid))
                    .header("Authorization",  accessToken)
                    .GET()
                    .build();

            ;
            HttpResponse<String> result = client.send(request, HttpResponse.BodyHandlers.ofString());
            JSONObject response = new JSONObject(result.body());
            System.out.println(response);

            if (response.getInt("code") == 0) {
                JSONObject responseData = response.getJSONObject("response");
                int amountPaid = responseData.getInt("amount");
                System.out.printf("Amount paid: %d\n", amountPaid);
                // 테스트용으로 고정된 금액 예시 (가맹점에서 지정한 가격과 비교 가능)

                return amountPaid == sellerBid.getPrice();
            } else {
                System.out.println("Error: " + response.getString("message"));
                return false;
            }

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    private String getAccessToken() throws Exception {
        // Get access token from Iamport API
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(new URI("https://api.iamport.kr/users/getToken"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(
                        new JSONObject()
                                .put("imp_key", impKey)
                                .put("imp_secret", impSecret)
                                .toString()))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        JSONObject jsonResponse = new JSONObject(response.body());
        return jsonResponse.getJSONObject("response").getString("access_token");
    }
}
