package com.ssafy.hangbokdog.post.comment.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import com.ssafy.hangbokdog.common.entity.BaseEntity;
import com.ssafy.hangbokdog.member.domain.Member;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Comment extends BaseEntity {

    private static final String DELETED_CONTENT = "삭제된 댓글입니다";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    private Long id;

    @Column(name = "author_id", nullable = false)
    private Long authorId;

    @Column(name = "post_id", nullable = false)
    private Long postId;

    @Column(name = "parent_comment_id")
    private Long parentId;

    @Column(nullable = false)
    private String content;

    @Column(name = "is_deleted", nullable = false)
    private boolean isDeleted;

    @Builder
    public Comment(
            Long authorId,
            Long postId,
            Long parentId,
            String content
    ) {
        this.authorId = authorId;
        this.postId = postId;
        this.parentId = parentId;
        this.content = content;
        this.isDeleted = false;
    }

    public boolean isAuthor(Member member) {
        return authorId.equals(member.getId());
    }

    public void update(String newContent) {
        this.content = newContent;
    }

    public void delete() {
        this.content = DELETED_CONTENT;
        this.isDeleted = true;
    }
}
