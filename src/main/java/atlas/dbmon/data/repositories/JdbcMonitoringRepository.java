/**
 * 
 */
package atlas.dbmon.data.repositories;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import atlas.dbmon.data.AWRInfo;
import atlas.dbmon.data.BasicInfo;
import atlas.dbmon.data.BlockingSess;
import atlas.dbmon.data.ExpPlan;
import atlas.dbmon.data.JobsInfo;
import atlas.dbmon.data.SchemaDetailsInfo;
import atlas.dbmon.data.SchemaSessDetails;
import atlas.dbmon.data.SchemaSessions;
import atlas.dbmon.data.SessionInfo;
import atlas.dbmon.data.StorageInfo;
import atlas.dbmon.data.StreamsInfo;
import atlas.dbmon.data.Top10Sess;
import atlas.dbmon.mappers.AWRInfoMapper;
import atlas.dbmon.mappers.BasicInfoMapper;
import atlas.dbmon.mappers.BlockingSessMapper;
import atlas.dbmon.mappers.ExpPlanMapper;
import atlas.dbmon.mappers.JobsInfoMapper;
import atlas.dbmon.mappers.SchemaDetailsMapper;
import atlas.dbmon.mappers.SchemaSessDetailsMapper;
import atlas.dbmon.mappers.SchemaSessesionsMapper;
import atlas.dbmon.mappers.SessionInfoMapper;
import atlas.dbmon.mappers.StorageInfoMapper;
import atlas.dbmon.mappers.StreamsInfoMapper;
import atlas.dbmon.mappers.Top10SessMapper;
/**
 * @author formica
 *
 */
@Repository
public class JdbcMonitoringRepository {

	private Logger log = LoggerFactory.getLogger(this.getClass());
	
	
	@Autowired
	@Qualifier("jdbcMainTemplate")
	private JdbcTemplate jdbcTemplate;
	
	/**
	 * @param db
	 * @param nminutes: dividing by 24*60 we subtract minutes, we cannot compute this before, the DB has to do it
	 *            5/(24*60)
	 * @return list of database metrics
	 * @throws Exception
	 */
	public List<BasicInfo> selectBasicInfo(String dbname, Integer nminutes) throws Exception {
		//JdbcTemplate jdbcTemplate = new JdbcTemplate(ds);
		String sql;
		try {
			sql = "select distinct round(avg(dbhm.METRIC_VALUE) over (partition by dbhm.metric_id, dbhm.inst_id)) as metricAvgCount, "
					+ " dbhm.inst_id as instid, dbmd.METRIC_NAME as metric, dbmd.METRIC_UNIT as unit, dbmt.threshold as threshold, "
					+ " dbmd.homepage_visible AS visible "
					+ " from ATLAS_DBMON.DB_HIST_METRICS dbhm "
					+ " join ATLAS_DBMON.DB_METRIC_DESC dbmd on dbhm.metric_id=dbmd.metric_id "
					+ " join ATLAS_DBMON.DB_METRICS_THRESHOLD dbmt on (dbhm.metric_id=dbmt.metric_id and dbhm.dbname = dbmt.dbname) "
					+ " WHERE t_stamp > sysdate - (? /(24*60)) AND UPPER(dbhm.dbname) = UPPER(?) "
					+ " order by dbhm.inst_id";
			log.debug("Execute query " + sql + " using " + nminutes + " " + dbname);
			return jdbcTemplate.query(sql, new Object[] { nminutes, dbname }, new BasicInfoMapper());
		} catch (EmptyResultDataAccessException emptyResultDataAccessException) {
			throw emptyResultDataAccessException;
		} catch (Exception e) {
			throw e;
		}
	} 

	/**
	 * @param db
	 * @param nminutes: dividing by 24*60 we subtract minutes, we cannot compute this before, the DB has to do it
	 *            5/(24*60)
	 * @return list of database metrics
	 * @throws Exception
	 */
	public List<StreamsInfo> selectStreamsInfo(String db, Integer node, Integer id, String from, String to) throws Exception {
		//JdbcTemplate jdbcTemplate = new JdbcTemplate(ds);
		String sql;
		try {
			sql = "SELECT t_stamp, metric_value "
					+ "FROM ATLAS_DBMON.DB_HIST_METRICS "
					+ "WHERE T_STAMP >= TO_DATE((:fromDate), 'YYYY-MM-DD\"T\"HH24:MI') "
					+ "AND T_STAMP < TO_DATE((:toDate), 'YYYY-MM-DD\"T\"HH24:MI') "
					+ "AND dbname = UPPER(:db) AND METRIC_ID = :id AND INST_ID = :node "
					+ "order by 1";
			return jdbcTemplate.query(sql, new Object[] { from, to, db, id, node }, new StreamsInfoMapper());
		} catch (EmptyResultDataAccessException emptyResultDataAccessException) {
			throw emptyResultDataAccessException;
		} catch (Exception e) {
			throw e;
		}
	} 

