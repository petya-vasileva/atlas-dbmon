-- Script to create all necessary REST_Services on the ATLAS_DBMON user
BEGIN
-- Generated by Oracle SQL Developer REST Data Services 18.1.0.095.1630
-- Exported REST Definitions from ORDS Schema Version 3.0.11.180.12.34
-- Schema: ATLAS_DBMON   Date: Fri Aug 10 13:47:49 CEST 2018
--
BEGIN
  ORDS.ENABLE_SCHEMA(
      p_enabled             => TRUE,
      p_schema              => 'ATLAS_DBMON_R',
      p_url_mapping_type    => 'BASE_PATH',
      p_url_mapping_pattern => 'atlas_dbmon_r',
      p_auto_rest_auth      => FALSE);    

  ORDS.DEFINE_MODULE(
      p_module_name    => 'all_schemas',
      p_base_path      => '/all_schemas/',
      p_items_per_page =>  500,
      p_status         => 'PUBLISHED',
      p_comments       => NULL);      
  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'all_schemas',
      p_pattern        => ':db',
      p_priority       => 0,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);
  ORDS.DEFINE_HANDLER(
      p_module_name    => 'all_schemas',
      p_pattern        => ':db',
      p_method         => 'GET',
      p_source_type    => 'json/collection',
      p_items_per_page =>  500,
      p_mimes_allowed  => '',
      p_comments       => NULL,
      p_source         => 
'SELECT schema_name FROM TABLE(ATLAS_DBMON.GET_ALL_SCHEMAS(:db))'
      );


  COMMIT; 
END;

-- Generated by Oracle SQL Developer REST Data Services 18.1.0.095.1630
-- Exported REST Definitions from ORDS Schema Version 3.0.11.180.12.34
-- Schema: ATLAS_DBMON   Date: Fri Aug 10 13:48:21 CEST 2018
--
BEGIN
  ORDS.ENABLE_SCHEMA(
      p_enabled             => TRUE,
      p_schema              => 'ATLAS_DBMON_R',
      p_url_mapping_type    => 'BASE_PATH',
      p_url_mapping_pattern => 'atlas_dbmon_r',
      p_auto_rest_auth      => FALSE);    

  ORDS.DEFINE_MODULE(
      p_module_name    => 'awr_info',
      p_base_path      => '/awr_info/',
      p_items_per_page =>  500,
      p_status         => 'PUBLISHED',
      p_comments       => NULL);      
  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'awr_info',
      p_pattern        => ':db/:sqlID',
      p_priority       => 0,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);
  ORDS.DEFINE_HANDLER(
      p_module_name    => 'awr_info',
      p_pattern        => ':db/:sqlID',
      p_method         => 'GET',
      p_source_type    => 'json/collection',
      p_items_per_page =>  500,
      p_mimes_allowed  => '',
      p_comments       => NULL,
      p_source         => 
'select * from table(ATLAS_DBMON.GET_AWR_STATS4_SQLID(:db, :sqlID))'
      );


  COMMIT; 
END;

