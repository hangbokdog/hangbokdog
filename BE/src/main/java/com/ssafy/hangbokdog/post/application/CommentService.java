package com.ssafy.hangbokdog.post.application;

import org.springframework.stereotype.Service;

import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.post.domain.Comment;
import com.ssafy.hangbokdog.post.domain.repository.CommentRepository;
import com.ssafy.hangbokdog.post.dto.request.CommentCreateRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;

    public Long save(
            Member member,
            Long postId,
            CommentCreateRequest request
    ) {
        Comment newComment = Comment.builder()
                .authorId(member.getId())
                .postId(postId)
                .parentId(request.parentId())
                .content(request.content())
                .build();

        return commentRepository.save(newComment).getId();
    }
}
