package com.ssafy.hangbokdog.fcm.application;

import java.util.List;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import com.ssafy.hangbokdog.fcm.dto.event.EmergencyEvent;
import com.ssafy.hangbokdog.member.domain.repository.MemberRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class EmergencyEventHandler {

	private final FcmService fcmService;
	private final MemberRepository memberRepository;

	@EventListener
	public void handleEmergencyEvent(EmergencyEvent event) {
		Long centerId = event.centerId();

		log.info("emergency event: " + event);

		List<String> targetTokens = memberRepository.findFcmTokensByCenterId(centerId);

		for (String token : targetTokens) {
			log.info("🔔 FCM 대상 토큰: {}", token);
			fcmService.sendMessageTo(token, event.title(), event.centerName());
		}
	}
}