-- Generated by Oracle SQL Developer REST Data Services 18.1.0.095.1630
-- Exported REST Definitions from ORDS Schema Version 3.0.11.180.12.34
-- Schema: ATLAS_DBMON   Date: Fri Aug 10 13:48:34 CEST 2018
--
BEGIN
  ORDS.ENABLE_SCHEMA(
      p_enabled             => TRUE,
      p_schema              => 'ATLAS_DBMON_R',
      p_url_mapping_type    => 'BASE_PATH',
      p_url_mapping_pattern => 'atlas_dbmon_r',
      p_auto_rest_auth      => FALSE);    

  ORDS.DEFINE_MODULE(
      p_module_name    => 'basic_info',
      p_base_path      => '/basic_info/',
      p_items_per_page =>  300,
      p_status         => 'PUBLISHED',
      p_comments       => NULL);      
  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'basic_info',
      p_pattern        => ':dbnameq/:dateq',
      p_priority       => 0,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);
  ORDS.DEFINE_HANDLER(
      p_module_name    => 'basic_info',
      p_pattern        => ':dbnameq/:dateq',
      p_method         => 'GET',
      p_source_type    => 'json/collection',
      p_items_per_page =>  300,
      p_mimes_allowed  => '',
      p_comments       => NULL,
      p_source         => 
'SELECT * FROM
(
  select distinct round(avg(dbhm.METRIC_VALUE) over (partition by dbhm.metric_id, dbhm.inst_id)) as metricAvgCount, dbhm.inst_id as instid, 
    dbmd.METRIC_NAME as metric, dbmd.METRIC_UNIT as unit, dbmt.threshold as threshold, dbmd.homepage_visible AS visible, dbs.DBNODES as NrOfNodes  
	from ATLAS_DBMON.DB_HIST_METRICS dbhm  
	join ATLAS_DBMON.DB_METRIC_DESC dbmd on dbhm.metric_id=dbmd.metric_id  
	join ATLAS_DBMON.DB_METRICS_THRESHOLD dbmt on (dbhm.metric_id=dbmt.metric_id and dbhm.dbname = dbmt.dbname)
    left join ATLAS_DBMON.DATABASES dbs on dbhm.dbname = dbs.DBNAME
    WHERE t_stamp > sysdate - (:dateq /(24*60))  AND UPPER(dbhm.dbname) = UPPER(:dbnameq)
   order by dbhm.inst_id
)
PIVOT
(
  MAX(metricAvgCount)
  FOR instid IN (1,2,3,4)
)
ORDER BY metric'
      );


  COMMIT; 
END;

-- Generated by Oracle SQL Developer REST Data Services 18.1.0.095.1630
-- Exported REST Definitions from ORDS Schema Version 3.0.11.180.12.34
-- Schema: ATLAS_DBMON   Date: Fri Aug 10 13:48:46 CEST 2018
--
BEGIN
  ORDS.ENABLE_SCHEMA(
      p_enabled             => TRUE,
      p_schema              => 'ATLAS_DBMON_R',
      p_url_mapping_type    => 'BASE_PATH',
      p_url_mapping_pattern => 'atlas_dbmon_r',
      p_auto_rest_auth      => FALSE);    

  ORDS.DEFINE_MODULE(
      p_module_name    => 'exp_plan',
      p_base_path      => '/exp_plan/',
      p_items_per_page =>  500,
      p_status         => 'PUBLISHED',
      p_comments       => NULL);      
  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'exp_plan',
      p_pattern        => ':db/:sqlID',
      p_priority       => 9,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);
  ORDS.DEFINE_HANDLER(
      p_module_name    => 'exp_plan',
      p_pattern        => ':db/:sqlID',
      p_method         => 'GET',
      p_source_type    => 'json/collection',
      p_items_per_page =>  500,
      p_mimes_allowed  => '',
      p_comments       => NULL,
      p_source         => 
'select PLAN_TABLE_OUTPUT from table(ATLAS_DBMON.GET_EXP_PLAN_DATA((:sqlId), (:db)))'
      );


  COMMIT; 
END;

-- Generated by Oracle SQL Developer REST Data Services 18.1.0.095.1630
-- Exported REST Definitions from ORDS Schema Version 3.0.11.180.12.34
-- Schema: ATLAS_DBMON   Date: Fri Aug 10 13:48:57 CEST 2018
--
BEGIN
  ORDS.ENABLE_SCHEMA(
      p_enabled             => TRUE,
      p_schema              => 'ATLAS_DBMON_R',
      p_url_mapping_type    => 'BASE_PATH',
      p_url_mapping_pattern => 'atlas_dbmon_r',
      p_auto_rest_auth      => FALSE);    

  ORDS.DEFINE_MODULE(
      p_module_name    => 'jobs_info',
      p_base_path      => '/jobs_info/',
      p_items_per_page =>  250,
      p_status         => 'PUBLISHED',
      p_comments       => NULL);      
  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'jobs_info',
      p_pattern        => ':db/:schema',
      p_priority       => 0,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);
  ORDS.DEFINE_HANDLER(
      p_module_name    => 'jobs_info',
      p_pattern        => ':db/:schema',
      p_method         => 'GET',
      p_source_type    => 'json/collection',
      p_items_per_page =>  250,
      p_mimes_allowed  => '',
      p_comments       => NULL,
      p_source         => 
'SELECT  * FROM TABLE(ATLAS_DBMON.GET_JOBS_INFO(:db, :schema))'
      );


  COMMIT; 
