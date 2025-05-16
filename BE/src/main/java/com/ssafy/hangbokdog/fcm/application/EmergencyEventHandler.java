package com.ssafy.hangbokdog.fcm.application;

import java.util.List;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import com.ssafy.hangbokdog.fcm.dto.event.EmergencyEvent;
import com.ssafy.hangbokdog.member.domain.repository.MemberRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class EmergencyEventHandler {

	private final FcmService fcmService;
	private final MemberRepository memberRepository;

	@EventListener
	public void handleEmergencyEvent(EmergencyEvent event) {
		Long centerId = event.centerId();

		List<String> targetTokens = memberRepository.findFcmTokensByCenterId(centerId);

		for (String token : targetTokens) {
			fcmService.sendMessageTo(token, event.title(), event.centerName());
		}
	}
}
