package com.ssafy.hangbokdog.post.comment.domain.repository;

import static com.ssafy.hangbokdog.member.domain.QMember.member;
import static com.ssafy.hangbokdog.post.comment.domain.QComment.comment;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.member.dto.response.MemberInfo;
import com.ssafy.hangbokdog.post.comment.dto.response.CommentResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class CommentQueryRepositoryImpl implements CommentQueryRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<CommentResponse> findAllByPostId(Long postId, Long loginId) {
        return queryFactory
                .select(Projections.constructor(
                        CommentResponse.class,
                        // 1) author 정보
                        Projections.constructor(
                                MemberInfo.class,
                                member.id,
                                member.nickName,
                                member.grade.stringValue(),
                                member.profileImage
                        ),
                        // 2) isAuthor 계산
                        comment.authorId.eq(loginId),
                        // 3) CommentResponse 나머지 필드 순서대로
                        comment.id,
                        comment.parentId,
                        comment.content,
                        comment.isDeleted,
                        comment.createdAt
                ))
                .from(comment)
                .leftJoin(member).on(member.id.eq(comment.authorId))
                .where(comment.postId.eq(postId))
                .orderBy(comment.createdAt.asc())
                .fetch();
    }

    @Override
    public CommentResponse findByCommentId(Long commentId, Long loginId) {
        return queryFactory
                .select(Projections.constructor(
                        CommentResponse.class,
                        Projections.constructor(
                                MemberInfo.class,
                                member.id,
                                member.nickName,
                                member.grade.stringValue(),
                                member.profileImage
                        ),
                        comment.authorId.eq(loginId),
                        comment.id,
                        comment.parentId,
                        comment.content,
                        comment.isDeleted,
                        comment.createdAt
                ))
                .from(comment)
                .leftJoin(member).on(member.id.eq(comment.authorId))
                .where(comment.id.eq(commentId))
                .fetchOne();
    }
}
