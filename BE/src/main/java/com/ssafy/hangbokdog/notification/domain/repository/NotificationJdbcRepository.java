package com.ssafy.hangbokdog.notification.domain.repository;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.notification.domain.Notification;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class NotificationJdbcRepository {

	private JdbcTemplate jdbcTemplate;

	public void batchInsert(List<Notification> notifications) {
		String sql = "INSERT INTO notification (title, content, receiverId, isRead, type,"
				+ "created_at, modified_at) "
				+ "VALUES (?, ?, ?, ?, ?, NOW(), NOW())";
		jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {

			@Override
			public void setValues(PreparedStatement ps, int idx) throws SQLException {
				Notification notification = notifications.get(idx);
				ps.setString(1, notification.getTitle());
				ps.setString(2, notification.getContent());
				ps.setLong(3, notification.getReceiverId());
				ps.setBoolean(4, notification.getIsRead());
				ps.setString(5, notification.getType().toString());
			}

			@Override
			public int getBatchSize() {
				return notifications.size();
			}
		});
	}
}
