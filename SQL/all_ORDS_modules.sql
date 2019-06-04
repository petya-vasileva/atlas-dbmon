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
'SELECT schema_name FROM TABLE(ATLAS_DBMON.DBMON_PKG.GET_ALL_SCHEMAS(:db))'
      );
  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'all_schemas',
      p_pattern        => 'no_all/:db',
      p_priority       => 0,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);
  ORDS.DEFINE_HANDLER(
      p_module_name    => 'all_schemas',
      p_pattern        => 'no_all/:db',
      p_method         => 'GET',
      p_source_type    => 'json/collection',
      p_items_per_page =>  500,
      p_mimes_allowed  => '',
      p_comments       => NULL,
      p_source         => 
'SELECT schema_name FROM TABLE(ATLAS_DBMON.DBMON_PKG.GET_ALL_SCHEMAS(:db)) WHERE schema_name <> ''ALL'''
      );

  ORDS.DEFINE_MODULE(
      p_module_name    => 'app_message',
      p_base_path      => '/app_message/',
      p_items_per_page =>  5,
      p_status         => 'PUBLISHED',
      p_comments       => NULL);      
  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'app_message',
      p_pattern        => '/',
      p_priority       => 0,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);
  ORDS.DEFINE_HANDLER(
      p_module_name    => 'app_message',
      p_pattern        => '/',
      p_method         => 'GET',
      p_source_type    => 'json/collection',
      p_items_per_page =>  5,
      p_mimes_allowed  => '',
      p_comments       => NULL,
      p_source         => 
'select MESSAGE_TS, MESSAGE, LOWER(DB_NAME) as DB_NAME, VALID_FROM, VALID_TO, IS_ACTIVE, MESSAGE_ID, DOWNTIME from ATLAS_DBMON.APP_MESSAGE 
where VALID_FROM < SYSDATE 
AND VALID_TO > SYSDATE 
AND IS_ACTIVE = ''true'' 
order by message_ts desc'
      );

  ORDS.DEFINE_MODULE(
      p_module_name    => 'db',
      p_base_path      => '/db/',
      p_items_per_page =>  250,
      p_status         => 'PUBLISHED',
      p_comments       => NULL);      
  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'db',
      p_pattern        => 'apply_lag/:db',
      p_priority       => 0,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);
  ORDS.DEFINE_HANDLER(
      p_module_name    => 'db',
      p_pattern        => 'apply_lag/:db',
      p_method         => 'GET',
      p_source_type    => 'json/collection',
      p_items_per_page =>  25,
      p_mimes_allowed  => '',
      p_comments       => NULL,
      p_source         => 
'SELECT source, apply_lag, snapshot_time, status, :db as dbname FROM TABLE(ATLAS_DBMON.DBMON_PKG.GET_APPLY_LAG(:db))'
      );
  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'db',
      p_pattern        => 'awr/:db/:sqlID',
      p_priority       => 0,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);
  ORDS.DEFINE_HANDLER(
      p_module_name    => 'db',
      p_pattern        => 'awr/:db/:sqlID',
      p_method         => 'GET',
      p_source_type    => 'json/collection',
      p_items_per_page =>  0,
      p_mimes_allowed  => '',
      p_comments       => NULL,
      p_source         => 
'select * from table(ATLAS_DBMON.DBMON_PKG.GET_AWR_STATS4_SQLID(:db, :sqlID))'
      );
  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'db',
      p_pattern        => 'basic_metrics/:db/:mins',
      p_priority       => 0,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);
  ORDS.DEFINE_HANDLER(
      p_module_name    => 'db',
      p_pattern        => 'basic_metrics/:db/:mins',
      p_method         => 'GET',
      p_source_type    => 'json/collection',
      p_items_per_page =>  300,
      p_mimes_allowed  => '',
      p_comments       => NULL,
      p_source         => 
'SELECT Node1, Node2, Node3, Node4, metric, unit, threshold, visible, cnt_nodes
FROM TABLE(ATLAS_DBMON.DBMON_PKG.get_basic_metrics(:db, :mins))'
      );
  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'db',
      p_pattern        => 'blocking_tree/:db',
      p_priority       => 0,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);
  ORDS.DEFINE_HANDLER(
      p_module_name    => 'db',
      p_pattern        => 'blocking_tree/:db',
      p_method         => 'GET',
      p_source_type    => 'json/collection',
      p_items_per_page =>  250,
      p_mimes_allowed  => '',
      p_comments       => NULL,
      p_source         => 
'SELECT * FROM TABLE (ATLAS_DBMON.DBMON_PKG.get_blocking_sessions(:db))'
      );
  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'db',
      p_pattern        => 'blocking_tree/:db/:fromDate/:toDate',
      p_priority       => 0,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);
  ORDS.DEFINE_HANDLER(
      p_module_name    => 'db',
      p_pattern        => 'blocking_tree/:db/:fromDate/:toDate',
      p_method         => 'GET',
      p_source_type    => 'json/collection',
      p_items_per_page =>  250,
      p_mimes_allowed  => '',
      p_comments       => NULL,
      p_source         => 
'SELECT * FROM TABLE (ATLAS_DBMON.DBMON_PKG.get_blocking_sessions(:db, :fromDate, :toDate))'
      );
  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'db',
      p_pattern        => 'exp_plan/:db/:sqlid',
      p_priority       => 0,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);
  ORDS.DEFINE_HANDLER(
      p_module_name    => 'db',
      p_pattern        => 'exp_plan/:db/:sqlid',
      p_method         => 'GET',
      p_source_type    => 'json/collection',
      p_items_per_page =>  0,
      p_mimes_allowed  => '',
      p_comments       => NULL,
      p_source         => 
'select * from table(ATLAS_DBMON.DBMON_PKG.GET_EXP_PLAN_DATA(:sqlid, :db))'
      );
  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'db',
      p_pattern        => 'metrics/:db/:dateq',
      p_priority       => 0,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);
  ORDS.DEFINE_HANDLER(
      p_module_name    => 'db',
      p_pattern        => 'metrics/:db/:dateq',
      p_method         => 'GET',
      p_source_type    => 'json/collection',
      p_items_per_page =>  300,
      p_mimes_allowed  => '',
      p_comments       => NULL,
      p_source         => 
'SELECT metric, unit, threshold, visible, cnt_nodes, Node1, Node2, Node3, Node4
FROM TABLE(ATLAS_DBMON.DBMON_PKG.get_basic_metrics(:db, :mins));'
      );
  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'db',
      p_pattern        => 'session_distribution/:db',
      p_priority       => 0,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);
  ORDS.DEFINE_HANDLER(
      p_module_name    => 'db',
      p_pattern        => 'session_distribution/:db',
      p_method         => 'GET',
      p_source_type    => 'json/collection',
      p_items_per_page =>  250,
      p_mimes_allowed  => '',
      p_comments       => NULL,
      p_source         => 
'SELECT username, node1, node2, node3, node4, num_active_sess, num_sess, sess_limit, workload, to_display
FROM TABLE(ATLAS_DBMON.DBMON_PKG.get_compact_sess_distribution(:db))'
      );
  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'db',
      p_pattern        => 'state/:db',
      p_priority       => 0,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);
  ORDS.DEFINE_HANDLER(
      p_module_name    => 'db',
      p_pattern        => 'state/:db',
      p_method         => 'GET',
      p_source_type    => 'json/collection',
      p_items_per_page =>  25,
      p_mimes_allowed  => '',
      p_comments       => NULL,
      p_source         => 
'select * from table(ATLAS_DBMON.dbmon_pkg.GET_DB_UP_STATUS(:db))'
      );
  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'db',
      p_pattern        => 'streams/:db/:node/:metric/:fromDate/:toDate',
      p_priority       => 0,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);
  ORDS.DEFINE_HANDLER(
      p_module_name    => 'db',
      p_pattern        => 'streams/:db/:node/:metric/:fromDate/:toDate',
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
  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'db',
      p_pattern        => 'top10_sessions/:db/:fromDate/:toDate',
      p_priority       => 0,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);
  ORDS.DEFINE_HANDLER(
      p_module_name    => 'db',
      p_pattern        => 'top10_sessions/:db/:fromDate/:toDate',
      p_method         => 'GET',
      p_source_type    => 'json/collection',
      p_items_per_page =>  300,
      p_mimes_allowed  => '',
      p_comments       => NULL,
      p_source         => 
'select inst_id, chart_type, parsing_schema_name, sql_id as name
, ROUND(metric_value,1) as y, metric_unit, sql_text
from table(ATLAS_DBMON.DBMON_PKG.GET_TOP10_SESSIONS_DATA(:db, :fromDate, :toDate))'
      );

  ORDS.DEFINE_MODULE(
      p_module_name    => 'jobs_info',
      p_base_path      => '/jobs_info/',
      p_items_per_page =>  250,
      p_status         => 'PUBLISHED',
      p_comments       => NULL);      
  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'jobs_info',
      p_pattern        => 'details/:db/:schema',
      p_priority       => 0,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);
  ORDS.DEFINE_HANDLER(
      p_module_name    => 'jobs_info',
      p_pattern        => 'details/:db/:schema',
      p_method         => 'GET',
      p_source_type    => 'json/collection',
      p_items_per_page =>  250,
      p_mimes_allowed  => '',
      p_comments       => NULL,
      p_source         => 
'SELECT  * FROM TABLE(ATLAS_DBMON.DBMON_PKG.GET_JOBS_INFO(:db, :schema))'
      );
  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'jobs_info',
      p_pattern        => 'stats/:db/:schema',
      p_priority       => 0,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);
  ORDS.DEFINE_HANDLER(
      p_module_name    => 'jobs_info',
      p_pattern        => 'stats/:db/:schema',
      p_method         => 'GET',
      p_source_type    => 'json/collection',
      p_items_per_page =>  25,
      p_mimes_allowed  => '',
      p_comments       => NULL,
      p_source         => 
'SELECT 
count (CASE current_state WHEN ''RUNNING'' THEN 1 end) as running_jobs,
count (CASE last_status   WHEN ''FAILED''  THEN 1 end) as failed_jobs,
count (*) - count (CASE current_state WHEN ''DISABLED'' THEN 1 end) as total_jobs
FROM TABLE(ATLAS_DBMON.DBMON_PKG.GET_JOBS_INFO(:db, :schema))'
      );

  ORDS.DEFINE_MODULE(
      p_module_name    => 'schema',
      p_base_path      => '/schema/',
      p_items_per_page =>  500,
      p_status         => 'PUBLISHED',
      p_comments       => NULL);      
  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'schema',
      p_pattern        => 'account_info/:db/:schema',
      p_priority       => 0,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);
  ORDS.DEFINE_HANDLER(
      p_module_name    => 'schema',
      p_pattern        => 'account_info/:db/:schema',
      p_method         => 'GET',
      p_source_type    => 'json/collection',
      p_items_per_page =>  500,
      p_mimes_allowed  => '',
      p_comments       => NULL,
      p_source         => 
'select username, resp_name, resp_email, account_status, password_expiry_date, egroup
from table(ATLAS_DBMON.DBMON_PKG.GET_ACCOUNT_INFO(UPPER(:schema), :db))'
      );
  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'schema',
      p_pattern        => 'nodes/:db/:schema',
      p_priority       => 0,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);
  ORDS.DEFINE_HANDLER(
      p_module_name    => 'schema',
      p_pattern        => 'nodes/:db/:schema',
      p_method         => 'GET',
      p_source_type    => 'json/collection',
      p_items_per_page =>  100,
      p_mimes_allowed  => '',
      p_comments       => NULL,
      p_source         => 
'SELECT DISTINCT inst_id
FROM TABLE(ATLAS_DBMON.DBMON_PKG.GET_SCHEMA_SESS_DETAILS(:db, :schema))
ORDER BY inst_id'
      );
  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'schema',
      p_pattern        => 'num_sessions_chart/:db/:schema/:fromDate/:toDate/:node',
      p_priority       => 0,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);
  ORDS.DEFINE_HANDLER(
      p_module_name    => 'schema',
      p_pattern        => 'num_sessions_chart/:db/:schema/:fromDate/:toDate/:node',
      p_method         => 'GET',
      p_source_type    => 'json/collection',
      p_items_per_page =>  250,
      p_mimes_allowed  => '',
      p_comments       => NULL,
      p_source         => 
'select node_id, username, num_active_sess, num_sess, sess_limit, t_stamp
from table(ATLAS_DBMON.DBMON_PKG.get_num_sessions_chart(:db, :schema, :fromDate, :toDate, :node))'
      );
  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'schema',
      p_pattern        => 'session_distribution/:db/:schema',
      p_priority       => 0,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);
  ORDS.DEFINE_HANDLER(
      p_module_name    => 'schema',
      p_pattern        => 'session_distribution/:db/:schema',
      p_method         => 'GET',
      p_source_type    => 'json/collection',
      p_items_per_page =>  300,
      p_mimes_allowed  => '',
      p_comments       => NULL,
      p_source         => 
'SELECT NODE_ID, USERNAME, NUM_ACTIVE_SESS, NUM_SESS, OSUSER, MACHINE, PROGRAM
FROM TABLE(ATLAS_DBMON.DBMON_PKG.GET_SCHEMA_SESS_DISTRIBUTION(:db, :schema))'
      );
  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'schema',
      p_pattern        => 'sessions/:db/:schema',
      p_priority       => 0,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);
  ORDS.DEFINE_HANDLER(
      p_module_name    => 'schema',
      p_pattern        => 'sessions/:db/:schema',
      p_method         => 'GET',
      p_source_type    => 'json/collection',
      p_items_per_page =>  500,
      p_mimes_allowed  => '',
      p_comments       => NULL,
      p_source         => 
'SELECT * FROM TABLE(ATLAS_DBMON.DBMON_PKG.GET_SCHEMA_SESS_DETAILS(:db, :schema))'
      );
  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'schema',
      p_pattern        => 'top10_sessions/:db/:node/:schema/:fromDate/:toDate',
      p_priority       => 0,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);
  ORDS.DEFINE_HANDLER(
      p_module_name    => 'schema',
      p_pattern        => 'top10_sessions/:db/:node/:schema/:fromDate/:toDate',
      p_method         => 'GET',
      p_source_type    => 'json/collection',
      p_items_per_page =>  500,
      p_mimes_allowed  => '',
      p_comments       => NULL,
      p_source         => 
'select inst_id, chart_type, parsing_schema_name, sql_id as name, metric_value as y, metric_unit, sql_text
from table(ATLAS_DBMON.dbmon_pkg.get_top10_per_schema(:db, :node, :schema, :fromDate, :toDate))'
      );
  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'schema',
      p_pattern        => 'top10_tables/:db/:schema/:year',
      p_priority       => 0,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);
  ORDS.DEFINE_HANDLER(
      p_module_name    => 'schema',
      p_pattern        => 'top10_tables/:db/:schema/:year',
      p_method         => 'GET',
      p_source_type    => 'json/collection',
      p_items_per_page =>  0,
      p_mimes_allowed  => '',
      p_comments       => NULL,
      p_source         => 
'SELECT * 
FROM TABLE(ATLAS_DBMON.DBMON_PKG.GET_TOP10_TABLES_PER_SCHEMA(:db, :schema, :year)) order by OBJECT_NAME, OBJECT_TYPE, DT'
      );

  ORDS.DEFINE_MODULE(
      p_module_name    => 'storage_size',
      p_base_path      => '/storage_size/',
      p_items_per_page =>  250,
      p_status         => 'PUBLISHED',
      p_comments       => NULL);      
  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'storage_size',
      p_pattern        => ':db/:schema/:year',
      p_priority       => 0,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);
  ORDS.DEFINE_HANDLER(
      p_module_name    => 'storage_size',
      p_pattern        => ':db/:schema/:year',
      p_method         => 'GET',
      p_source_type    => 'json/collection',
      p_items_per_page =>  250,
      p_mimes_allowed  => '',
      p_comments       => NULL,
      p_source         => 
'SELECT DT, TABLE_SIZE, INDEX_SIZE
FROM TABLE(ATLAS_DBMON.DBMON_PKG.GET_STORAGE_DATA(:db, :schema, :year))'
      );


  COMMIT; 
END;