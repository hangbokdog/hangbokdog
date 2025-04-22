package com.ssafy.hangbokdog.post.domain;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import org.hibernate.annotations.Type;

import com.ssafy.hangbokdog.common.entity.BaseEntity;
import com.vladmihalcea.hibernate.type.json.JsonType;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Post extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long postId;

    @Column(nullable = false)
    private Long authorId;

    @Column(nullable = false)
    private Long boardTypeId;

    @Column(nullable = false, length = 100)
    private String title;

    @Type(JsonType.class)
    @Column(columnDefinition = "json")
    private List<String> images;

    @Column(nullable = false)
    private String content;
}
