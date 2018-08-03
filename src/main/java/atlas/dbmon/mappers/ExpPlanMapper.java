package atlas.dbmon.mappers;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import atlas.dbmon.data.ExpPlan;

public class ExpPlanMapper  implements RowMapper<ExpPlan> {

	@Override
	public ExpPlan mapRow(ResultSet rs, int rownum) throws SQLException {
		ExpPlan ep = new ExpPlan();
		ep.setPlan_table_output(rs.getString("plan_table_output"));
		return ep;
	}

}
