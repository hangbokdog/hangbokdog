package com.ssafy.hangbokdog.dog.comment.presentation;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.hangbokdog.auth.annotation.AuthMember;
import com.ssafy.hangbokdog.dog.comment.application.DogCommentService;
import com.ssafy.hangbokdog.dog.comment.dto.request.DogCommentCreateRequest;
import com.ssafy.hangbokdog.dog.comment.dto.request.DogCommentUpdateRequest;
import com.ssafy.hangbokdog.dog.comment.dto.response.DogCommentCreateResponse;
import com.ssafy.hangbokdog.dog.comment.dto.response.DogCommentWithRepliesResponse;
import com.ssafy.hangbokdog.member.domain.Member;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class DogCommentController {

	private final DogCommentService dogCommentService;

	@PostMapping("/{dogId}/comments")
	public ResponseEntity<DogCommentCreateResponse> create(
		@AuthMember Member member,
		@PathVariable("dogId") Long dogId,
		@RequestBody DogCommentCreateRequest request
	) {
		return ResponseEntity.ok(new DogCommentCreateResponse(dogCommentService.save(member, dogId, request)));
	}

	@GetMapping("/{dogId}/comments")
	public ResponseEntity<List<DogCommentWithRepliesResponse>> getDogComments(
		@PathVariable("dogId") Long dogId,
		@AuthMember Member member
	) {
		List<DogCommentWithRepliesResponse> responses = dogCommentService.findAllByDogId(dogId, member.getId());
		return ResponseEntity.ok(responses);
	}

	@PatchMapping("/{dogId}/comments/{dogCommentId}")
	public ResponseEntity<Void> update(
		@AuthMember Member member,
		@PathVariable("dogId") Long dogId,
		@PathVariable("dogCommentId") Long dogCommentId,
		@RequestBody DogCommentUpdateRequest request
	) {
		dogCommentService.update(member, dogCommentId, request);
		return ResponseEntity.noContent().build();
	}

	@DeleteMapping("/{dogId}/comments/{dogCommentId}")
	public ResponseEntity<Void> delete(
		@AuthMember Member member,
		@PathVariable("dogId") Long dogId,
		@PathVariable("dogCommentId") Long dogCommentId
	) {
		dogCommentService.delete(member, dogCommentId);
		return ResponseEntity.noContent().build();
	}
}
