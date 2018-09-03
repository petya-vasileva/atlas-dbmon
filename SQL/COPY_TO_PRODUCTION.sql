-- presets for the Export
-- Works both for SQL-Dev & SQLPlus CLI
set pagesize 0
set long 90000
set feedback off
set echo off
set heading 999
set lines 100


-- ## 1.## CREATE SCRIPT for Types & Functions.
-- Execute code below !!!AS SCRIPT!!! (F5)

spool DBMON_functions.sql

SELECT 
   REPLACE (DBMS_METADATA.GET_DDL( object_type, object_name, 'ATLAS_DBMON'), 'CREATE OR REPLACE TYPE "ATLAS_DBMON"', 'CREATE OR REPLACE TYPE "ATLAS_DBMON_DEV"') as definition
--	 REPLACE(DBMS_METADATA.GET_DDL( object_type, object_name, 'ATLAS_DBMON'),'" AS' , '@OFFDB" AS' ) as definition
FROM 
   user_objects 
WHERE 
   object_type IN ('TYPE')
ORDER BY substr(object_name, -3);

-- Export from GUI
-- Execute in batch or one by one

--################################################################

SELECT 
   REPLACE (DBMS_METADATA.GET_DDL( object_type, object_name, 'ATLAS_DBMON'), 'CREATE OR REPLACE TYPE "ATLAS_DBMON"', 'CREATE OR REPLACE TYPE "ATLAS_DBMON_DEV"') as definition
--	 REPLACE(DBMS_METADATA.GET_DDL( object_type, object_name, 'ATLAS_DBMON'),'" AS' , '@OFFDB" AS' ) as definition
FROM 
   user_objects 
WHERE 
   object_type IN ('FUNCTION')
ORDER BY OBJECT_ID;

spool off

--## 2.## RUN CREATED SCRIPT
-- C:\Users\Benjamin\AppData\Roaming\SQL Developer