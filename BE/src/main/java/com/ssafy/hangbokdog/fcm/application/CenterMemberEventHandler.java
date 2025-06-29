package com.ssafy.hangbokdog.fcm.application;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import com.ssafy.hangbokdog.common.util.JsonUtils;
import com.ssafy.hangbokdog.fcm.dto.event.CenterMemberEvent;
import com.ssafy.hangbokdog.fcm.dto.response.CenterNotification;
import com.ssafy.hangbokdog.member.domain.repository.MemberRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CenterMemberEventHandler {

	private static final String APPROVE_COMMENT = "센터 가입 승인되었습니다.";
	private static final String REFUSE_COMMENT = "센터 가입 거절되었습니다.";


	private final FcmService fcmService;
	private final MemberRepository memberRepository;
	private final JsonUtils jsonUtils;

	@EventListener
	public void handleCenterMemberEvent(CenterMemberEvent event) {
		String targetToken = memberRepository.getFcmTokenByMemberId(event.memberId());

		fcmService.sendMessageTo(
				targetToken,
				event.centerName(),
				jsonUtils.convertToJson(CenterNotification.of(
						event.isApproved() ? APPROVE_COMMENT : REFUSE_COMMENT,
						event.isApproved()
						)
		));
	}
}
