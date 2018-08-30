--------------------------------------------------------
--  Datei erstellt -Donnerstag-August-30-2018   
--------------------------------------------------------
--------------------------------------------------------
--  DDL for Type APPLYLAG_OBJ
--------------------------------------------------------

  CREATE OR REPLACE TYPE "DBMON_SCHEMA"."APPLYLAG_OBJ" AS OBJECT
(
source  		VARCHAR2(30 BYTE),
apply_lag		VARCHAR2(64 BYTE),
snapshot_time 	VARCHAR2(30 BYTE),
status  		VARCHAR2(32 BYTE)
);

/
--------------------------------------------------------
--  DDL for Type APPLYLAG_TAB
--------------------------------------------------------

  CREATE OR REPLACE TYPE "DBMON_SCHEMA"."APPLYLAG_TAB" AS TABLE OF DBMON_SCHEMA.APPLYLAG_OBJ;

/
--------------------------------------------------------
--  DDL for Type AWR_OBJ
--------------------------------------------------------

  CREATE OR REPLACE TYPE "DBMON_SCHEMA"."AWR_OBJ" AS OBJECT
( inst NUMBER,
  begin_time VARCHAR2(20),
  plan_hash_value NUMBER, 
  module VARCHAR2(64),
  parsing_schema_name VARCHAR2(30),
  fetches NUMBER,
  sorts NUMBER,
  execs NUMBER,
  pxexecs NUMBER,
  loads NUMBER,
  invalid NUMBER,
  parse_calls NUMBER,
  disk_reads NUMBER,
  buffer_gets NUMBER,
  direct_writes NUMBER,
  rows_proc NUMBER,
  cpu_time NUMBER,
  elapsed_time NUMBER,
  etime_per_exec NUMBER,
  iowait NUMBER,
  cluster_wait NUMBER,
  app_wait NUMBER,
  concurrency NUMBER,
  plsql_time NUMBER
  );

/
--------------------------------------------------------
--  DDL for Type AWR_TAB
--------------------------------------------------------

  CREATE OR REPLACE TYPE "DBMON_SCHEMA"."AWR_TAB" AS TABLE OF awr_obj;

/
--------------------------------------------------------
--  DDL for Type BLOCK_SESS_OBJ
--------------------------------------------------------

  CREATE OR REPLACE TYPE "DBMON_SCHEMA"."BLOCK_SESS_OBJ" AS OBJECT
( BLOCKING_SESS_ID NUMBER,
  WAITING_SESS_ID NUMBER,
  DEPTH NUMBER,
  INST_ID NUMBER,
  LOGON_TIME VARCHAR2(20),
  USER_NAME VARCHAR2(30),
  OS_USER VARCHAR2(30),
  PROGRAM VARCHAR2(48),
  MACHINE VARCHAR2(64),
  SQL_ID VARCHAR2(13),
  SQL_TEXT VARCHAR2(1000),
  TIME_WAIT NUMBER,
  BLOCKING_ON_TABLE_OWNER VARCHAR2(30),
  BLOCKING_ON_TABLE_NAME VARCHAR2(30),
  BLOCKING_ON_ROW_ADDRESS VARCHAR2(18),
  BLOCKING_SESS_WAIT_CLASS VARCHAR2(64)
  );

/
--------------------------------------------------------
--  DDL for Type BLOCK_SESS_TAB
--------------------------------------------------------

  CREATE OR REPLACE TYPE "DBMON_SCHEMA"."BLOCK_SESS_TAB" AS TABLE OF block_sess_obj;

/
--------------------------------------------------------
--  DDL for Type DB_UP_OBJ
--------------------------------------------------------

  CREATE OR REPLACE TYPE "DBMON_SCHEMA"."DB_UP_OBJ" AS OBJECT
(
status  		VARCHAR2(1000 BYTE)
);

/
--------------------------------------------------------
--  DDL for Type DB_UP_TAB
--------------------------------------------------------

  CREATE OR REPLACE TYPE "DBMON_SCHEMA"."DB_UP_TAB" AS TABLE OF DBMON_SCHEMA.DB_UP_OBJ;

/
--------------------------------------------------------
--  DDL for Type EXP_PLAN_OBJ
--------------------------------------------------------

  CREATE OR REPLACE TYPE "DBMON_SCHEMA"."EXP_PLAN_OBJ" AS OBJECT
( plan_table_output VARCHAR2(4000));

/
--------------------------------------------------------
--  DDL for Type EXP_PLAN_TAB
--------------------------------------------------------

  CREATE OR REPLACE TYPE "DBMON_SCHEMA"."EXP_PLAN_TAB" AS TABLE OF exp_plan_obj;

/
--------------------------------------------------------
--  DDL for Type JOB_INFO_OBJ
--------------------------------------------------------

  CREATE OR REPLACE TYPE "DBMON_SCHEMA"."JOB_INFO_OBJ" AS OBJECT
( OWNER	VARCHAR2(30),
JOB_NAME	VARCHAR2(30),
JOB_CLASS	VARCHAR2(100),
LAST_START_DATE VARCHAR(30),
LAST_RUN_DURATION VARCHAR(30),
LAST_STATUS	VARCHAR2(30),
CURRENT_STATE	VARCHAR2(30),
NEXT_RUN_TIME VARCHAR(30),
REPEAT_INTERVAL	VARCHAR2(200),
INFO	VARCHAR2(4000)
  )
