package com.ssafy.hangbokdog.fcm.application;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import com.ssafy.hangbokdog.fcm.dto.event.CenterMemberEvent;
import com.ssafy.hangbokdog.member.domain.repository.MemberRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class CenterMemberEventHandler {

	private final FcmService fcmService;
	private final MemberRepository memberRepository;

	@EventListener
	public void handleCenterMemberEvent(CenterMemberEvent event) {
		String targetToken = memberRepository.getFcmTokenByMemberId(event.memberId());

		log.info("MemberId: " + event.memberId() + ", token: " + targetToken);

		fcmService.sendMessageTo(targetToken, event.centerName(), event.isApproved().toString());
	}
}
