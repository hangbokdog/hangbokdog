package com.ssafy.hangbokdog.post.post.domain;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import org.hibernate.annotations.Type;

import com.ssafy.hangbokdog.common.entity.BaseEntity;
import com.ssafy.hangbokdog.member.domain.Member;
import com.vladmihalcea.hibernate.type.json.JsonType;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Post extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id")
    private Long id;

    @Column(name = "author_id", nullable = false)
    private Long authorId;

    @Column(name = "center_id", nullable = false)
    private Long centerId;

    @Column(name = "post_type_id", nullable = false)
    private Long postTypeId;

    @Column(name = "dog_id")
    private Long dogId;

    @Column(nullable = false, length = 100)
    private String title;

    @Type(JsonType.class)
    @Column(columnDefinition = "json")
    private List<String> imageUrls;

    @Column(nullable = false)
    private String content;

    @Builder
    public Post(
        Long centerId,
        Long authorId,
        Long boardTypeId,
        Long dogId,
        String title,
        String content,
        List<String> imageUrls
    ) {
        this.centerId = centerId;
        this.authorId = authorId;
        this.postTypeId = boardTypeId;
        this.dogId = dogId;
        this.title = title;
        this.content = content;
        this.imageUrls = imageUrls;
    }

    public boolean isAuthor(Member member) {
        return authorId.equals(member.getId());
    }

    public void update(
            Long dogId,
            String title,
            String content,
            List<String> imageUrls
    ) {
        this.dogId = dogId;
        this.title = title;
        this.content = content;
        this.imageUrls = imageUrls;
    }
}
