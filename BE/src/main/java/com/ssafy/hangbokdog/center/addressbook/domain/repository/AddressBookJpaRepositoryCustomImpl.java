package com.ssafy.hangbokdog.center.addressbook.domain.repository;

import static com.ssafy.hangbokdog.center.addressbook.domain.QAddressBook.*;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.center.addressbook.dto.response.AddressBookResponse;

import com.ssafy.hangbokdog.vaccination.dto.LocationInfo;
import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class AddressBookJpaRepositoryCustomImpl implements AddressBookJpaRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	@Override
	public List<AddressBookResponse> getAddressBookByCenter(Long centerId) {
		return queryFactory
			.select(Projections.constructor(
				AddressBookResponse.class,
				addressBook.id,
				addressBook.addressName,
				addressBook.address
			))
			.from(addressBook)
			.where(addressBook.centerId.eq(centerId))
			.fetch();
	}

	@Override
	public List<LocationInfo> getLocationInfosIn(List<Long> locationIds) {
		return queryFactory
			.select(Projections.constructor(
				LocationInfo.class,
				addressBook.id,
				addressBook.addressName
			))
			.from(addressBook)
			.where(addressBook.id.in(locationIds))
			.fetch();
	}
}
