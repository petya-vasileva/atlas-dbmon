package atlas.dbmon.mappers;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import atlas.dbmon.data.BasicInfo;

public class BasicInfoMapper implements RowMapper<BasicInfo> {

	@Override
	public BasicInfo mapRow(ResultSet rs, int rownum) throws SQLException {
		BasicInfo bi = new BasicInfo();
		
		bi.setMetric(rs.getString("metric"));
		bi.setUnit(rs.getString("unit"));
		bi.setInstid(rs.getInt("instid"));
		bi.setThreshold(rs.getInt("threshold"));
		bi.setMetricAvgCount(rs.getInt("metricAvgCount"));
		bi.setVisible(rs.getString("visible"));
		
		return bi;
	}

}