END;

-- Generated by Oracle SQL Developer REST Data Services 18.1.0.095.1630
-- Exported REST Definitions from ORDS Schema Version 3.0.11.180.12.34
-- Schema: ATLAS_DBMON   Date: Fri Aug 10 13:49:08 CEST 2018
--
BEGIN
  ORDS.ENABLE_SCHEMA(
      p_enabled             => TRUE,
      p_schema              => 'ATLAS_DBMON_R',
      p_url_mapping_type    => 'BASE_PATH',
      p_url_mapping_pattern => 'atlas_dbmon_r',
      p_auto_rest_auth      => FALSE);    

  ORDS.DEFINE_MODULE(
      p_module_name    => 'schema_details',
      p_base_path      => '/schema_details/',
      p_items_per_page =>  500,
      p_status         => 'PUBLISHED',
      p_comments       => NULL);      
  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'schema_details',
      p_pattern        => ':db/:schema',
      p_priority       => 0,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);
  ORDS.DEFINE_HANDLER(
      p_module_name    => 'schema_details',
      p_pattern        => ':db/:schema',
      p_method         => 'GET',
      p_source_type    => 'json/collection',
      p_items_per_page =>  500,
      p_mimes_allowed  => '',
      p_comments       => NULL,
      p_source         => 
'select username, resp_name, resp_email, account_status, password_expiry_date, egroup
from table(ATLAS_DBMON.GET_SCHEMA_DETAILS(UPPER(:schema), :db))'
      );


  COMMIT; 
END;

-- Generated by Oracle SQL Developer REST Data Services 18.1.0.095.1630
-- Exported REST Definitions from ORDS Schema Version 3.0.11.180.12.34
-- Schema: ATLAS_DBMON   Date: Fri Aug 10 13:49:19 CEST 2018
--
BEGIN
  ORDS.ENABLE_SCHEMA(
      p_enabled             => TRUE,
      p_schema              => 'ATLAS_DBMON_R',
      p_url_mapping_type    => 'BASE_PATH',
      p_url_mapping_pattern => 'atlas_dbmon_r',
      p_auto_rest_auth      => FALSE);    

  ORDS.DEFINE_MODULE(
      p_module_name    => 'schema_session_details',
      p_base_path      => '/schema_session_details/',
      p_items_per_page =>  500,
      p_status         => 'PUBLISHED',
      p_comments       => NULL);      
  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'schema_session_details',
      p_pattern        => ':db/:schema',
      p_priority       => 0,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);
  ORDS.DEFINE_HANDLER(
      p_module_name    => 'schema_session_details',
      p_pattern        => ':db/:schema',
      p_method         => 'GET',
      p_source_type    => 'json/collection',
      p_items_per_page =>  500,
      p_mimes_allowed  => '',
      p_comments       => NULL,
      p_source         => 
'SELECT * FROM TABLE(ATLAS_DBMON.GET_SCHEMA_SESS_DETAILS(:db, :schema))'
      );


  COMMIT; 
END;

