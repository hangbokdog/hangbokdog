package com.ssafy.hangbokdog.center.domain.repository;

import java.util.List;

import com.ssafy.hangbokdog.center.dto.response.AddressBookResponse;

public interface AddressBookJpaRepositoryCustom {

	List<AddressBookResponse> getAddressBookByCenter(Long centerId);
}
