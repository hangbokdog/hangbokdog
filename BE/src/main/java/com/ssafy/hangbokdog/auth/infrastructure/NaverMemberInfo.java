package com.ssafy.hangbokdog.auth.infrastructure;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;

@Getter
public class NaverMemberInfo {

    @JsonProperty("resultcode")
    private String resultCode;

    @JsonProperty("message")
    private String message;

    @JsonProperty("response")
    private Response response;

    public String getSocialId() {
        return response.id;
    }

    public String getEmail() {
        return response.email;
    }

    public String getNickname() {
        return response.nickname;
    }

    public String getProfileImageUrl() {
        return response.profileImage;
    }

    private static class Response {
        @JsonProperty("email")
        private String email;

        @JsonProperty("nickname")
        private String nickname;

        @JsonProperty("profile_image")
        private String profileImage;

        @JsonProperty("id")
        private String id;
    }
}