-- Generated by Oracle SQL Developer REST Data Services 18.1.0.095.1630
-- Exported REST Definitions from ORDS Schema Version 3.0.11.180.12.34
-- Schema: ATLAS_DBMON   Date: Fri Aug 10 13:49:34 CEST 2018
--
BEGIN
  ORDS.ENABLE_SCHEMA(
      p_enabled             => TRUE,
      p_schema              => 'ATLAS_DBMON_R',
      p_url_mapping_type    => 'BASE_PATH',
      p_url_mapping_pattern => 'atlas_dbmon_r',
      p_auto_rest_auth      => FALSE);    

  ORDS.DEFINE_MODULE(
      p_module_name    => 'schema_sessions',
      p_base_path      => '/schema_sessions/',
      p_items_per_page =>  300,
      p_status         => 'PUBLISHED',
      p_comments       => NULL);      
  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'schema_sessions',
      p_pattern        => ':db/:schema',
      p_priority       => 0,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);
  ORDS.DEFINE_HANDLER(
      p_module_name    => 'schema_sessions',
      p_pattern        => ':db/:schema',
      p_method         => 'GET',
      p_source_type    => 'json/collection',
      p_items_per_page =>  300,
      p_mimes_allowed  => '',
      p_comments       => NULL,
      p_source         => 
'SELECT NODE_ID, USERNAME, NUM_ACTIVE_SESS, NUM_SESS,
OSUSER, MACHINE, PROGRAM
FROM ATLAS_DBMON.DB_SESS_DISTR 
WHERE db_name = UPPER(:db) AND USERNAME LIKE  CONCAT( UPPER(:schema), ''%'' ) 
AND t_stamp = (SELECT MAX(T_STAMP) 
FROM ATLAS_DBMON.DB_SESS_DISTR WHERE DB_NAME = UPPER(:db))
ORDER BY 4 desc'
      );


  COMMIT; 
END;

-- Generated by Oracle SQL Developer REST Data Services 18.1.0.095.1630
-- Exported REST Definitions from ORDS Schema Version 3.0.11.180.12.34
-- Schema: ATLAS_DBMON   Date: Fri Aug 10 13:49:44 CEST 2018
--
BEGIN
  ORDS.ENABLE_SCHEMA(
      p_enabled             => TRUE,
      p_schema              => 'ATLAS_DBMON_R',
      p_url_mapping_type    => 'BASE_PATH',
      p_url_mapping_pattern => 'atlas_dbmon_r',
      p_auto_rest_auth      => FALSE);    

  ORDS.DEFINE_MODULE(
      p_module_name    => 'schema_sess_nodes',
      p_base_path      => '/schema_sess_nodes/',
      p_items_per_page =>  100,
      p_status         => 'PUBLISHED',
      p_comments       => NULL);      
  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'schema_sess_nodes',
      p_pattern        => ':db/:schema',
      p_priority       => 0,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);
  ORDS.DEFINE_HANDLER(
      p_module_name    => 'schema_sess_nodes',
      p_pattern        => ':db/:schema',
      p_method         => 'GET',
      p_source_type    => 'json/collection',
      p_items_per_page =>  100,
      p_mimes_allowed  => '',
      p_comments       => NULL,
      p_source         => 
'SELECT DISTINCT inst_id
FROM TABLE(ATLAS_DBMON.GET_SCHEMA_SESS_DETAILS(:db, :schema))
ORDER BY inst_id'
      );


  COMMIT; 
END;


-- Generated by Oracle SQL Developer REST Data Services 18.1.0.095.1630
-- Exported REST Definitions from ORDS Schema Version 3.0.11.180.12.34
-- Schema: ATLAS_DBMON   Date: Mon Aug 13 16:28:12 CEST 2018
--
BEGIN
  ORDS.ENABLE_SCHEMA(
      p_enabled             => TRUE,
      p_schema              => 'ATLAS_DBMON_R',
      p_url_mapping_type    => 'BASE_PATH',
      p_url_mapping_pattern => 'atlas_dbmon_r',
      p_auto_rest_auth      => FALSE);    

  ORDS.DEFINE_MODULE(
      p_module_name    => 'select_blocking_sessions',
      p_base_path      => '/select_blocking_sessions/',
      p_items_per_page =>  250,
      p_status         => 'PUBLISHED',
      p_comments       => NULL);      
  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'select_blocking_sessions',
      p_pattern        => ':db',
      p_priority       => 0,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);
  ORDS.DEFINE_HANDLER(
      p_module_name    => 'select_blocking_sessions',
      p_pattern        => ':db',
      p_method         => 'GET',
      p_source_type    => 'json/collection',
      p_items_per_page =>  250,
      p_mimes_allowed  => '',
      p_comments       => NULL,
      p_source         => 
'SELECT * FROM TABLE (atlas_dbmon.get_blocking_sessions(:db, NULL, NULL))'
      );
  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'select_blocking_sessions',
      p_pattern        => ':db/:fromDate/:toDate',
      p_priority       => 0,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);
  ORDS.DEFINE_HANDLER(
      p_module_name    => 'select_blocking_sessions',
      p_pattern        => ':db/:fromDate/:toDate',
      p_method         => 'GET',
      p_source_type    => 'json/collection',
      p_items_per_page =>  250,
      p_mimes_allowed  => '',
      p_comments       => NULL,
      p_source         => 
'SELECT * FROM TABLE (atlas_dbmon.get_blocking_sessions(:db, :fromDate, :toDate))'
      );


  COMMIT; 
