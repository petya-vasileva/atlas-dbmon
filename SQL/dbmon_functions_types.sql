-- Necessary new Functions & types for the DBMON

create or replace FUNCTION                                                  GET_TOP10_PER_SCHEMA_ALLNODES (db VARCHAR2, schema_name VARCHAR2, fromDate VARCHAR2, toDate VARCHAR2)
RETURN TOP10_TAB AS
  -- The AUTONOMOUS_TRANSACTION and the rollback at the end of the proc are neccessary to close 
  -- the transaction open by Oracle because of the used DB link.
  PRAGMA AUTONOMOUS_TRANSACTION;
  tab TOP10_TAB:= TOP10_TAB();
  stmt varchar2(32000);
  unionn VARCHAR2(15) := ' UNION ALL ';
  idxj number;
  met_cnt number;
  node_num NUMBER;
BEGIN

  --SELECT DBNODES into node_num FROM DBMON_SCHEMA.DATABASES WHERE UPPER(DBNAME) = UPPER(db);

  SELECT count(*) into met_cnt
  FROM DBMON_SCHEMA.DB_METRIC_DESC WHERE METRIC_ID >= 20000;

  --FOR i IN 1..node_num
    --loop
    idxj := 0;    
    for j in ( SELECT METRIC_NAME FROM DBMON_SCHEMA.DB_METRIC_DESC WHERE METRIC_ID >= 20000 )
      loop
      idxj := idxj + 1;

      IF  (idxj = met_cnt) THEN 
        unionn := '';
      END IF;

      stmt := stmt || 'SELECT inst_id,  chart_type,  parsing_schema_name,  sqlid,  metric_value,  metric_unit, substr(sql_text, 1, 100) sql_text 
             FROM 
             (SELECT inst_id,  chart_type,  parsing_schema_name,  sqlid,  metric_value,  metric_unit, db_name from
                (
                SELECT inst_id,  chart_type,  parsing_schema_name,  sql_id as sqlid,  AVG(metric_value) metric_value,  metric_unit, db_name
                FROM DBMON_SCHEMA.TOP_SQL_PER_DB_SCHEMA
                WHERE DB_NAME = UPPER('''|| db ||''')
                AND T_STAMP >= TO_DATE('''|| fromDate ||''', ''YYYY-MM-DD"T"HH24:MI:SS'') AND T_STAMP < TO_DATE('''|| toDate ||''', ''YYYY-MM-DD"T"HH24:MI:SS'')
                AND CHART_TYPE = '''|| j.METRIC_NAME ||'''  AND parsing_schema_name like ''' || schema_name || '%'' 
                GROUP BY inst_id,  chart_type,  parsing_schema_name,  sql_id,  metric_unit, db_name
                ORDER BY 5 desc
                )
              WHERE ROWNUM <= 10) s
              JOIN  DBMON_SCHEMA.SQL_TEXT_HIST h 
              ON (sql_id = sqlid and s.db_name = h.db_name)
             '|| unionn ||'';

      END loop;
  --end loop;

  stmt := 'SELECT DBMON_SCHEMA.TOP10_OBJ(INST_ID,CHART_TYPE,PARSING_SCHEMA_NAME,SQLID,METRIC_VALUE,METRIC_UNIT,SQL_TEXT) 
           FROM (' || stmt || ')';

  DBMS_OUTPUT.put_line(stmt);
  EXECUTE IMMEDIATE stmt BULK COLLECT INTO tab;

  ROLLBACK;

  return tab;
END GET_TOP10_PER_SCHEMA_ALLNODES;


--####################################################################################################################################



--####################################################################################################################################



--####################################################################################################################################

create or replace FUNCTION                                      GET_DB_UP_STATUS (db VARCHAR2) 

RETURN DB_UP_TAB AS 
  -- The AUTONOMOUS_TRANSACTION and the rollback at the end of the proc are neccessary to close 
  -- the transaction open by Oracle because of the used DB link.
  PRAGMA AUTONOMOUS_TRANSACTION;
  sql_tab DB_UP_TAB:= DB_UP_TAB();
  sql_text VARCHAR2(4000);

BEGIN

    sql_text := 'SELECT DBMON_SCHEMA.DB_UP_OBJ(STATUS) 
           FROM ( SELECT ''1'' as STATUS from DUAL@'|| db ||')';

		   execute immediate sql_text bulk collect into sql_tab;

  rollback;

  RETURN sql_tab;

END GET_DB_UP_STATUS;

--####################################################################################################################################

create or replace TYPE             DB_UP_OBJ AS OBJECT
(
status  		VARCHAR2(1000 BYTE)
);

--####################################################################################################################################

create or replace TYPE             DB_UP_TAB AS TABLE OF DBMON_SCHEMA.DB_UP_OBJ;

--####################################################################################################################################

create or replace FUNCTION                                      GET_APPLY_LAG (db VARCHAR2) 

RETURN APPLYLAG_TAB AS 
  -- The AUTONOMOUS_TRANSACTION and the rollback at the end of the proc are neccessary to close 
  -- the transaction open by Oracle because of the used DB link.
  PRAGMA AUTONOMOUS_TRANSACTION;
  sql_tab APPLYLAG_TAB:= APPLYLAG_TAB();
  sql_text VARCHAR2(4000);

BEGIN

  IF (UPPER(DB) = 'OFFDB') THEN
	sql_text := 'select a.apply_name as source, TO_CHAR((APPLY_TIME - APPLIED_MESSAGE_CREATE_TIME)*86400) as apply_lag, TO_CHAR(SYSDATE, ''YYYY-MM-DD HH24:MI:SS'') as snapshot_time, status 
from DBA_APPLY_PROGRESS@offdb p, dba_apply@offdb a where p.apply_name = a.apply_name and a.apply_name !=''OGG$C_COOLOF'' ';
        DBMS_OUTPUT.put_line(sql_text);
  ELSE 
    sql_text := 'SELECT NULL as source, sysdate + (TO_DSINTERVAL(VALUE) * 86400) - sysdate as apply_lag, NULL as snapshot_time, NULL as status FROM gV$DATAGUARD_STATS@'||db||' WHERE NAME = ''apply lag'' AND value IS NOT NULL';
        DBMS_OUTPUT.put_line(sql_text);

  END IF;  


    sql_text := 'SELECT DBMON_SCHEMA.APPLYLAG_OBJ(SOURCE,APPLY_LAG,SNAPSHOT_TIME,STATUS) 
           FROM (' || sql_text || ')';
                   DBMS_OUTPUT.put_line(sql_text);


  	execute immediate sql_text bulk collect into sql_tab;

  rollback;

  RETURN sql_tab;

END GET_APPLY_LAG;

--####################################################################################################################################

create or replace TYPE             APPLYLAG_OBJ AS OBJECT
(
source  		VARCHAR2(30 BYTE),
apply_lag		VARCHAR2(64 BYTE),
snapshot_time 	VARCHAR2(30 BYTE),
status  		VARCHAR2(32 BYTE)
);

--####################################################################################################################################

create or replace TYPE             APPLYLAG_TAB AS TABLE OF DBMON_SCHEMA.APPLYLAG_OBJ;

--####################################################################################################################################

create or replace FUNCTION GET_JOBS_INFO(db VARCHAR2, dbschema VARCHAR2)RETURN job_info_tab AS 
  -- The AUTONOMOUS_TRANSACTION and the rollback at the end of the proc are neccessary to close 
  -- the transaction open by Oracle because of the used DB link.
  PRAGMA AUTONOMOUS_TRANSACTION;
    sql_tab job_info_tab:= job_info_tab();
      sql_text VARCHAR2(4000);
    -- Variablen
    
BEGIN

 IF (dbschema = 'all') THEN
   sql_text := ' SELECT owner,    job_name,    job_class,    
    TO_CHAR(last_start_date,''DD-MM-YYYY HH24:MI:SS'') AS last_start_date,
    nvl(regexp_substr(last_run_duration,''\\d{1} \\d{2}:\\d{2}:\\d{2}.\\d{1}''),''-'') AS last_run_duration,
    last_status,    current_state,    
    TO_CHAR(next_run_time,''DD-MM-YYYY HH24:MI:SS'') AS next_run_time,
    repeat_interval,    info
FROM
    dbmon_schema.db_scheduler_jobs
WHERE
    db_name = upper( ('''||db||''') )
    AND t_stamp = (
        SELECT MAX(t_stamp)
        FROM dbmon_schema.db_scheduler_jobs
    )';
  
  ELSE
    sql_text := ' SELECT owner,    job_name,    job_class,    
    TO_CHAR(last_start_date,''DD-MM-YYYY HH24:MI:SS'') AS last_start_date,
    nvl(regexp_substr(last_run_duration,''\\d{1} \\d{2}:\\d{2}:\\d{2}.\\d{1}''),''-'') AS last_run_duration,
    last_status,    current_state,    
    TO_CHAR(next_run_time,''DD-MM-YYYY HH24:MI:SS'') AS next_run_time,
    repeat_interval,    info
FROM
    dbmon_schema.db_scheduler_jobs
WHERE
    db_name = upper('''||db||''')
    AND owner LIKE upper( '''||dbschema||''')
    AND t_stamp = (
        SELECT MAX(t_stamp)
        FROM dbmon_schema.db_scheduler_jobs
    )';
        
  END IF;

DBMS_OUTPUT.put_line(sql_text);
  sql_text := 'SELECT DBMON_SCHEMA.JOB_INFO_OBJ(OWNER, JOB_NAME, JOB_CLASS, LAST_START_DATE, LAST_RUN_DURATION, LAST_STATUS, CURRENT_STATE, NEXT_RUN_TIME, REPEAT_INTERVAL, INFO) 
           FROM (' || sql_text || ')';

  EXECUTE IMMEDIATE sql_text BULK COLLECT INTO sql_tab;
  ROLLBACK;
  RETURN sql_tab;
END GET_JOBS_INFO;

--####################################################################################################################################

create or replace TYPE job_info_obj AS OBJECT
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
 alter type job_info_obj modify attribute LAST_RUN_DURATION VARCHAR(100) cascade
 alter type job_info_obj modify attribute LAST_START_DATE VARCHAR2(100) cascade
 alter type job_info_obj modify attribute  NEXT_RUN_TIME VARCHAR2 (100) cascade

--####################################################################################################################################

create or replace type job_info_tab AS TABLE OF job_info_obj;

--####################################################################################################################################



--####################################################################################################################################



--####################################################################################################################################



--####################################################################################################################################
