package com.ssafy.hangbokdog.member.domain;

import java.time.LocalDate;
import java.time.Period;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private Long id;

    @Column(name = "nick_name", nullable = false, length = 64, unique = true)
    private String nickName;

    @Column(name = "name", length = 64)
    private String name;

    @Column(name = "birth")
    private LocalDate birth;

    @Column(name = "phone")
    private String phone;

    @Column(name = "age")
    private int age;

    @Column(name = "social_id", nullable = false, length = 256)
    private String socialId;

    @Enumerated(EnumType.STRING)
    private Grade grade;

    @Enumerated(EnumType.STRING)
    private MemberStatus status;

    @Column(name = "description", length = 1024)
    private String description;

    @Column(name = "deleted", nullable = false)
    private boolean deleted;

    @Column(name = "dark_mode_check", nullable = false)
    private boolean darkModeCheck;

    @Column(name = "emergency_notification_check", nullable = false)
    private boolean emergencyNotificationCheck;

    @Column(name = "fcm_token")
    private String fcmToken;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "profile_image", nullable = false)
    private String profileImage;

    @Builder
    public Member(
            Long id,
            String nickName,
            String name,
            LocalDate birth,
            String socialId,
            String profileImage,
            String email,
            String description,
            int age
    ) {
        this.id = id;
        this.nickName = nickName;
        this.name = name;
        this.birth = birth;
        this.socialId = socialId;
        this.profileImage = profileImage;
        this.email = email;
        this.emergencyNotificationCheck = false;
        this.darkModeCheck = false;
        this.deleted = false;
        this.status = MemberStatus.INACTIVE;
        this.description = description;
        this.grade = Grade.GUEST;
        this.age = age;
    }

    public boolean isAdmin() {
        return grade == Grade.ADMIN;
    }

    public boolean isManager() {
        return grade == Grade.MANAGER;
    }

    public boolean isGuest() {
        return grade == Grade.GUEST;
    }

    public void signUp(
            String name,
            String nickname,
            LocalDate birth,
            int age,
            String description
    ) {
        this.name = name;
        this.nickName = nickname;
        this.birth = birth;
        this.age = age;
        this.description = description;
        this.grade = Grade.USER;
    }

    public boolean isAdult() {
        return Period.between(birth, LocalDate.now()).getYears() >= 20;
    }

    public void updateFcmToken(String fcmToken) {
        this.fcmToken = fcmToken;
    }

    public void agreeEmergencyNotification() {
        if (emergencyNotificationCheck) {
            throw new BadRequestException(ErrorCode.EMERGENCY_NOTIFICATION_ALREADY_AGREED);
        }
        emergencyNotificationCheck = true;
    }

    public void denyEmergencyNotification() {
        if (!emergencyNotificationCheck) {
            throw new BadRequestException(ErrorCode.EMERGENCY_NOTIFICATION_ALREADY_DISAGREED);
        }
        emergencyNotificationCheck = false;
    }
}