END;

-- Generated by Oracle SQL Developer REST Data Services 18.1.0.095.1630
-- Exported REST Definitions from ORDS Schema Version 3.0.11.180.12.34
-- Schema: ATLAS_DBMON   Date: Fri Aug 10 13:50:03 CEST 2018
--
BEGIN
  ORDS.ENABLE_SCHEMA(
      p_enabled             => TRUE,
      p_schema              => 'ATLAS_DBMON_R',
      p_url_mapping_type    => 'BASE_PATH',
      p_url_mapping_pattern => 'atlas_dbmon_r',
      p_auto_rest_auth      => FALSE);    

  ORDS.DEFINE_MODULE(
      p_module_name    => 'session_chart_info',
      p_base_path      => '/session_chart_info/',
      p_items_per_page =>  250,
      p_status         => 'PUBLISHED',
      p_comments       => NULL);      
  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'session_chart_info',
      p_pattern        => ':db/:schema/:fromDate/:toDate/:node',
      p_priority       => 0,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);
  ORDS.DEFINE_HANDLER(
      p_module_name    => 'session_chart_info',
      p_pattern        => ':db/:schema/:fromDate/:toDate/:node',
      p_method         => 'GET',
      p_source_type    => 'json/collection',
      p_items_per_page =>  250,
      p_mimes_allowed  => '',
      p_comments       => NULL,
      p_source         => 
'select * from table(ATLAS_DBMON.GET_SESSIONS_CHART_DATA(:db, :schema, :fromDate, :toDate, :node))'
      );


  COMMIT; 
END;

