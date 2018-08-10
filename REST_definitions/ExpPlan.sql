-- Generated by Oracle SQL Developer REST Data Services 18.1.0.095.1630
-- Exported REST Definitions from ORDS Schema Version 3.0.11.180.12.34
-- Schema: ATLAS_DBMON   Date: Fri Aug 10 13:48:46 CEST 2018
--
BEGIN
  ORDS.ENABLE_SCHEMA(
      p_enabled             => TRUE,
      p_schema              => 'ATLAS_DBMON',
      p_url_mapping_type    => 'BASE_PATH',
      p_url_mapping_pattern => 'atlas_dbmon',
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