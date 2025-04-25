package com.ssafy.hangbokdog.post.comment.application;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.post.comment.domain.Comment;
import com.ssafy.hangbokdog.post.comment.domain.repository.CommentRepository;
import com.ssafy.hangbokdog.post.comment.dto.request.CommentCreateRequest;
import com.ssafy.hangbokdog.post.comment.dto.request.CommentUpdateRequest;
import com.ssafy.hangbokdog.post.post.domain.repository.PostRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

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

    @Transactional
    public void update(
            Member member,
            Long commentId,
            CommentUpdateRequest request
    ) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new BadRequestException(ErrorCode.COMMENT_NOT_FOUND));

        if (comment.isAuthor(member)) {
            throw new BadRequestException(ErrorCode.COMMENT_NOT_AUTHOR);
        }

        comment.update(request.content());
    }

    @Transactional
    public void delete(Member member, Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new BadRequestException(ErrorCode.COMMENT_NOT_FOUND));

        if (comment.isAuthor(member)) {
            throw new BadRequestException(ErrorCode.COMMENT_NOT_AUTHOR);
        }

        if (comment.isDeleted()) {
            throw new BadRequestException(ErrorCode.COMMENT_ALREADY_DELETED);
        }

        // 실제 삭제 대신 내용만 변경
        comment.delete();
    }
}