-- Generated by Oracle SQL Developer REST Data Services 18.1.0.095.1630
-- Exported REST Definitions from ORDS Schema Version 3.0.11.180.12.34
-- Schema: ATLAS_DBMON   Date: Fri Aug 10 13:50:13 CEST 2018
--
BEGIN
  ORDS.ENABLE_SCHEMA(
      p_enabled             => TRUE,
      p_schema              => 'ATLAS_DBMON_R',
      p_url_mapping_type    => 'BASE_PATH',
      p_url_mapping_pattern => 'atlas_dbmon_r',
      p_auto_rest_auth      => FALSE);    

  ORDS.DEFINE_MODULE(
      p_module_name    => 'session_info',
      p_base_path      => '/session_info/',
      p_items_per_page =>  250,
      p_status         => 'PUBLISHED',
      p_comments       => NULL);      
  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'session_info',
      p_pattern        => ':db',
      p_priority       => 0,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);
  ORDS.DEFINE_HANDLER(
      p_module_name    => 'session_info',
      p_pattern        => ':db',
      p_method         => 'GET',
      p_source_type    => 'json/collection',
      p_items_per_page =>  250,
      p_mimes_allowed  => '',
      p_comments       => NULL,
      p_source         => 
'Select af.USERNAME
, CASE af.NODE1 WHEN ''0/0'' THEN '' '' ELSE af.NODE1 END as NODE1
, CASE af.NODE2 WHEN ''0/0'' THEN '' '' ELSE af.NODE2 END as NODE2
, CASE af.NODE3 WHEN ''0/0'' THEN '' '' ELSE af.NODE3 END as NODE3
, CASE af.NODE4 WHEN ''0/0'' THEN '' '' ELSE af.NODE4 END as NODE4
, bs.ACTIVE_SESS, bs.SESS, af.SESS_LIMIT, bs.WORKLOAD, bs.TO_DISPLAY  from (
SELECT * FROM
(
    select node_id, username, 
    -- as workload,
    num_active_sess, num_sess, sess_limit, t_stamp
    from table(ATLAS_DBMON.GET_SESS_DISTRIBUTION_DATA((:db)))
)
PIVOT
(
  MAX(NUM_ACTIVE_SESS || ''/'' || NUM_SESS),
  SUM(NUM_SESS) as NUM_SESSIONS
  FOR NODE_ID IN (1 as Node1,2 as Node2,3 as Node3,4 as Node4)
)
ORDER BY USERNAME) af


JOIN
(select USERNAME
, sum(NUM_ACTIVE_SESS) as ACTIVE_SESS
, sum(NUM_SESS) as SESS
, SESS_LIMIT
, (sum(NUM_SESS) / SESS_LIMIT) as WORKLOAD
,sum(NUM_ACTIVE_SESS) || ''/'' || sum(NUM_SESS) AS TO_DISPLAY 
from table(ATLAS_DBMON.GET_SESS_DISTRIBUTION_DATA((:db)))
group by USERNAME, SESS_LIMIT) bs
ON af.USERNAME = bs.USERNAME'
      );
  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'SessionInfo',
      p_pattern        => 'total/:db',
      p_priority       => 0,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);
  ORDS.DEFINE_HANDLER(
      p_module_name    => 'SessionInfo',
      p_pattern        => 'total/:db',
      p_method         => 'GET',
      p_source_type    => 'json/collection',
      p_items_per_page =>  250,
      p_mimes_allowed  => '',
      p_comments       => NULL,
      p_source         => 
'select USERNAME
, sum(NUM_ACTIVE_SESS) as ACTIVE_SESS
, sum(NUM_SESS) as SESS
, SESS_LIMIT
, (sum(NUM_SESS) / SESS_LIMIT) as WORKLOAD
,sum(NUM_SESS) || ''/'' || SESS_LIMIT AS TO_DISPLAY 
from table(ATLAS_DBMON.GET_SESS_DISTRIBUTION_DATA((:db)))
group by USERNAME, SESS_LIMIT;

-- NOT IN USE ANYMORE'
      );


  COMMIT; 
END;

-- Generated by Oracle SQL Developer REST Data Services 18.1.0.095.1630
-- Exported REST Definitions from ORDS Schema Version 3.0.11.180.12.34
-- Schema: ATLAS_DBMON   Date: Fri Aug 10 13:50:26 CEST 2018
--
BEGIN
  ORDS.ENABLE_SCHEMA(
      p_enabled             => TRUE,
      p_schema              => 'ATLAS_DBMON_R',
      p_url_mapping_type    => 'BASE_PATH',
      p_url_mapping_pattern => 'atlas_dbmon_r',
      p_auto_rest_auth      => FALSE);    

  ORDS.DEFINE_MODULE(
      p_module_name    => 'storage_info',
      p_base_path      => '/storage_info/',
      p_items_per_page =>  250,
      p_status         => 'PUBLISHED',
      p_comments       => NULL);      
  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'storage_info',
      p_pattern        => ':db/:schema/:year',
      p_priority       => 0,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);
  ORDS.DEFINE_HANDLER(
      p_module_name    => 'storage_info',
      p_pattern        => ':db/:schema/:year',
      p_method         => 'GET',
      p_source_type    => 'json/collection',
      p_items_per_page =>  250,
      p_mimes_allowed  => '',
      p_comments       => NULL,
      p_source         => 
'SELECT DT, TABLE_SIZE, INDEX_SIZE
FROM TABLE(ATLAS_DBMON.GET_STORAGE_DATA(:db, :schema, :year))'
      );


  COMMIT; 
