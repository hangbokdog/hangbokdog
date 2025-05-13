package com.ssafy.hangbokdog.center.addressbook.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.center.addressbook.domain.AddressBook;
import com.ssafy.hangbokdog.center.addressbook.dto.response.AddressBookResponse;
import com.ssafy.hangbokdog.vaccination.dto.LocationInfo;

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

	public void deleteById(Long id) {
		addressBookJpaRepository.deleteById(id);
	}

	public List<LocationInfo> getLocationInfosIn(List<Long> locationIds) {
		return addressBookJpaRepository.getLocationInfosIn(locationIds);
	}
}
