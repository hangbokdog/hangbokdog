package com.ssafy.hangbokdog.volunteer.application.domain.repository;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.volunteer.application.domain.VolunteerApplication;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class VolunteerApplicationJdbcRepository {

    private static final String BULK_INSERT_QUERY =
            "INSERT INTO "
            + "volunteer_application(volunteer_slot_id, status, member_id) "
            + "VALUES (?, ?, ?)";

    private final JdbcTemplate jdbcTemplate;

    public void bulkInsert(List<VolunteerApplication> applications) {
        jdbcTemplate.batchUpdate(BULK_INSERT_QUERY, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int index) throws SQLException {
                VolunteerApplication volunteerApplication = applications.get(index);
                ps.setLong(1, volunteerApplication.getVolunteerId());
                ps.setString(2, volunteerApplication.getStatus().name());
                ps.setLong(3, volunteerApplication.getMemberId());
            }

            @Override
            public int getBatchSize() {
                return applications.size();
            }
        });
    }
}
