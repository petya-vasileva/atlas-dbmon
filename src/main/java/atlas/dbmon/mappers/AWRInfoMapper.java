package atlas.dbmon.mappers;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import atlas.dbmon.data.AWRInfo;

public class AWRInfoMapper implements RowMapper<AWRInfo> {

	@Override
	public AWRInfo mapRow(ResultSet rs, int rownum) throws SQLException {
		AWRInfo awr = new AWRInfo();

		awr.setInst(rs.getInt("inst"));
		awr.setApp_wait(rs.getInt("app_wait"));
		awr.setBegin_time(rs.getString("begin_time"));
		awr.setBuffer_gets(rs.getLong("buffer_gets"));
		awr.setCluster_wait(rs.getInt("cluster_wait"));
		awr.setConcurrency(rs.getInt("concurrency"));
		awr.setCpu_time(rs.getInt("cpu_time"));
		awr.setDirect_writes(rs.getLong("direct_writes"));
		awr.setDisk_reads(rs.getLong("disk_reads"));
		awr.setElapsed_time(rs.getInt("elapsed_time"));
		awr.setEtime_per_exec(rs.getLong("etime_per_exec"));
		awr.setExecs(rs.getLong("execs"));
		awr.setFetches(rs.getLong("fetches"));
		awr.setInvalid(rs.getInt("invalid"));
		awr.setIowait(rs.getInt("iowait"));
		awr.setPlan_hash_value(rs.getLong("plan_hash_value"));
		awr.setLoads(rs.getLong("loads"));
		awr.setModule(rs.getString("module"));
		awr.setParse_calls(rs.getLong("parse_calls"));
		awr.setParsing_schema_name(rs.getString("parsing_schema_name"));
		awr.setPlsql_time(rs.getInt("plsql_time"));
		awr.setPxexecs(rs.getLong("pxexecs"));
		awr.setRows_proc(rs.getLong("rows_proc"));
		awr.setSorts(rs.getLong("sorts"));

		return awr;
	}

}