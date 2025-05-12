package com.ssafy.hangbokdog.center.application;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.center.domain.AddressBook;
import com.ssafy.hangbokdog.center.domain.Center;
import com.ssafy.hangbokdog.center.domain.CenterMember;
import com.ssafy.hangbokdog.center.domain.repository.AddressBookRepository;
import com.ssafy.hangbokdog.center.domain.repository.CenterMemberRepository;
import com.ssafy.hangbokdog.center.dto.request.AddressBookRequest;
import com.ssafy.hangbokdog.center.dto.response.AddressBookResponse;
import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.dog.dog.domain.repository.DogRepository;
import com.ssafy.hangbokdog.member.domain.Member;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AddressBookService {

	private final AddressBookRepository addressBookRepository;
	private final CenterMemberRepository centerMemberRepository;
	private final DogRepository dogRepository;

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

		if (request.newLocationId() != null) {
			dogRepository.updateDogLocation(request.locationId(), request.newLocationId());
		} else {
			dogRepository.deleteAllByLocationId(request.locationId());
		}
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
