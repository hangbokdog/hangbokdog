package com.ssafy.hangbokdog.center.addressbook.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.hangbokdog.center.addressbook.domain.AddressBook;

public interface AddressBookJpaRepository extends JpaRepository<AddressBook, Long>, AddressBookJpaRepositoryCustom {
}
