package com.ssafy.hangbokdog.center.addressbook.domain.repository;

import java.util.List;

import com.ssafy.hangbokdog.center.addressbook.dto.response.AddressBookResponse;

public interface AddressBookJpaRepositoryCustom {

	List<AddressBookResponse> getAddressBookByCenter(Long centerId);
}
