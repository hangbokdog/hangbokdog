package com.ssafy.hangbokdog.fcm.application;

import java.io.IOException;
import java.util.List;

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
			String message = makeMessage(targetToken, title, body);

			OkHttpClient client = new OkHttpClient();
			RequestBody requestBody = RequestBody.create(message, MediaType.get(mediaType));
			Request request = new Request.Builder()
				.url(apiUrl)
				.post(requestBody)
				.addHeader(HttpHeaders.AUTHORIZATION, "Bearer " + getAccessToken())
				.addHeader(HttpHeaders.CONTENT_TYPE, mediaType)
				.build();

			try (Response response = client.newCall(request).execute()) {
				if (!response.isSuccessful()) {
					System.err.println("FCM 전송 실패: " + response.body().string());
				}
			}
		} catch (IOException e) {
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

		return objectMapper.writeValueAsString(fcmMessage);
	}

	private String getAccessToken() throws IOException {
		String firebaseConfigPath = firebasePath;

		GoogleCredentials googleCredentials = GoogleCredentials
			.fromStream(new ClassPathResource(firebaseConfigPath).getInputStream())
			.createScoped(List.of("https://www.googleapis.com/auth/cloud-platform"));

		googleCredentials.refreshIfExpired();
		String token = googleCredentials.getAccessToken().getTokenValue();
		return token;
	}
}
