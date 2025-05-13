package com.ssafy.hangbokdog.volunteer.event.application;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.jsoup.Jsoup;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.center.domain.AddressBook;
import com.ssafy.hangbokdog.center.domain.CenterMember;
import com.ssafy.hangbokdog.center.domain.repository.AddressBookRepository;
import com.ssafy.hangbokdog.center.domain.repository.CenterMemberRepository;
import com.ssafy.hangbokdog.center.domain.repository.CenterRepository;
import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.volunteer.event.domain.VolunteerEvent;
import com.ssafy.hangbokdog.volunteer.event.domain.VolunteerSlot;
import com.ssafy.hangbokdog.volunteer.event.domain.repository.VolunteerEventRepository;
import com.ssafy.hangbokdog.volunteer.event.domain.repository.VolunteerSlotRepository;
import com.ssafy.hangbokdog.volunteer.event.domain.repository.VolunteerTemplateRepository;
import com.ssafy.hangbokdog.volunteer.event.dto.SlotDto;
import com.ssafy.hangbokdog.volunteer.event.dto.request.VolunteerCreateRequest;
import com.ssafy.hangbokdog.volunteer.event.dto.request.VolunteerTemplateInfoUpdateRequest;
import com.ssafy.hangbokdog.volunteer.event.dto.request.VolunteerTemplatePrecautionUpdateRequest;
import com.ssafy.hangbokdog.volunteer.event.dto.response.DailyApplicationInfo;
import com.ssafy.hangbokdog.volunteer.event.dto.response.VolunteerDetailResponse;
import com.ssafy.hangbokdog.volunteer.event.dto.response.VolunteerResponse;
import com.ssafy.hangbokdog.volunteer.event.dto.response.VolunteerTemplateInfoResponse;
import com.ssafy.hangbokdog.volunteer.event.dto.response.VolunteerTemplatePrecautionResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VolunteerService {

    private static final String DEFAULT_VOLUNTEER_IMAGE = "https://palgona.s3.ap-northeast-2.amazonaws.com/default.png";

    private final VolunteerEventRepository eventRepository;
    private final VolunteerSlotRepository slotRepository;
    private final CenterRepository centerRepository;
    private final CenterMemberRepository centerMemberRepository;
    private final AddressBookRepository addressBookRepository;
    private final VolunteerTemplateRepository volunteerTemplateRepository;

    // TODO: 활동 일지 제외
    @Transactional
    public Long create(Long memberId, Long centerId, VolunteerCreateRequest request) {

        CenterMember centerMember = centerMemberRepository.findByMemberIdAndCenterId(memberId, centerId)
            .orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_MEMBER_NOT_FOUND));

        if (!centerMember.isManager()) {
            throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
        }

        centerRepository.findById(centerId)
                .orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_NOT_FOUND));

        List<String> imageUrls = extractTopImageUrls(request.activityLog());

        AddressBook addressBook = addressBookRepository.findById(request.addressBookId())
                .orElseThrow(() -> new BadRequestException(ErrorCode.ADDRESS_BOOK_NOT_FOUND));

        VolunteerEvent event = VolunteerEvent.builder()
                .centerId(centerId)
                .title(request.title())
                .content(request.content())
                .imageUrls(imageUrls.isEmpty() ? List.of(DEFAULT_VOLUNTEER_IMAGE) : imageUrls)
                .address(addressBook.getAddress())
                .startDate(request.startDate())
                .addressBookId(request.addressBookId())
                .endDate(request.endDate())
                .activityLog(request.activityLog())
                .precaution(request.precaution())
                .info(request.info())
                .addressName(addressBook.getAddressName())
                .build();

        event = eventRepository.save(event);
        Long eventId = event.getId();

        // 날짜 리스트 만들기
        LocalDate start = request.startDate();
        LocalDate end   = request.endDate();
        List<LocalDate> dates = start.datesUntil(end.plusDays(1))
                .toList();

        // 모든 날짜 × 슬롯 스케줄 매핑
        List<VolunteerSlot> slots = new ArrayList<>();
        for (LocalDate date : dates) {
            for (SlotDto slot : request.slots()) {
                slots.add(VolunteerSlot.builder()
                        .eventId(eventId)
                        .volunteerDate(date)
                        .slotType(slot.slotType())
                        .startTime(slot.startTime())
                        .endTime(slot.endTime())
                        .capacity(slot.capacity())
                        .build()
                );
            }
        }

        // 4) 일괄 저장
        slotRepository.saveAll(slots);

        return eventId;
    }

    // TODO: 필요하다면 페이지네이션 추가
    public List<VolunteerResponse> findAll(Long centerId) {
        return eventRepository.findAllOpenEvents(centerId).stream()
                .map(volunteerInfo -> VolunteerResponse.of(
                        volunteerInfo.id(),
                        volunteerInfo.title(),
                        volunteerInfo.content(),
                        volunteerInfo.address(),
                        volunteerInfo.addressName(),
                        volunteerInfo.startDate(),
                        volunteerInfo.endDate(),
                        volunteerInfo.imageUrls().isEmpty()
                                ? DEFAULT_VOLUNTEER_IMAGE : volunteerInfo.imageUrls().get(0))
                )
                .toList();
    }

    public VolunteerDetailResponse findById(Long eventId) {
        VolunteerEvent event = eventRepository.findById(eventId)
                .orElseThrow(() -> new BadRequestException(ErrorCode.VOLUNTEER_NOT_FOUND));

        List<SlotDto> slots = slotRepository.findByEventId(eventId);

        List<DailyApplicationInfo> applicationInfos = eventRepository.findDailyApplications(eventId);

        return VolunteerDetailResponse.builder()
                .id(event.getId())
                .status(event.getStatus())
                .title(event.getTitle())
                .content(event.getContent())
                .address(event.getAddress())
                .addressName(event.getAddressName())
                .startDate(event.getStartDate())
                .endDate(event.getEndDate())
                .slots(slots)
                .imageUrls(event.getImageUrls())
                .activityLog(event.getActivityLog())
                .applicationInfo(applicationInfos)
                .precaution(event.getPrecaution())
                .info(event.getInfo())
                .build();
    }

    // HTML에서 <img src="..."> 태그의 src 속성만 뽑아내는 유틸
    private List<String> extractTopImageUrls(String html) {
        return Jsoup.parse(html)
                .select("img[src]")
                .stream()
                .map(img -> img.attr("src"))
                .distinct()
                .toList();
    }

    public List<VolunteerResponse> findLatest(Long centerId) {
        return eventRepository.findLatestVolunteerEvent(centerId).stream()
                .map(volunteerInfo -> VolunteerResponse.of(
                        volunteerInfo.id(),
                        volunteerInfo.title(),
                        volunteerInfo.content(),
                        volunteerInfo.address(),
                        volunteerInfo.addressName(),
                        volunteerInfo.startDate(),
                        volunteerInfo.endDate(),
                        volunteerInfo.imageUrls().isEmpty()
                                ? DEFAULT_VOLUNTEER_IMAGE : volunteerInfo.imageUrls().get(0))
                )
                .toList();
    }

    public PageInfo<VolunteerResponse> findEnded(Long centerId, String pageToken) {
        return eventRepository.findEndedVolunteerEvent(centerId, pageToken);
    }

    public List<VolunteerResponse> findOngoingVolunteersInAddressBook(Long addressBookId) {
        return eventRepository.findAllOpenEventsInAddressBook(addressBookId).stream()
                .map(volunteerInfo -> VolunteerResponse.of(
                        volunteerInfo.id(),
                        volunteerInfo.title(),
                        volunteerInfo.content(),
                        volunteerInfo.address(),
                        volunteerInfo.addressName(),
                        volunteerInfo.startDate(),
                        volunteerInfo.endDate(),
                        volunteerInfo.imageUrls().isEmpty()
                                ? DEFAULT_VOLUNTEER_IMAGE : volunteerInfo.imageUrls().get(0)
                ))
                .toList();
    }

    public PageInfo<VolunteerResponse> findEndedVolunteersInAddressBook(Long addressBookId, String pageToken) {
        return eventRepository.findEndedVolunteerEventInAddressBook(addressBookId, pageToken);
    }

    @Transactional
    public void updateTemplateInfo(
            Member member,
            Long addressBookId,
            VolunteerTemplateInfoUpdateRequest request,
            Long centerId
    ) {
        var centerMember = centerMemberRepository.findByMemberIdAndCenterId(member.getId(), centerId)
                .orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_MEMBER_NOT_FOUND));

        if (!centerMember.isManager()) {
            throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
        }

        var volunteerTemplate = volunteerTemplateRepository.findByAddressBookId(addressBookId)
                .orElseThrow(() -> new BadRequestException(ErrorCode.VOLUNTEER_TEMPLATE_NOT_FOUND));

        volunteerTemplate.updateInfo(request.info());
    }

    @Transactional
    public void updateTemplatePrecaution(
            Member member,
            Long addressBookId,
            VolunteerTemplatePrecautionUpdateRequest request,
            Long centerId
    ) {
        var centerMember = centerMemberRepository.findByMemberIdAndCenterId(member.getId(), centerId)
                .orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_MEMBER_NOT_FOUND));

        if (!centerMember.isManager()) {
            throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
        }

        var volunteerTemplate = volunteerTemplateRepository.findByAddressBookId(addressBookId)
                .orElseThrow(() -> new BadRequestException(ErrorCode.VOLUNTEER_TEMPLATE_NOT_FOUND));

        volunteerTemplate.updatePrecaution(request.precaution());
    }

    public VolunteerTemplateInfoResponse findVolunteerTemplateInfo(
            Member member,
            Long addressBookId,
            Long centerId
    ) {
        var centerMember = centerMemberRepository.findByMemberIdAndCenterId(member.getId(), centerId)
                .orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_MEMBER_NOT_FOUND));

        if (!centerMember.isManager()) {
            throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
        }

        var volunteerTemplate = volunteerTemplateRepository.findByAddressBookId(addressBookId)
                .orElseThrow(() -> new BadRequestException(ErrorCode.VOLUNTEER_TEMPLATE_NOT_FOUND));

        return VolunteerTemplateInfoResponse.from(volunteerTemplate);
    }

    public VolunteerTemplatePrecautionResponse findVolunteerTemplatePrecaution(
        Member member,
        Long addressBookId,
        Long centerId
    ) {
        var centerMember = centerMemberRepository.findByMemberIdAndCenterId(member.getId(), centerId)
            .orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_MEMBER_NOT_FOUND));

        if (!centerMember.isManager()) {
            throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
        }

        var volunteerTemplate = volunteerTemplateRepository.findByAddressBookId(addressBookId)
            .orElseThrow(() -> new BadRequestException(ErrorCode.VOLUNTEER_TEMPLATE_NOT_FOUND));

        return VolunteerTemplatePrecautionResponse.from(volunteerTemplate);
    }
}
