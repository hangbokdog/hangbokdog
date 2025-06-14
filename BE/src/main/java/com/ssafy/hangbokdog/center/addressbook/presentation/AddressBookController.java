package com.ssafy.hangbokdog.center.addressbook.presentation;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.hangbokdog.auth.annotation.AuthMember;
import com.ssafy.hangbokdog.center.addressbook.application.AddressBookService;
import com.ssafy.hangbokdog.center.addressbook.dto.request.AddressBookRequest;
import com.ssafy.hangbokdog.center.addressbook.dto.response.AddressBookAppliedCountResponse;
import com.ssafy.hangbokdog.member.domain.Member;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/addressbooks")
@RequiredArgsConstructor
public class AddressBookController {

	private final AddressBookService addressBookService;

	@PostMapping
	public ResponseEntity<Void> addAddressBook(
		@AuthMember Member member,
		@RequestParam Long centerId,
		@RequestBody AddressBookRequest request
	) {
		addressBookService.save(request, centerId, member.getId());

		return ResponseEntity.ok().build();
	}

	@PatchMapping("/{addressBookId}")
	public ResponseEntity<Void> updateAddressBook(
		@AuthMember Member member,
		@RequestParam Long centerId,
		@PathVariable Long addressBookId,
		@RequestBody AddressBookRequest request
	) {
		addressBookService.update(request, centerId, member.getId(), addressBookId);

		return ResponseEntity.ok().build();
	}

	@GetMapping("/{centerId}")
	public ResponseEntity<List<AddressBookAppliedCountResponse>> getAddressBooks(
		@AuthMember Member member,
		@PathVariable Long centerId
	) {
		List<AddressBookAppliedCountResponse> response = addressBookService.getAddressBooks(centerId);
		return ResponseEntity.ok(response);
	}

	@DeleteMapping("/{addressBookId}")
	public ResponseEntity<Void> deleteAddressBook(
			@AuthMember Member member,
			@RequestParam Long centerId,
			@PathVariable Long addressBookId
	) {
		addressBookService.deleteAddressBook(member, addressBookId, centerId);
		return ResponseEntity.ok().build();
	}
}
