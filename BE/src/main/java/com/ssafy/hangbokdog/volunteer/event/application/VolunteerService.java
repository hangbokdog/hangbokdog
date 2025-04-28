package com.ssafy.hangbokdog.volunteer.event.application;

import java.util.List;

import org.jsoup.Jsoup;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.volunteer.event.domain.VolunteerEvent;
import com.ssafy.hangbokdog.volunteer.event.domain.VolunteerSlot;
import com.ssafy.hangbokdog.volunteer.event.domain.repository.VolunteerEventRepository;
import com.ssafy.hangbokdog.volunteer.event.domain.repository.VolunteerSlotRepository;
import com.ssafy.hangbokdog.volunteer.event.dto.request.VolunteerCreateRequest;

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
