package com.ssafy.hangbokdog.fcm.application;

import java.io.IOException;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpHeaders;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.auth.oauth2.GoogleCredentials;
import com.ssafy.hangbokdog.fcm.dto.FcmMessage;
import com.ssafy.hangbokdog.member.domain.repository.MemberRepository;

import lombok.RequiredArgsConstructor;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

@Service
@RequiredArgsConstructor
public class FcmService {

	private static final Logger log = LoggerFactory.getLogger(FcmService.class);

	@Value("${fcm.token.uri}")
	private String apiUrl;
	private final String mediaType = "application/json; charset=utf-8";
	@Value("${fcm.config.path}")
	private String firebasePath;
	private final ObjectMapper objectMapper;

	private final MemberRepository memberRepository;

	@Async("fcmExecutor")
	public void sendMessageTo(String targetToken, String title, String body) {
		try {
			log.info("[FCM] 메시지 생성 중: targetToken={}, title={}, body={}", targetToken, title, body);
			String message = makeMessage(targetToken, title, body);

			log.info("[FCM] AccessToken 요청 중...");
			String accessToken = getAccessToken();

			log.info("[FCM] 메시지 전송 시작: URL={}, accessToken={}", apiUrl, accessToken.substring(0, 20) + "...");

			OkHttpClient client = new OkHttpClient();
			RequestBody requestBody = RequestBody.create(message, MediaType.get(mediaType));
			Request request = new Request.Builder()
					.url(apiUrl)
					.post(requestBody)
					.addHeader(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
					.addHeader(HttpHeaders.CONTENT_TYPE, mediaType)
					.build();

			try (Response response = client.newCall(request).execute()) {
				String responseBody = response.body().string();
				log.info("[FCM] 메시지 전송 완료: 응답코드={}, 응답바디={}", response.code(), responseBody);
			}
		} catch (IOException e) {
			log.error("[FCM] 메시지 전송 실패", e);
			throw new RuntimeException("Failed to send message", e);
		}
	}

	private String makeMessage(String targetToken, String title, String body) throws JsonProcessingException {
		FcmMessage fcmMessage = FcmMessage.builder()
				.message(FcmMessage.Message.builder()
						.token(targetToken)
						.notification(FcmMessage.Notification.builder()
								.title(title)
								.body(body)
								.image(null)
								.build()
						).build()).validateOnly(false).build();

		String json = objectMapper.writeValueAsString(fcmMessage);
		log.debug("[FCM] 생성된 JSON 메시지: {}", json);
		return json;
	}

	private String getAccessToken() throws IOException {
		String firebaseConfigPath = firebasePath;
		log.debug("[FCM] firebasePath={}", firebaseConfigPath);

		GoogleCredentials googleCredentials = GoogleCredentials
				.fromStream(new ClassPathResource(firebaseConfigPath).getInputStream())
				.createScoped(List.of("https://www.googleapis.com/auth/cloud-platform"));

		googleCredentials.refreshIfExpired();
		String token = googleCredentials.getAccessToken().getTokenValue();
		log.debug("[FCM] AccessToken 획득 완료");
		return token;
	}
}
