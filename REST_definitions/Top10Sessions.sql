-- Generated by Oracle SQL Developer REST Data Services 18.1.0.095.1630
-- Exported REST Definitions from ORDS Schema Version 3.0.11.180.12.34
-- Schema: ATLAS_DBMON   Date: Fri Aug 10 13:50:48 CEST 2018
--
BEGIN
  ORDS.ENABLE_SCHEMA(
      p_enabled             => TRUE,
      p_schema              => 'ATLAS_DBMON',
      p_url_mapping_type    => 'BASE_PATH',
      p_url_mapping_pattern => 'atlas_dbmon',
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