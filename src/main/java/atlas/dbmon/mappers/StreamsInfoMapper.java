package atlas.dbmon.mappers;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import atlas.dbmon.data.StreamsInfo;

public class StreamsInfoMapper implements RowMapper<StreamsInfo> {

	@Override
	public StreamsInfo mapRow(ResultSet rs, int rownum) throws SQLException {
		StreamsInfo si = new StreamsInfo();

		si.setMetric_value(rs.getInt("metric_value"));
		si.setT_stamp(rs.getTimestamp("t_stamp"));

		return si;
	}

}
