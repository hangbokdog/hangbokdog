package com.ssafy.hangbokdog.volunteer.application.handler;

import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;

import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.fcm.application.FcmService;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.member.domain.repository.MemberRepository;
import com.ssafy.hangbokdog.volunteer.application.domain.VolunteerApplicationStatus;
import com.ssafy.hangbokdog.volunteer.application.event.VolunteerApplicationEvent;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class VolunteerApplicationEventHandler {

    private static final String APPROVE_COMMENT = "봉사활동 신청이 승인됐습니다.";
    private static final String REFUSE_COMMENT = "봉사활동 신청이 거절됐습니다.";

    private final FcmService fcmService;
    private final MemberRepository memberRepository;

    @TransactionalEventListener
    public void handleVolunteerApproveEvent(VolunteerApplicationEvent volunteerApplicationEvent) {
        Member member = memberRepository.findById(volunteerApplicationEvent.memberId())
                .orElseThrow(() -> new BadRequestException(ErrorCode.MEMBER_NOT_FOUND));

        fcmService.sendMessageTo(
                member.getFcmToken(),
                volunteerApplicationEvent.title(),
                volunteerApplicationEvent.state().equals(VolunteerApplicationStatus.APPROVED)
                        ? APPROVE_COMMENT : REFUSE_COMMENT
        );
    }
}
