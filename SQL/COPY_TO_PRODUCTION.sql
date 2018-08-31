-- ## 1.## CREATE SCRIPT for Types & Functions.
-- Execute code below as Script! (F5)

spool DBMON_functions.sql

SELECT 
   REPLACE (DBMS_METADATA.GET_DDL( object_type, object_name, 'ATLAS_DBMON'), 'CREATE OR REPLACE TYPE "ATLAS_DBMON"', 'CREATE OR REPLACE TYPE "ATLAS_DBMON_DEV"') as definition
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
FROM 
   user_objects 
WHERE 
   object_type IN ('FUNCTION')
ORDER BY OBJECT_ID;

spool off

--## 2.## RUN CREATED SCRIPT