package com.ssafy.hangbokdog.fcm.application;

import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;

import com.ssafy.hangbokdog.common.util.JsonUtils;
import com.ssafy.hangbokdog.fcm.domain.NotificationType;
import com.ssafy.hangbokdog.fcm.dto.event.EmergencyEvent;
import com.ssafy.hangbokdog.fcm.dto.response.EmergencyNotification;
import com.ssafy.hangbokdog.member.domain.repository.MemberRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class EmergencyEventHandler {

	private static final String EMERGENCY_CONTENT = "응급 상황 발생했습니다!!";

	private final FcmService fcmService;
	private final MemberRepository memberRepository;
	private final JsonUtils jsonUtils;

	@TransactionalEventListener
	public void handleEmergencyEvent(EmergencyEvent event) {
		Long centerId = event.centerId();
		List<String> targetTokens = memberRepository.findFcmTokensByCenterId(centerId);

		for (String token : targetTokens) {
			fcmService.sendMessageTo(token, event.title(), jsonUtils.convertToJson(
					EmergencyNotification.of(
							event.emergencyId(),
							event.centerName(),
							NotificationType.EMERGENCY,
							EMERGENCY_CONTENT
					)));
		}
	}
}