	/**
	 * @param db
	 * @param period in minutes
	 * @return SQL details that will be displayed in charts
	 * @throws Exception
	 */
	public List<Top10Sess> selectTop10Sess(String db, String from, String to) throws Exception {
		//JdbcTemplate namedParameterJdbcTemplate = new JdbcTemplate(ds);
		String sql;
		try {
        	List<Top10Sess> top10 = null;

        	sql = "select inst_id, chart_type, parsing_schema_name, sql_id as name, metric_value as y, metric_unit, sql_text "
					+ "from table(ATLAS_DBMON.GET_TOP10_SESSIONS_DATA(:db, :fromDate, :toDate))";

			log.debug("Execute query " + sql + " using " + db + " and period from " + from + " to " + to);

		    top10 = jdbcTemplate.query(sql, new Object[] { db, from, to }, new Top10SessMapper());
		    log.debug("Retrived " + top10);
			log.debug("Execute query " + sql + " using " + from + " " + to);
		    return top10;
		}catch (Exception e) {
			throw e;
		}
	}
	
	/**
	 * @param db
	 * @return list of metrics about sessions
	 * @throws Exception
	 */
	public List<SessionInfo> selectSessionInfo(String db) throws Exception {
		//JdbcTemplate jdbcTemplate = new JdbcTemplate(ds);
		String sql;
		try {
			sql = "select node_id, username, num_active_sess, num_sess, sess_limit, t_stamp "
					+ "from table(ATLAS_DBMON.GET_SESS_DISTRIBUTION_DATA((:db)))";
			log.debug("Execute query " + sql + " using " + db);
			return jdbcTemplate.query(sql, new Object[] { db }, new SessionInfoMapper());
		} catch (EmptyResultDataAccessException emptyResultDataAccessException) {
			throw emptyResultDataAccessException;
		} catch (Exception e) {
			throw e;
		}
	} 
	
	/**
	 * @param db, schema, fromDate, toDate
	 * @return active/total sessions for a given schema and period
	 * @throws Exception
	 */
	public List<SessionInfo> selectSessionChartInfo(String db, String schema, String fromDate, String toDate,
																					Integer node) throws Exception {
		String sql;
		try {
			sql = "select * from table(ATLAS_DBMON.GET_SESSIONS_CHART_DATA(:db, :schema, :fromDate, :toDate, :node))";
			log.debug("Execute query " + sql + " using " + db);
			return jdbcTemplate.query(sql, new Object[] { db, schema, fromDate, toDate, node},
																						new SessionInfoMapper());
		} catch (EmptyResultDataAccessException emptyResultDataAccessException) {
			throw emptyResultDataAccessException;
		} catch (Exception e) {
			throw e;
		}
	}

	/**
	 * @param dbName, sqlId
	 * @return current active plan and pre-formatted tabular explain plan
	 * @throws Exception
	 */
	public List<ExpPlan> selectExpPlan(String db, String sqlId) throws Exception {
		//JdbcTemplate jdbcTemplate = new JdbcTemplate(ds);
		String sql;
		try {
			sql = "select * from table(ATLAS_DBMON.GET_EXP_PLAN_DATA((:sqlId), (:db)))";

			log.debug("Execute query " + sql + " using " + db + ", " + sqlId);
			return jdbcTemplate.query(sql, new Object[] { sqlId, db }, new ExpPlanMapper());
		} catch (EmptyResultDataAccessException emptyResultDataAccessException) {
			throw emptyResultDataAccessException;
		} catch (Exception e) {
			throw e;
		}
	}

	/**
	 * @param db
	 * @param sqlId
	 * @return Details about the execution of a query: how many times executed, how many blocks read, etc.
	 * @throws Exception
	 */
	public List<AWRInfo> selectAWRInfo(String db, String sqlId) throws Exception {
		//JdbcTemplate namedParameterJdbcTemplate = new JdbcTemplate(ds);
		String sql;
		try {
			List<AWRInfo> awr = null;

			sql = " select * from table(atlas_dbmon.GET_AWR_STATS4_SQLID(:db, :sqlId))";

			log.debug("Execute query " + sqlId + " using " + db );

			awr = jdbcTemplate.query(sql, new Object[] { db, sqlId }, new AWRInfoMapper());
		    return awr;
		}catch (Exception e) {
			throw e;
		}
	}

