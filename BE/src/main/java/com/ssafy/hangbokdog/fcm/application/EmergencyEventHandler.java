package com.ssafy.hangbokdog.fcm.application;

import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;

import com.ssafy.hangbokdog.fcm.dto.event.EmergencyPostEvent;
import com.ssafy.hangbokdog.member.domain.repository.MemberRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class EmergencyEventHandler {

	private final FcmService fcmService;
	private final MemberRepository memberRepository;

	@TransactionalEventListener
	public void handleEmergencyEvent(EmergencyPostEvent event) {
		Long centerId = event.centerId();

		List<String> targetTokens = memberRepository.findFcmTokensByCenterId(centerId);

		for (String targetToken : targetTokens) {
			fcmService.sendMessageTo(
					targetToken,
					event.title(),
					event.centerName()
			);
		}
	}
}
