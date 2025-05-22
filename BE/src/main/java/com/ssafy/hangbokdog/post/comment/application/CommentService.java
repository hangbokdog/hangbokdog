package com.ssafy.hangbokdog.post.comment.application;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.post.comment.domain.Comment;
import com.ssafy.hangbokdog.post.comment.domain.repository.CommentRepository;
import com.ssafy.hangbokdog.post.comment.dto.CommentInfo;
import com.ssafy.hangbokdog.post.comment.dto.CommentLikeInfo;
import com.ssafy.hangbokdog.post.comment.dto.request.CommentCreateRequest;
import com.ssafy.hangbokdog.post.comment.dto.request.CommentUpdateRequest;
import com.ssafy.hangbokdog.post.comment.dto.response.CommentResponse;
import com.ssafy.hangbokdog.post.comment.dto.response.CommentWithRepliesResponse;

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

    public List<CommentWithRepliesResponse> findAllByPostId(Long postId, Member member) {
        List<CommentInfo> flat = commentRepository.findAllByPostId(postId, member.getId());

        Map<Long, Integer> commentLikes = commentRepository.findCommentLikeByPostId(postId).stream()
            .collect(Collectors.toMap(
                CommentLikeInfo::commentId,
                CommentLikeInfo::count
            ));

        List<Long> commentLikeIds = commentRepository.getCommentLikeIdsByMemberId(member.getId());

        List<CommentResponse> newFlat = new ArrayList<>();

        for (CommentInfo info : flat) {
            boolean isLiked = commentLikeIds.contains(info.id());

            CommentResponse response = new CommentResponse(
                info.author(),
                info.isAuthor(),
                info.id(),
                info.parentId(),
                info.content(),
                info.isDeleted(),
                info.createdAt(),
                isLiked,
                commentLikes.getOrDefault(info.id(), 0)
            );

            newFlat.add(response);
        }

        Map<Long, List<CommentResponse>> byParent = newFlat.stream()
            .filter(cr -> cr.parentId() != null)
            .collect(Collectors.groupingBy(CommentResponse::parentId));

        return newFlat.stream()
            .filter(cr -> cr.parentId() == null)
            .map(root -> buildTree(root, byParent))
            .collect(Collectors.toList());
    }

    public CommentResponse findById(Long commentId, Member member) {
        return commentRepository.findByCommentId(commentId, member.getId());
    }

    @Transactional
    public void update(
            Member member,
            Long commentId,
            CommentUpdateRequest request
    ) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new BadRequestException(ErrorCode.COMMENT_NOT_FOUND));

        if (!comment.isAuthor(member)) {
            throw new BadRequestException(ErrorCode.COMMENT_NOT_AUTHOR);
        }

        comment.update(request.content());
    }

    @Transactional
    public void delete(Member member, Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new BadRequestException(ErrorCode.COMMENT_NOT_FOUND));

        if (!comment.isAuthor(member)) {
            throw new BadRequestException(ErrorCode.COMMENT_NOT_AUTHOR);
        }

        if (comment.isDeleted()) {
            throw new BadRequestException(ErrorCode.COMMENT_ALREADY_DELETED);
        }

        // 실제 삭제 대신 내용만 변경
        comment.delete();
    }

    private CommentWithRepliesResponse buildTree(
            CommentResponse dto,
            Map<Long, List<CommentResponse>> byParent
    ) {
        List<CommentWithRepliesResponse> replies = byParent.getOrDefault(dto.id(), Collections.emptyList()).stream()
                .map(child -> buildTree(child, byParent))
                .collect(Collectors.toList());

        return new CommentWithRepliesResponse(dto, replies);
    }
}
