package atlas.dbmon.mappers;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import atlas.dbmon.data.SchemaDetailsInfo;

public class SchemaDetailsMapper implements RowMapper<SchemaDetailsInfo> {

	@Override
	public SchemaDetailsInfo mapRow(ResultSet rs, int rownum) throws SQLException {
		SchemaDetailsInfo sd = new SchemaDetailsInfo();
		sd.setUserName(rs.getString("username"));
		sd.setRespName(rs.getString("resp_name"));
		sd.setRespEmail(rs.getString("resp_email"));
		sd.setAccountStatus(rs.getString("account_status"));
		sd.setPasswordExpiryDate(rs.getString("password_expiry_date"));
		sd.setEgroup(rs.getString("egroup"));
		return sd;
	}
}
