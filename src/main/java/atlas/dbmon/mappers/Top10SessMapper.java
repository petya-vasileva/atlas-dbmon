package atlas.dbmon.mappers;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.RowMapper;

import atlas.dbmon.data.Top10Sess;

public class Top10SessMapper implements RowMapper<Top10Sess>{
	private Logger log = LoggerFactory.getLogger(this.getClass());
	@Override
//	inst_id, chart_type, parsing_schema_name, sql_id as name, metric_value as y, metric_unit, sql_text
	public Top10Sess mapRow(ResultSet rs, int rownum) throws SQLException {
		Top10Sess ts = new Top10Sess();
		ts.setInstId(rs.getInt("inst_id"));
		ts.setChartType(rs.getString("chart_type"));
		ts.setParsingSchema(rs.getString("parsing_schema_name"));
		ts.setName(rs.getString("name"));
		ts.setY(rs.getFloat("y"));
		ts.setMetricUnit(rs.getString("metric_unit"));
		ts.setSqlText(rs.getString("sql_text"));
		
		return ts;
	}
}
