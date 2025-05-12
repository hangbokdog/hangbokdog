package com.ssafy.hangbokdog.center.application;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.center.domain.AddressBook;
import com.ssafy.hangbokdog.center.domain.CenterMember;
import com.ssafy.hangbokdog.center.domain.repository.AddressBookRepository;
import com.ssafy.hangbokdog.center.domain.repository.CenterMemberRepository;
import com.ssafy.hangbokdog.center.dto.request.AddressBookRequest;
import com.ssafy.hangbokdog.center.dto.response.AddressBookResponse;
import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.volunteer.event.domain.VolunteerTemplate;
import com.ssafy.hangbokdog.volunteer.event.domain.repository.VolunteerTemplateRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AddressBookService {

	private static final String DEFAULT_INFO = "기본 정보 템플릿이 없습니다.";
	private static final String DEFAULT_PRECAUTION = "기본 주의사항 템플릿이 없습니다";

	private final AddressBookRepository addressBookRepository;
	private final CenterMemberRepository centerMemberRepository;
	private final VolunteerTemplateRepository volunteerTemplateRepository;

	@Transactional
	public void save(AddressBookRequest request, Long centerId, Long memberId) {

		CenterMember centerMember = getCenterMember(centerId, memberId);

		if (!centerMember.isManager()) {
			throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
		}

		volunteerTemplateRepository.save(
				VolunteerTemplate.builder()
						.info(DEFAULT_INFO)
						.precaution(DEFAULT_PRECAUTION)
						.build()
		);

		AddressBook addressBook = AddressBook.builder()
			.addressName(request.addressName())
			.address(request.address())
			.centerId(centerId)
			.build();

		addressBookRepository.save(addressBook);
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

	public List<AddressBookResponse> getAddressBooks(Long centerId) {
		return addressBookRepository.getAddressBookByCenter(centerId);
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
}