END;

-- Generated by Oracle SQL Developer REST Data Services 18.1.0.095.1630
-- Exported REST Definitions from ORDS Schema Version 3.0.11.180.12.34
-- Schema: ATLAS_DBMON   Date: Fri Aug 10 13:50:39 CEST 2018
--
BEGIN
  ORDS.ENABLE_SCHEMA(
      p_enabled             => TRUE,
      p_schema              => 'ATLAS_DBMON_R',
      p_url_mapping_type    => 'BASE_PATH',
      p_url_mapping_pattern => 'atlas_dbmon_r',
      p_auto_rest_auth      => FALSE);    

  ORDS.DEFINE_MODULE(
      p_module_name    => 'streams_info',
      p_base_path      => '/streams_info/',
      p_items_per_page =>  500,
      p_status         => 'PUBLISHED',
      p_comments       => NULL);      
  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'streams_info',
      p_pattern        => ':db/:node/:metric/:fromDate/:toDate',
      p_priority       => 0,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);
  ORDS.DEFINE_HANDLER(
      p_module_name    => 'streams_info',
      p_pattern        => ':db/:node/:metric/:fromDate/:toDate',
      p_method         => 'GET',
      p_source_type    => 'json/collection',
      p_items_per_page =>  500,
      p_mimes_allowed  => '',
      p_comments       => NULL,
      p_source         => 
'SELECT t_stamp, metric_value FROM ATLAS_DBMON.DB_HIST_METRICS 
WHERE T_STAMP >= TO_DATE((:fromDate), ''YYYY-MM-DD"T"HH24:MI'') 
AND T_STAMP < TO_DATE((:toDate), ''YYYY-MM-DD"T"HH24:MI'')
AND dbname = UPPER(:db) AND METRIC_ID = :metric AND INST_ID = :node order by 1'
      );


  COMMIT; 
END;

-- Generated by Oracle SQL Developer REST Data Services 18.1.0.095.1630
-- Exported REST Definitions from ORDS Schema Version 3.0.11.180.12.34
-- Schema: ATLAS_DBMON   Date: Fri Aug 10 13:50:48 CEST 2018
--
BEGIN
  ORDS.ENABLE_SCHEMA(
      p_enabled             => TRUE,
      p_schema              => 'ATLAS_DBMON_R',
      p_url_mapping_type    => 'BASE_PATH',
      p_url_mapping_pattern => 'atlas_dbmon_r',
      p_auto_rest_auth      => FALSE);    

  ORDS.DEFINE_MODULE(
      p_module_name    => 'top10_sessions',
      p_base_path      => '/top10_sessions/',
      p_items_per_page =>  300,
      p_status         => 'PUBLISHED',
      p_comments       => NULL);      
  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'top10_sessions',
      p_pattern        => ':db/:fromDate/:toDate',
      p_priority       => 0,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);
  ORDS.DEFINE_HANDLER(
      p_module_name    => 'top10_sessions',
      p_pattern        => ':db/:fromDate/:toDate',
      p_method         => 'GET',
      p_source_type    => 'json/collection',
      p_items_per_page =>  300,
      p_mimes_allowed  => '',
      p_comments       => NULL,
      p_source         => 
'select inst_id, chart_type, parsing_schema_name, sql_id as name
, ROUND(metric_value,1) as y, metric_unit, sql_text
from table(ATLAS_DBMON.GET_TOP10_SESSIONS_DATA(:db, :fromDate, :toDate))'
      );


  COMMIT; 
END;

