package com.ssafy.hangbokdog.center.domain.repository;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.center.domain.AddressBook;

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
}
