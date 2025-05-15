package com.ssafy.hangbokdog.center.addressbook.application;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.center.addressbook.domain.AddressBook;
import com.ssafy.hangbokdog.center.addressbook.domain.repository.AddressBookRepository;
import com.ssafy.hangbokdog.center.addressbook.dto.request.AddressBookRequest;
import com.ssafy.hangbokdog.center.addressbook.dto.response.AddressBookAppliedCountResponse;
import com.ssafy.hangbokdog.center.addressbook.dto.response.AddressBookResponse;
import com.ssafy.hangbokdog.center.center.domain.CenterMember;
import com.ssafy.hangbokdog.center.center.domain.repository.CenterMemberRepository;
import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.volunteer.event.domain.VolunteerTemplate;
import com.ssafy.hangbokdog.volunteer.event.domain.repository.VolunteerEventRepository;
import com.ssafy.hangbokdog.volunteer.event.domain.repository.VolunteerSlotRepository;
import com.ssafy.hangbokdog.volunteer.event.domain.repository.VolunteerTemplateRepository;
import com.ssafy.hangbokdog.volunteer.event.dto.VolunteerIdInfo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AddressBookService {

	private static final String DEFAULT_INFO = "기본 정보 템플릿이 없습니다.";
	private static final String DEFAULT_PRECAUTION = "기본 주의사항 템플릿이 없습니다";

	private final AddressBookRepository addressBookRepository;
	private final CenterMemberRepository centerMemberRepository;
	private final VolunteerTemplateRepository volunteerTemplateRepository;
	private final VolunteerEventRepository volunteerEventRepository;
	private final VolunteerSlotRepository volunteerSlotRepository;

	@Transactional
	public void save(AddressBookRequest request, Long centerId, Long memberId) {

		CenterMember centerMember = getCenterMember(centerId, memberId);

		if (!centerMember.isManager()) {
			throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
		}

		AddressBook addressBook = AddressBook.builder()
				.addressName(request.addressName())
				.address(request.address())
				.centerId(centerId)
				.build();

		addressBookRepository.save(addressBook);

		volunteerTemplateRepository.save(
				VolunteerTemplate.builder()
						.info(DEFAULT_INFO)
						.precaution(DEFAULT_PRECAUTION)
						.addressBookId(addressBook.getId())
						.build()
		);
	}

	@Transactional
	public void update(AddressBookRequest request, Long centerId, Long memberId, Long addressBookId) {
		AddressBook addressBook = addressBookRepository.findById(addressBookId)
			.orElseThrow(() -> new BadRequestException(ErrorCode.ADDRESS_BOOK_NOT_FOUND));

		CenterMember centerMember = getCenterMember(centerId, memberId);

		if (!centerMember.isManager()) {
			throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
		}

		addressBook.updateAddress(request.addressName(), request.address());
	}

	public List<AddressBookAppliedCountResponse> getAddressBooks(Long centerId) {
		var addressBookResponse = addressBookRepository.getAddressBookByCenter(centerId);
		var addressBookIds = extractAddressBookIds(addressBookResponse);
		var activeEventIds = volunteerEventRepository.findActiveEventIds(addressBookIds);
		var addressIdToVolunteerIds = mapAddressIdToVolunteerIds(activeEventIds);
		Map<Long, Integer> addressIdToApplicationCount = addressIdToVolunteerIds.entrySet().stream()
						.collect(Collectors.toMap(
								Map.Entry::getKey,
								entry -> {
									List<Long> volunteerEventIds = entry.getValue();
									return volunteerSlotRepository.getAppliedCountByVolunteerIdsIn(volunteerEventIds);
								}));

		return addressBookResponse.stream()
				.map(addressBook -> AddressBookAppliedCountResponse.of(
						addressBook.id(),
						addressBook.addressName(),
						addressBook.address(),
						addressIdToApplicationCount.getOrDefault(addressBook.id(), 0)
				)).toList();
	}

	public void deleteAddressBook(Member member, Long addressBookId, Long centerId) {
		CenterMember loginMember = getCenterMember(centerId, member.getId());

		if (!loginMember.isManager()) {
			throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
		}

		addressBookRepository.deleteById(addressBookId);
	}

	private CenterMember getCenterMember(Long centerId, Long memberId) {
		return centerMemberRepository.findByMemberIdAndCenterId(memberId, centerId)
			.orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_MEMBER_NOT_FOUND));
	}

	private Map<Long, List<Long>> mapAddressIdToVolunteerIds(List<VolunteerIdInfo> activeEventIds) {
		return activeEventIds.stream()
				.collect(Collectors.groupingBy(
						VolunteerIdInfo::addressId,
						Collectors.mapping(
								VolunteerIdInfo::volunteerEventId,
								Collectors.toList()
						)
				));
	}

	private List<Long> extractAddressBookIds(List<AddressBookResponse> addressBook) {
		return addressBook.stream()
				.map(AddressBookResponse::id)
				.toList();
	}
}
