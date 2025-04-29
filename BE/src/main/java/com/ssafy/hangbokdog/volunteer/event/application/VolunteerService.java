package com.ssafy.hangbokdog.volunteer.event.application;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.jsoup.Jsoup;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.volunteer.event.domain.SlotType;
import com.ssafy.hangbokdog.volunteer.event.domain.VolunteerEvent;
import com.ssafy.hangbokdog.volunteer.event.domain.VolunteerSlot;
import com.ssafy.hangbokdog.volunteer.event.domain.repository.VolunteerEventRepository;
import com.ssafy.hangbokdog.volunteer.event.domain.repository.VolunteerSlotRepository;
import com.ssafy.hangbokdog.volunteer.event.dto.SlotDto;
import com.ssafy.hangbokdog.volunteer.event.dto.request.VolunteerCreateRequest;
import com.ssafy.hangbokdog.volunteer.event.dto.response.DailyApplicationInfo;
import com.ssafy.hangbokdog.volunteer.event.dto.response.VolunteerResponse;
import com.ssafy.hangbokdog.volunteer.event.dto.response.VolunteerResponses;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VolunteerService {

    private final VolunteerEventRepository eventRepository;
    private final VolunteerSlotRepository slotRepository;

    // TODO: 활동 일지 제외
    @Transactional
    public Long create(VolunteerCreateRequest request) {
        List<String> imageUrls = extractTopImageUrls(request.activityLog());

        VolunteerEvent event = VolunteerEvent.builder()
                .title(request.title())
                .content(request.content())
                .imageUrls(imageUrls)
                .address(request.address())
                .locationType(request.locationType())
                .startDate(request.startDate())
                .endDate(request.endDate())
                .activityLog(request.activityLog())
                .precaution(request.precaution())
                .info(request.info())
                .build();

        event = eventRepository.save(event);
        Long eventId = event.getId();

        List<VolunteerSlot> slots = request.slots().stream()
                .map(slotReq -> VolunteerSlot.builder()
                        .eventId(eventId)
                        .slotType(slotReq.slotType())
                        .startTime(slotReq.startTime())
                        .endTime(slotReq.endTime())
                        .capacity(slotReq.capacity())
                        .build())
                .toList();
        slotRepository.saveAll(slots);

        return eventId;
    }

    // TODO: 필요하다면 페이지네이션 추가
    public List<VolunteerResponses> findAll() {
        return eventRepository.findAllOpenEvents();
    }

    public VolunteerResponse findById(Long eventId) {
        VolunteerEvent event = eventRepository.findById(eventId)
                .orElseThrow(() -> new BadRequestException(ErrorCode.VOLUNTEER_NOT_FOUND));

        List<SlotDto> slots = slotRepository.findByEventId(eventId);
        int morningCapacity = slots.stream()
                .filter(s -> s.slotType() == SlotType.MORNING)
                .map(SlotDto::capacity)
                .findFirst().orElse(0);
        int afternoonCapacity = slots.stream()
                .filter(s -> s.slotType() == SlotType.AFTERNOON)
                .map(SlotDto::capacity)
                .findFirst().orElse(0);

        List<DailyApplicationInfo> raw = eventRepository.findAllDailyApplications(eventId);
        Map<LocalDate, DailyApplicationInfo> rawMap = raw.stream()
                .collect(Collectors.toMap(DailyApplicationInfo::date, Function.identity()));

        // 4) 이벤트 기간 전체 날짜 리스트 생성
        LocalDate start = event.getStartDate();
        LocalDate end   = event.getEndDate();
        long days = ChronoUnit.DAYS.between(start, end) + 1;
        List<DailyApplicationInfo> applicationInfos =
                Stream.iterate(start, d -> d.plusDays(1))
                        .limit(days)
                        .map(date -> rawMap.getOrDefault(date,
                                new DailyApplicationInfo(
                                        date,
                                        new DailyApplicationInfo.SlotCapacity(0, morningCapacity),
                                        new DailyApplicationInfo.SlotCapacity(0, afternoonCapacity)
                                )
                        ))
                        .toList();

        return VolunteerResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .content(event.getContent())
                .address(event.getAddress())
                .locationType(event.getLocationType())
                .startDate(event.getStartDate())
                .endDate(event.getEndDate())
                .slots(slots)
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
}
