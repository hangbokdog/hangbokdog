package com.ssafy.hangbokdog.common.dto;

public record MaskRequest(
        boolean disableMasking
) implements MaskingDto {
    @Override
    public boolean getDisableMasking() {
        return disableMasking;
    }
}