	/**
	 * @param dbName
	 * @return details about scheduler jobs
	 * @throws Exception
	 */
	public List<JobsInfo> selectJobsInfo(String db, String schema) throws Exception {
		//JdbcTemplate jdbcTemplate = new JdbcTemplate(ds);
		String sql;
		try {
			sql = "select OWNER, JOB_NAME, JOB_CLASS, TO_CHAR(LAST_START_DATE, 'DD-MM-YYYY HH24:MI:SS') as LAST_START_DATE, "
					+ "NVL(regexp_substr(LAST_RUN_DURATION, '\\d{1} \\d{2}:\\d{2}:\\d{2}.\\d{1}'), '-') as LAST_RUN_DURATION, "
					+ "LAST_STATUS, CURRENT_STATE, TO_CHAR(NEXT_RUN_TIME, 'DD-MM-YYYY HH24:MI:SS') as NEXT_RUN_TIME, REPEAT_INTERVAL, INFO  "
					+ "from ATLAS_DBMON.DB_SCHEDULER_JOBS where db_name = UPPER((:db)) AND OWNER like UPPER(:schema)"
					+ "and T_STAMP = (select max(t_stamp) "
								   + "from ATLAS_DBMON.DB_SCHEDULER_JOBS)";

			log.debug("Execute query " + sql + " using " + db);
			return jdbcTemplate.query(sql, new Object[] { db, schema }, new JobsInfoMapper());
		} catch (EmptyResultDataAccessException emptyResultDataAccessException) {
			throw emptyResultDataAccessException;
		} catch (Exception e) {
			throw e;
		}
	}

	/**
	 * @param  dbName, schema, year, showSchemas
	 * @return details about the database storage per schema name and overall
	 * @throws Exception
	 */
	public List<StorageInfo> selectStorageInfo(String db, String schema, int year) throws Exception {
		//JdbcTemplate jdbcTemplate = new JdbcTemplate(ds);
		String sql;
		try {
			sql = "SELECT DT, TABLE_SIZE, INDEX_SIZE "
					+ "FROM TABLE(ATLAS_DBMON.GET_STORAGE_DATA(:db, :schema, :year))";

			log.debug("Execute query " + sql + " using " + db + " " + " schema: " + schema + " year: " + year);
			return jdbcTemplate.query(sql, new Object[] { db, schema, year }, new StorageInfoMapper());
		} catch (EmptyResultDataAccessException emptyResultDataAccessException) {
			throw emptyResultDataAccessException;
		} catch (Exception e) {
			throw e;
		}
	}

	/**
	 * @param  db
	 * @return list of all schemas
	 * @throws Exception
	 */
	public List<String> selectAllSchemas(String db) throws Exception {
		//JdbcTemplate jdbcTemplate = new JdbcTemplate(ds);
		String sql = "SELECT schema_name FROM TABLE(ATLAS_DBMON.GET_ALL_SCHEMAS(:db))";
		try {
			List<String> schemas = new ArrayList<String>();
			schemas = jdbcTemplate.queryForList(sql,String.class, new Object[] {db});
//			List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql, db);
//			for (Map row : rows) {
//				schemas.add((String) row.get("schema_name"));
//			}
			return schemas;
		} catch (EmptyResultDataAccessException emptyResultDataAccessException) {
			throw emptyResultDataAccessException;
		} catch (Exception e) {
			throw e;
		}
	}


	/**
	 * @param  schema, db
	 * @return details about a single schema
	 * @throws Exception
	 */
	public List<SchemaDetailsInfo> selectSchemaDetails(String schema, String db) throws Exception {
		//JdbcTemplate jdbcTemplate = new JdbcTemplate(ds);
		String sql = "seLect username, resp_name, resp_email, account_status, password_expiry_date, egroup "
				+ "from table(atlas_dbmon.GET_SCHEMA_DETAILS(:schema, :db))";
		try {
			log.debug("Execute query " + sql + " using " + db + " " + " schema: " + schema);
			return jdbcTemplate.query(sql, new Object[] { schema, db }, new SchemaDetailsMapper());
		} catch (EmptyResultDataAccessException emptyResultDataAccessException) {
			throw emptyResultDataAccessException;
		} catch (Exception e) {
			throw e;
		}
	}


