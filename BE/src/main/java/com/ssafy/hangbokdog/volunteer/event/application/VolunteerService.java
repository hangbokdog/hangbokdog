package com.ssafy.hangbokdog.volunteer.event.application;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.jsoup.Jsoup;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.center.addressbook.domain.AddressBook;
import com.ssafy.hangbokdog.center.addressbook.domain.repository.AddressBookRepository;
import com.ssafy.hangbokdog.center.center.domain.CenterMember;
import com.ssafy.hangbokdog.center.center.domain.repository.CenterMemberRepository;
import com.ssafy.hangbokdog.center.center.domain.repository.CenterRepository;
import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.volunteer.application.domain.VolunteerApplicationStatus;
import com.ssafy.hangbokdog.volunteer.application.domain.repository.VolunteerApplicationRepository;
import com.ssafy.hangbokdog.volunteer.application.dto.VolunteerApplicationStatusInfo;
import com.ssafy.hangbokdog.volunteer.event.domain.VolunteerEvent;
import com.ssafy.hangbokdog.volunteer.event.domain.VolunteerSlot;
import com.ssafy.hangbokdog.volunteer.event.domain.repository.VolunteerEventRepository;
import com.ssafy.hangbokdog.volunteer.event.domain.repository.VolunteerSlotRepository;
import com.ssafy.hangbokdog.volunteer.event.domain.repository.VolunteerTemplateRepository;
import com.ssafy.hangbokdog.volunteer.event.dto.SlotDto;
import com.ssafy.hangbokdog.volunteer.event.dto.VolunteerAppliedCount;
import com.ssafy.hangbokdog.volunteer.event.dto.VolunteerSlotAppliedCount;
import com.ssafy.hangbokdog.volunteer.event.dto.request.VolunteerCreateRequest;
import com.ssafy.hangbokdog.volunteer.event.dto.request.VolunteerTemplateInfoUpdateRequest;
import com.ssafy.hangbokdog.volunteer.event.dto.request.VolunteerTemplatePrecautionUpdateRequest;
import com.ssafy.hangbokdog.volunteer.event.dto.response.DailyApplicationInfo;
import com.ssafy.hangbokdog.volunteer.event.dto.response.VolunteerDetailResponse;
import com.ssafy.hangbokdog.volunteer.event.dto.response.VolunteerInfo;
import com.ssafy.hangbokdog.volunteer.event.dto.response.VolunteerParticipantResponse;
import com.ssafy.hangbokdog.volunteer.event.dto.response.VolunteerResponse;
import com.ssafy.hangbokdog.volunteer.event.dto.response.VolunteerResponseWithStatus;
import com.ssafy.hangbokdog.volunteer.event.dto.response.VolunteerSlotResponse;
import com.ssafy.hangbokdog.volunteer.event.dto.response.VolunteerSlotResponseWithoutAppliedCount;
import com.ssafy.hangbokdog.volunteer.event.dto.response.VolunteerTemplateInfoResponse;
import com.ssafy.hangbokdog.volunteer.event.dto.response.VolunteerTemplatePrecautionResponse;
import com.ssafy.hangbokdog.volunteer.event.dto.response.VolunteerWithAppliedCountResponse;

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
    private final VolunteerApplicationRepository volunteerApplicationRepository;
    private final VolunteerSlotRepository volunteerSlotRepository;

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

    public List<VolunteerParticipantResponse> findAll(Member member, Long centerId) {
        var volunteers = eventRepository.findAllOpenEvents(centerId);
        List<Long> volunteerIds = extractVolunteerEventIds(volunteers);

        var volunteerApplicationStatus = volunteerApplicationRepository.findByEventIdsIn(member.getId(), volunteerIds);
        var volunteerIdToApplicationStatus = mapVolunteerIdToApplicationStatus(volunteerApplicationStatus);

        return eventRepository.findAllOpenEvents(centerId).stream()
                .map(volunteerInfo -> VolunteerParticipantResponse.of(
                        volunteerInfo.id(),
                        volunteerInfo.title(),
                        volunteerInfo.content(),
                        volunteerInfo.address(),
                        volunteerInfo.addressName(),
                        volunteerInfo.startDate(),
                        volunteerInfo.endDate(),
                        volunteerInfo.imageUrls().isEmpty()
                                ? DEFAULT_VOLUNTEER_IMAGE : volunteerInfo.imageUrls().get(0),
                        volunteerIdToApplicationStatus.getOrDefault(
                                volunteerInfo.id(),
                                VolunteerApplicationStatus.NONE
                        )
                        )
                )
                .toList();
    }

    public VolunteerDetailResponse findById(Member member, Long eventId) {
        VolunteerEvent event = eventRepository.findById(eventId)
                .orElseThrow(() -> new BadRequestException(ErrorCode.VOLUNTEER_NOT_FOUND));

        var volunteerSlots = volunteerSlotRepository.findAllByEventId(eventId);
        List<Long> volunteerSlotIds = extractVolunteerSlotIds(volunteerSlots);
        var slotAppliedCount = volunteerApplicationRepository.findSlotsWithAppliedCountByIdIn(volunteerSlotIds);
        var slotsToAppliedCount = mapSlotToAppliedCount(slotAppliedCount);

        List<VolunteerSlotResponse> slotResponses = volunteerSlots.stream()
                .map(slot -> VolunteerSlotResponse.builder()
                        .applicationCount(slotsToAppliedCount.getOrDefault(slot.id(), 0))
                        .startTime(slot.startTime())
                        .endTime(slot.endTime())
                        .volunteerDate(slot.volunteerDate())
                        .capacity(slot.capacity())
                        .slotType(slot.slotType())
                        .build()
                ).toList();

        return VolunteerDetailResponse.builder()
                .id(event.getId())
                .status(event.getStatus())
                .title(event.getTitle())
                .content(event.getContent())
                .address(event.getAddress())
                .addressName(event.getAddressName())
                .startDate(event.getStartDate())
                .endDate(event.getEndDate())
                .slots(slotResponses)
                .imageUrls(event.getImageUrls())
                .activityLog(event.getActivityLog())
                .precaution(event.getPrecaution())
                .info(event.getInfo())
                .build();
    }

    public List<VolunteerSlotResponse> findAllSlotsByVolunteerEventId(Member member, Long eventId) {
        VolunteerEvent event = eventRepository.findById(eventId)
                .orElseThrow(() -> new BadRequestException(ErrorCode.VOLUNTEER_NOT_FOUND));
        return volunteerSlotRepository.findAllByEventIdWithPending(eventId);
    }

    public List<VolunteerResponseWithStatus> findLatest(Member member, Long centerId) {
        var volunteers = eventRepository.findAllOpenEvents(centerId);
        List<Long> volunteerIds = extractVolunteerEventIds(volunteers);

        var volunteerApplicationStatus = volunteerApplicationRepository.findByEventIdsIn(member.getId(), volunteerIds);
        var volunteerIdToApplicationStatus = mapVolunteerIdToApplicationStatus(volunteerApplicationStatus);

        return eventRepository.findLatestVolunteerEvent(centerId).stream()
                .map(volunteerInfo -> VolunteerResponseWithStatus.of(
                        volunteerInfo.id(),
                        volunteerInfo.title(),
                        volunteerInfo.content(),
                        volunteerInfo.address(),
                        volunteerInfo.addressName(),
                        volunteerInfo.startDate(),
                        volunteerInfo.endDate(),
                        volunteerInfo.imageUrls().isEmpty()
                                ? DEFAULT_VOLUNTEER_IMAGE : volunteerInfo.imageUrls().get(0),
                        volunteerIdToApplicationStatus.getOrDefault(volunteerInfo.id(), VolunteerApplicationStatus.NONE)
                        )
                )
                .toList();
    }

    public PageInfo<VolunteerResponse> findEnded(Long centerId, String pageToken) {
        return eventRepository.findEndedVolunteerEvent(centerId, pageToken);
    }

    public List<VolunteerWithAppliedCountResponse> findOngoingVolunteersInAddressBook(Long addressBookId) {
        var volunteerInfo = eventRepository.findAllOpenEventsInAddressBook(addressBookId);
        var volunteerEventIds = extractVolunteerEventIds(volunteerInfo);
        var volunteerAppliedCounts = volunteerSlotRepository
                .getAppliedCountByVolunteerIdsInWithGroupByVolunteerId(volunteerEventIds);
        var volunteerEventIdToAppliedCount = mapVolunteerEventIdToAppliedCount(volunteerAppliedCounts);
        return volunteerInfo.stream()
                .map(volunteer -> VolunteerWithAppliedCountResponse.of(
                        volunteer.id(),
                        volunteer.title(),
                        volunteer.content(),
                        volunteer.address(),
                        volunteer.addressName(),
                        volunteer.startDate(),
                        volunteer.endDate(),
                        volunteer.imageUrls().isEmpty() ? DEFAULT_VOLUNTEER_IMAGE : volunteer.imageUrls().get(0),
                        volunteerEventIdToAppliedCount.getOrDefault(volunteer.id(), 0)
                )).toList();
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

    public List<DailyApplicationInfo> findAllSchedule(Long eventId) {
        return eventRepository.findDailyApplications(eventId);
    }

    private List<Long> extractVolunteerEventIds(List<VolunteerInfo> volunteers) {
        return volunteers.stream()
                .map(VolunteerInfo::id)
                .toList();
    }

    private Map<Long, VolunteerApplicationStatus> mapVolunteerIdToApplicationStatus(
            List<VolunteerApplicationStatusInfo> volunteerApplicationStatus
    ) {
        return volunteerApplicationStatus.stream()
                .collect(Collectors.toMap(
                        VolunteerApplicationStatusInfo::volunteerEventId,
                        VolunteerApplicationStatusInfo::status,
                        (old, newValue) -> newValue
                ));
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

    private Map<Long, Integer> mapVolunteerEventIdToAppliedCount(List<VolunteerAppliedCount> volunteerAppliedCounts) {
        return volunteerAppliedCounts.stream()
                .collect(Collectors.toMap(
                        VolunteerAppliedCount::id,
                        VolunteerAppliedCount::count
                ));
    }

    private List<Long> extractVolunteerSlotIds(List<VolunteerSlotResponseWithoutAppliedCount> volunteerSlots) {
        return volunteerSlots.stream()
                .map(VolunteerSlotResponseWithoutAppliedCount::id)
                .toList();
    }

    private Map<Long, Integer> mapSlotToAppliedCount(List<VolunteerSlotAppliedCount> slotAppliedCount) {
        return slotAppliedCount.stream()
                .collect(Collectors.toMap(
                        VolunteerSlotAppliedCount::volunteerSlotId,
                        VolunteerSlotAppliedCount::count
                ));
    }
}
