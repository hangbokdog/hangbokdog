package com.ssafy.hangbokdog.center.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.center.domain.AddressBook;
import com.ssafy.hangbokdog.center.dto.response.AddressBookResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class AddressBookRepository {

	private final AddressBookJpaRepository addressBookJpaRepository;

	public void save(AddressBook addressBook) {
		addressBookJpaRepository.save(addressBook);
	}

	public Optional<AddressBook> findById(Long id) {
		return addressBookJpaRepository.findById(id);
	}

	public List<AddressBookResponse> getAddressBookByCenter(Long centerId) {
		return addressBookJpaRepository.getAddressBookByCenter(centerId);
	}
}
