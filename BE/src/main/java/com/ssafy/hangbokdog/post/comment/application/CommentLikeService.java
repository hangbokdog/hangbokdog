package com.ssafy.hangbokdog.post.comment.application;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.post.comment.domain.CommentLike;
import com.ssafy.hangbokdog.post.comment.domain.repository.CommentLikeJpaRepository;
import com.ssafy.hangbokdog.post.comment.domain.repository.CommentRepository;
import com.ssafy.hangbokdog.post.comment.dto.response.CommentLikeResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentLikeService {

    private final CommentLikeJpaRepository commentLikeJpaRepository;
    private final CommentRepository commentRepository;

    @Transactional
    public CommentLikeResponse toggleLike(Long commentId, Member member) {
        commentRepository.findById(commentId)
                .orElseThrow(() -> new BadRequestException(ErrorCode.COMMENT_NOT_FOUND));

        boolean exists = commentLikeJpaRepository.existsByCommentIdAndMemberId(commentId, member.getId());

        if (exists) {
            commentLikeJpaRepository.deleteByCommentIdAndMemberId(commentId, member.getId());
            return new CommentLikeResponse(false);
        }

        CommentLike commentLike = CommentLike.builder()
                .commentId(commentId)
                .memberId(member.getId())
                .build();

        commentLikeJpaRepository.save(commentLike);

        return new CommentLikeResponse(true);
    }
}