; 
ALTER TYPE "DBMON_SCHEMA"."JOB_INFO_OBJ" modify attribute LAST_RUN_DURATION VARCHAR(100) cascade
; 
ALTER TYPE "DBMON_SCHEMA"."JOB_INFO_OBJ" modify attribute LAST_START_DATE VARCHAR2(100) cascade
; 
ALTER TYPE "DBMON_SCHEMA"."JOB_INFO_OBJ" modify attribute  NEXT_RUN_TIME VARCHAR2 (100) cascade

/
--------------------------------------------------------
--  DDL for Type JOB_INFO_TAB
--------------------------------------------------------

  CREATE OR REPLACE TYPE "DBMON_SCHEMA"."JOB_INFO_TAB" AS TABLE OF job_info_obj;

/
--------------------------------------------------------
--  DDL for Type NODETABLE
--------------------------------------------------------

  CREATE OR REPLACE TYPE "DBMON_SCHEMA"."NODETABLE" AS OBJECT
( 
  nodenumber    number(10)
)

/
--------------------------------------------------------
--  DDL for Type SCHEMA_DETAILS_OBJ
--------------------------------------------------------

  CREATE OR REPLACE TYPE "DBMON_SCHEMA"."SCHEMA_DETAILS_OBJ" AS OBJECT 
(
  USERNAME VARCHAR2(30),
  RESP_NAME VARCHAR2(1000),
  RESP_EMAIL VARCHAR2(1000),
  ACCOUNT_STATUS VARCHAR2(32),
  PASSWORD_EXPIRY_DATE VARCHAR2(30),
  EGROUP VARCHAR2(50)
);

/
--------------------------------------------------------
--  DDL for Type SCHEMA_DETAILS_TAB
--------------------------------------------------------

  CREATE OR REPLACE TYPE "DBMON_SCHEMA"."SCHEMA_DETAILS_TAB" AS TABLE OF SCHEMA_DETAILS_OBJ;

/
--------------------------------------------------------
--  DDL for Type SCHEMA_OBJ
--------------------------------------------------------

  CREATE OR REPLACE TYPE "DBMON_SCHEMA"."SCHEMA_OBJ" AS OBJECT
( schema_name VARCHAR2(30));

/
--------------------------------------------------------
--  DDL for Type SCHEMA_SESS_DETAILS_OBJ
--------------------------------------------------------

  CREATE OR REPLACE TYPE "DBMON_SCHEMA"."SCHEMA_SESS_DETAILS_OBJ" AS OBJECT
( INST_ID NUMBER,
  SID NUMBER,
  STATUS VARCHAR2(8)  ,
  OSUSER VARCHAR2(30),
  PROCESS VARCHAR2(24), 
  MACHINE VARCHAR2(64),
  PROGRAM VARCHAR2(48),
  SQL_ID VARCHAR2(13),
  EVENT VARCHAR2(64),
  WAIT_CLASS VARCHAR2(64),
  SECONDS_IN_WAIT NUMBER,
  SERVICE_NAME VARCHAR2(64)
  );

/
--------------------------------------------------------
--  DDL for Type SCHEMA_SESS_DETAILS_TAB
--------------------------------------------------------

  CREATE OR REPLACE TYPE "DBMON_SCHEMA"."SCHEMA_SESS_DETAILS_TAB" AS TABLE OF schema_sess_details_obj;

/
--------------------------------------------------------
--  DDL for Type SCHEMA_TAB
--------------------------------------------------------

  CREATE OR REPLACE TYPE "DBMON_SCHEMA"."SCHEMA_TAB" AS TABLE OF schema_obj;

/
--------------------------------------------------------
--  DDL for Type SESS_DISTR_OBJ
--------------------------------------------------------

  CREATE OR REPLACE TYPE "DBMON_SCHEMA"."SESS_DISTR_OBJ" AS OBJECT
( node_id NUMBER,
  username VARCHAR2(30),
  num_active_sess NUMBER,
  num_sess NUMBER,
  sess_limit NUMBER,
  t_stamp Date);

/
--------------------------------------------------------
--  DDL for Type SESS_DISTR_TAB
--------------------------------------------------------

  CREATE OR REPLACE TYPE "DBMON_SCHEMA"."SESS_DISTR_TAB" AS TABLE OF sess_distr_obj;

/
--------------------------------------------------------
--  DDL for Type STORAGE_OBJ
--------------------------------------------------------

  CREATE OR REPLACE TYPE "DBMON_SCHEMA"."STORAGE_OBJ" AS OBJECT
( DT VARCHAR2(10),
  INDEX_SIZE NUMBER,
  TABLE_SIZE NUMBER);

/
--------------------------------------------------------
--  DDL for Type STORAGE_TAB
--------------------------------------------------------

  CREATE OR REPLACE TYPE "DBMON_SCHEMA"."STORAGE_TAB" AS TABLE OF storage_obj;

/
--------------------------------------------------------
--  DDL for Type TOP10_OBJ
--------------------------------------------------------

  CREATE OR REPLACE TYPE "DBMON_SCHEMA"."TOP10_OBJ" AS OBJECT
(
INST_ID	NUMBER(1,0),
CHART_TYPE	VARCHAR2(20 BYTE),
PARSING_SCHEMA_NAME	VARCHAR2(30 BYTE),
SQL_ID	VARCHAR2(30 BYTE),
METRIC_VALUE	NUMBER,
METRIC_UNIT	VARCHAR2(35 BYTE),
SQL_TEXT	VARCHAR2(4000 BYTE)
);

/
--------------------------------------------------------
--  DDL for Type TOP10_TAB
--------------------------------------------------------

  CREATE OR REPLACE TYPE "DBMON_SCHEMA"."TOP10_TAB" AS TABLE OF DBMON_SCHEMA.TOP10_OBJ;

/
