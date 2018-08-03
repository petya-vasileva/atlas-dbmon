package atlas.dbmon.mappers;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import atlas.dbmon.data.StorageInfo;


public class StorageInfoMapper implements RowMapper<StorageInfo> {

	@Override
	public StorageInfo mapRow(ResultSet rs, int rownum) throws SQLException {
		StorageInfo si = new StorageInfo();
		si.setDt(rs.getString("dt"));
		si.setTableSize(rs.getDouble("table_size"));
		si.setIndexSize(rs.getDouble("index_size"));
		return si;
	}

}
