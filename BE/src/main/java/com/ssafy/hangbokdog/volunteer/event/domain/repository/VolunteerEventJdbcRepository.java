package com.ssafy.hangbokdog.volunteer.event.domain.repository;

import java.util.List;

import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class VolunteerEventJdbcRepository {

    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    public void updateExpiredStatusInIds(List<Long> volunteerEventIds) {
        if (volunteerEventIds.isEmpty()) {
            return;
        }

        String sql = "UPDATE volunteer_event SET volunteer_event.status = 'EXPIRED' "
                + "WHERE volunteer_event.volunteer_event_id IN (:volunteerEventIds)";

        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("volunteerEventIds", volunteerEventIds);
        namedParameterJdbcTemplate.update(sql, params);
    }
}
