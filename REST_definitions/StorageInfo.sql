-- Generated by Oracle SQL Developer REST Data Services 18.1.0.095.1630
-- Exported REST Definitions from ORDS Schema Version 3.0.11.180.12.34
-- Schema: ATLAS_DBMON   Date: Fri Aug 10 13:50:26 CEST 2018
--
BEGIN
  ORDS.ENABLE_SCHEMA(
      p_enabled             => TRUE,
      p_schema              => 'ATLAS_DBMON',
      p_url_mapping_type    => 'BASE_PATH',
      p_url_mapping_pattern => 'atlas_dbmon',
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