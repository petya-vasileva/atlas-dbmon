package atlas.dbmon.mappers;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import atlas.dbmon.data.MetricHist;

public class MetricHistMapper implements RowMapper<MetricHist> {

	@Override
	public MetricHist mapRow(ResultSet rs, int rownum) throws SQLException {
		MetricHist mh = new MetricHist();
		mh.settStamp(rs.getTimestamp("t_stamp"));
		mh.setHour(rs.getString("hour"));
		mh.setMins(rs.getString("mins"));
		mh.setMetric(rs.getString("metric"));
		mh.setVal(rs.getInt("val"));
		
		return mh;
	}
}