	/**
	 * @param  schema, db
	 * @return details about all sessions for a selected schema
	 * @throws Exception
	 */
	public List<SchemaSessions> selectSchemaSessions(String schema, String db) throws Exception {
		//JdbcTemplate jdbcTemplate = new JdbcTemplate(ds);
		String sql = "SELECT NODE_ID, USERNAME, NUM_ACTIVE_SESS, NUM_SESS, "
				+ "OSUSER, MACHINE, PROGRAM "
				+ "FROM ATLAS_DBMON.DB_SESS_DISTR "
				+ "WHERE db_name = UPPER(:db) AND USERNAME LIKE '"+schema+"%' "
				+ "AND t_stamp = (SELECT MAX(T_STAMP) "
				+ "				 FROM ATLAS_DBMON.DB_SESS_DISTR WHERE DB_NAME = UPPER(:db)) "
				+ "ORDER BY 4 desc";
		try {
			log.debug("Execute query " + sql + " using " + db + " " + " schema: " + schema);
			return jdbcTemplate.query(sql, new Object[] { db, db }, new SchemaSessesionsMapper());
		} catch (EmptyResultDataAccessException emptyResultDataAccessException) {
			throw emptyResultDataAccessException;
		} catch (Exception e) {
			throw e;
		}
	}


	/**
	 * @param  schema, db
	 * @return details about all sessions for a selected schema
	 * @throws Exception
	 */
	public List<SchemaSessDetails> selectSchemaSessDetails(String schema, String db) throws Exception {
		//JdbcTemplate jdbcTemplate = new JdbcTemplate(ds);
		String sql = "SELECT * FROM TABLE(ATLAS_DBMON.GET_SCHEMA_SESS_DETAILS(:db, :schema))";
		try {
			log.debug("Execute query " + sql + " using " + db + " " + " schema: " + schema);
			return jdbcTemplate.query(sql, new Object[] { db, schema }, new SchemaSessDetailsMapper());
		} catch (EmptyResultDataAccessException emptyResultDataAccessException) {
			throw emptyResultDataAccessException;
		} catch (Exception e) {
			throw e;
		}
	}


	/**
	 * @param db
	 * @param period in minutes
	 * @return SQL details that will be displayed in charts
	 * @throws Exception
	 */
	public List<Top10Sess> selectTop10SessPerSchema(String db, int node, String schema, String from, String to) throws Exception {
		//JdbcTemplate namedParameterJdbcTemplate = new JdbcTemplate(ds);
		String sql;
		try {
        	List<Top10Sess> top10 = null;

        	sql = "select inst_id, chart_type, parsing_schema_name, sql_id as name, metric_value as y, metric_unit, sql_text "
					+ "from table(ATLAS_DBMON.GET_TOP10_PER_SCHEMA(:db, :node, :schema, :fromDate, :toDate))";

			log.debug("Execute query " + sql + " using " + db + " and period from " + from + " to " + to);

		    top10 = jdbcTemplate.query(sql, new Object[] { db, node, schema, from, to }, new Top10SessMapper());
//		    log.debug("Retrived " + top10);
		    return top10;
		}catch (Exception e) {
			throw e;
		}
	}


	/**
	 * @param  schema, db
	 * @return list of the database nodes on which the application is executing queries
	 * @throws Exception
	 */
	public List<BigDecimal> selectSchemaSessNodes(String db, String schema) throws Exception {
		//JdbcTemplate jdbcTemplate = new JdbcTemplate(ds);
		String sql = "SELECT DISTINCT inst_id "
					+ "FROM TABLE(ATLAS_DBMON.GET_SCHEMA_SESS_DETAILS(:db, :schema)) "
					+ "ORDER BY inst_id";
		try {
			List<BigDecimal> schemas = new ArrayList<BigDecimal>();

			List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql, new Object[]{db, schema});
			for (Map row : rows) {
				schemas.add((BigDecimal)row.get("inst_id"));
			}
			return schemas;
		} catch (EmptyResultDataAccessException emptyResultDataAccessException) {
			throw emptyResultDataAccessException;
		} catch (Exception e) {
			throw e;
		}
	}
	
	/**
	 * @param db
	 * @return Details about blocking and blocked sessions
	 * @throws Exception
	 */
	public List<BlockingSess> selectBlockingSessions(String db, String fromDate, String toDate) throws Exception {
		//JdbcTemplate namedParameterJdbcTemplate = new JdbcTemplate(ds);
		String sql;
		try {
        	List<BlockingSess> bsessions = null;

        	sql = "SELECT * FROM TABLE(atlas_dbmon.get_blocking_sessions(:db, :fromDate, :toDate))";

		log.debug("Execute query " + sql + " using " + db );

		bsessions = jdbcTemplate.query(sql, new Object[] { db, fromDate, toDate }, new BlockingSessMapper());
	    return bsessions;
		}catch (Exception e) {
			throw e;
		}
	}

}
