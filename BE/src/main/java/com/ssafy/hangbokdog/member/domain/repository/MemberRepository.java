package com.ssafy.hangbokdog.member.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.center.center.domain.enums.CenterGrade;
import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.member.dto.MemberAgeInfo;
import com.ssafy.hangbokdog.member.dto.response.CenterMemberPageResponseWithCount;
import com.ssafy.hangbokdog.member.dto.response.CenterMemberResponse;
import com.ssafy.hangbokdog.member.dto.response.MemberProfileResponse;
import com.ssafy.hangbokdog.member.dto.response.MemberResponse;
import com.ssafy.hangbokdog.member.dto.response.MemberSearchNicknameResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class MemberRepository {
    private static final int DEFAULT_PAGE_SIZE = 20;

    private final MemberJpaRepository memberJpaRepository;

    public Optional<Member> findById(Long id) {
        return memberJpaRepository.findById(id);
    }

    public Optional<MemberSearchNicknameResponse> findByNickname(String nickname) {
        return memberJpaRepository.findByNickname(nickname);
    }

    public Optional<Member> findBySocialId(String socialId) {
        return memberJpaRepository.findBySocialId(socialId);
    }

    public Member save(Member member) {
        return memberJpaRepository.save(member);
    }

    public boolean existsByNickName(String nickName) {
        return memberJpaRepository.existsByNickName(nickName);
    }

    public List<Member> findAllByIds(List<Long> memberIds) {
        return memberJpaRepository.findAllById(memberIds);
    }

    public List<String> findFcmTokensByCenterId(Long centerId) {
        return memberJpaRepository.findFcmTokensByCenterId(centerId);
    }

    public MemberProfileResponse getMemberProfile(Long memberId) {
        return memberJpaRepository.getMemberProfile(memberId);
    }

    public List<MemberAgeInfo> findByIdInWithAge(List<Long> allParticipantIds) {
        return memberJpaRepository.findByIdWithAge(allParticipantIds);
    }

    public String getFcmTokenByMemberId(Long memberId) {
        return memberJpaRepository.getFcmTokenById(memberId);
    }

    public CenterMemberPageResponseWithCount findMembersInCenter(
            Long centerId,
            String pageToken,
            CenterGrade grade,
            String searchWord
    ) {
        var data = memberJpaRepository.findMembersInCenter(centerId, pageToken, DEFAULT_PAGE_SIZE, grade, searchWord);
        //TODO Cache + Batch
        int count = memberJpaRepository.countMembersInCenter(centerId, grade);
        var pageData = PageInfo.of(data, DEFAULT_PAGE_SIZE, MemberResponse::centerMemberId);
        return CenterMemberPageResponseWithCount.of(pageData, count);
    }

    public Optional<CenterMemberResponse> findByIdWithCenterInfo(Long memberId, Long centerId) {
        return memberJpaRepository.findByIdWithCenterInfo(memberId, centerId);
    }
}