-- Generated by Oracle SQL Developer REST Data Services 18.1.0.095.1630
-- Exported REST Definitions from ORDS Schema Version 3.0.11.180.12.34
-- Schema: ATLAS_DBMON   Date: Fri Aug 10 13:50:57 CEST 2018
--
BEGIN
  ORDS.ENABLE_SCHEMA(
      p_enabled             => TRUE,
      p_schema              => 'ATLAS_DBMON_R',
      p_url_mapping_type    => 'BASE_PATH',
      p_url_mapping_pattern => 'atlas_dbmon_r',
      p_auto_rest_auth      => FALSE);    

  ORDS.DEFINE_MODULE(
      p_module_name    => 'top10_sess_per_schema',
      p_base_path      => '/top10_sess_per_schema/',
      p_items_per_page =>  500,
      p_status         => 'PUBLISHED',
      p_comments       => NULL);      
  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'top10_sess_per_schema',
      p_pattern        => ':db/:node/:schema/:fromDate/:toDate',
      p_priority       => 0,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);
  ORDS.DEFINE_HANDLER(
      p_module_name    => 'top10_sess_per_schema',
      p_pattern        => ':db/:node/:schema/:fromDate/:toDate',
      p_method         => 'GET',
      p_source_type    => 'json/collection',
      p_items_per_page =>  500,
      p_mimes_allowed  => '',
      p_comments       => NULL,
      p_source         => 
'select inst_id, chart_type, parsing_schema_name, sql_id as name
,  ROUND(metric_value,1) as y, metric_unit, sql_text
from table(ATLAS_DBMON.GET_TOP10_PER_SCHEMA(:db, :node, UPPER(:schema), :fromDate, :toDate))'
      );
  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'top10_sess_per_schema',
      p_pattern        => ':db/:schema/:fromDate/:toDate',
      p_priority       => 0,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);
  ORDS.DEFINE_HANDLER(
      p_module_name    => 'top10_sess_per_schema',
      p_pattern        => ':db/:schema/:fromDate/:toDate',
      p_method         => 'GET',
      p_source_type    => 'json/collection',
      p_items_per_page =>  500,
      p_mimes_allowed  => '',
      p_comments       => NULL,
      p_source         => 
'select inst_id, chart_type, parsing_schema_name, sql_id as name
,  ROUND(metric_value,1) as y, metric_unit, sql_text
from table(ATLAS_DBMON.GET_TOP10_PER_SCHEMA_ALLNODES(:db, UPPER(:schema), :fromDate, :toDate))'
      );


  COMMIT; 
END;

-- Generated by Oracle SQL Developer REST Data Services 18.1.0.095.1630
-- Exported REST Definitions from ORDS Schema Version 3.0.11.180.12.34
-- Schema: ATLAS_DBMON_R   Date: Fri Aug 10 13:00:20 CEST 2018
--
BEGIN
  ORDS.ENABLE_SCHEMA(
      p_enabled             => TRUE,
      p_schema              => 'ATLAS_DBMON_R',
      p_url_mapping_type    => 'BASE_PATH',
      p_url_mapping_pattern => 'atlas_dbmon_r',
      p_auto_rest_auth      => FALSE);    

  ORDS.DEFINE_MODULE(
      p_module_name    => 'all_databases',
      p_base_path      => '/all_databases/',
      p_items_per_page =>  500,
      p_status         => 'PUBLISHED',
      p_comments       => NULL);      
  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'all_databases',
      p_pattern        => '/',
      p_priority       => 0,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);
  ORDS.DEFINE_HANDLER(
      p_module_name    => 'all_databases',
      p_pattern        => '/',
      p_method         => 'GET',
      p_source_type    => 'json/collection',
      p_items_per_page =>  500,
      p_mimes_allowed  => '',
      p_comments       => NULL,
      p_source         => 
'SELECT dbname, position, dbnodes FROM ATLAS_DBMON.DATABASES'
      );
  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'all_databases',
      p_pattern        => ':dbname',
      p_priority       => 0,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);
  ORDS.DEFINE_HANDLER(
      p_module_name    => 'all_databases',
      p_pattern        => ':dbname',
      p_method         => 'GET',
      p_source_type    => 'json/collection',
      p_items_per_page =>  500,
      p_mimes_allowed  => '',
      p_comments       => NULL,
      p_source         => 
'SELECT dbname, position, dbnodes FROM ATLAS_DBMON.DATABASES
WHERE UPPER(dbname) = UPPER(:dbname)'
      );


  COMMIT; 
END;

END;