-- SQL-Script for Functions and custom variables needed.
-- Everything besides "GET_TOP10_PER_SCHEMA_ALLNODES might already be there.
--==> No need to recreate everything!


create or replace FUNCTION                                      GET_ALL_SCHEMAS (db VARCHAR2) 

RETURN schema_tab AS 
  -- The AUTONOMOUS_TRANSACTION and the rollback at the end of the proc are neccessary to close 
  -- the transaction open by Oracle because of the used DB link.
  PRAGMA AUTONOMOUS_TRANSACTION;
  sql_tab schema_tab:= schema_tab();
  cool_clause VARCHAR2(200);
  sql_text VARCHAR2(4000);
  wrapper VARCHAR2(4000);
BEGIN
  
  IF (UPPER(DB) = 'OFFDB') THEN
    cool_clause := 'UNION 
                   SELECT ''ATLAS_COOL'' 
                     FROM DUAL';
  END IF;
  
  IF (UPPER(db) = 'ALL') THEN
    SELECT DBMON_SCHEMA.schema_obj(username) bulk collect into sql_tab
                   FROM (SELECT DISTINCT username 
                           FROM DBMON_SCHEMA.SCHEMA_DETAILS 
                       ORDER BY 1);    
  ELSE 
    sql_text := 'SELECT DBMON_SCHEMA.schema_obj(username)
                   FROM (
                 SELECT username 
                   FROM dba_users@'||db||'
                  WHERE (username NOT LIKE ''%\_R'' escape ''\'' AND username NOT LIKE ''%\_W'' escape ''\'') 
                  AND username LIKE ''ATLAS%''
                  UNION 
                 SELECT ''ALL'' FROM DUAL '||cool_clause||'
                 ORDER BY 1)';

    execute immediate sql_text bulk collect into sql_tab;
  END IF;  
  
  rollback;
  
  RETURN sql_tab;
  
END GET_ALL_SCHEMAS;

--##########################################################################
create or replace FUNCTION                                                                                     GET_AWR_STATS4_SQLID (db_name VARCHAR2, sql_id VARCHAR2)
RETURN awr_tab AS 
  -- The AUTONOMOUS_TRANSACTION and the rollback at the end of the proc are neccessary to close 
  -- the transaction open by Oracle because of the used DB link.
  PRAGMA AUTONOMOUS_TRANSACTION;
  sql_tab awr_tab:= awr_tab();
  sql_text VARCHAR2(4000);
  wrapper varchar2(4000);
  --db_name varchar2(10) := '';
BEGIN  
 
  sql_text := 'SELECT DBMON_SCHEMA.awr_obj(inst,
                                            begin_time,
                                            plan_hash_value,
                                            module,
                                            parsing_schema_name,
                                            fetches,
                                            sorts,
                                            execs,
                                            pxexecs,
                                            loads,
                                            invalid,
                                            parse_calls,
                                            disk_reads,
                                            buffer_gets,
                                            direct_writes,
                                            rows_proc,
                                            cpu_time,
                                            elapsed_time,
                                            etime_per_exec,
                                            iowait,
                                            cluster_wait,
                                            app_wait,
                                            concurrency,
                                            plsql_time)
              FROM (
              SELECT hs.instance_number inst, to_char(hs.begin_interval_time,''dd-mm-yy hh24:mi'') begin_time, plan_hash_value,
              MODULE, PARSING_SCHEMA_NAME, FETCHES_DELTA fetches,	SORTS_DELTA sorts, EXECUTIONS_DELTA execs, PX_SERVERS_EXECS_DELTA pxexecs, 
              LOADS_DELTA loads, INVALIDATIONS_DELTA invalid, PARSE_CALLS_DELTA parse_calls, DISK_READS_DELTA disk_reads,BUFFER_GETS_DELTA buffer_gets,
              DIRECT_WRITES_DELTA direct_writes, ROWS_PROCESSED_DELTA rows_proc, round(CPU_TIME_DELTA/1000000,2) cpu_time, 
              round(ELAPSED_TIME_DELTA/1000000,2) elapsed_time, 
              round(DECODE(EXECUTIONS_DELTA, 0, 1, round(ELAPSED_TIME_DELTA/1000000,2))/DECODE(EXECUTIONS_DELTA, 0, 1, EXECUTIONS_DELTA), 2)	etime_per_exec, 
              round(IOWAIT_DELTA/1000000,2) iowait,round(CLWAIT_DELTA/1000000,2) cluster_wait,round(APWAIT_DELTA/1000000,2) app_wait,round(CCWAIT_DELTA/1000000,2) concurrency,
              round(PLSEXEC_TIME_DELTA/1000000,2) plsql_time,round(JAVEXEC_TIME_DELTA/1000000,2) java_time
             FROM DBA_HIST_SQLSTAT@'||db_name||' hsql, dba_hist_snapshot@'||db_name||' hs WHERE sql_id='''||sql_id||''' AND hsql.snap_id=hs.snap_id 
             AND hsql.instance_number = hs.instance_number
             ORDER BY hs.snap_id DESC)';
             
             -- AND hsql.executions_delta > 0 
             -- remove condition since the query does not show statements running multiple hours

  EXECUTE IMMEDIATE sql_text BULK COLLECT INTO sql_tab;
  ROLLBACK;
  RETURN sql_tab;
END GET_AWR_STATS4_SQLID;

--##########################################################################
create or replace FUNCTION                                                 GET_BLOCKING_SESSIONS (db VARCHAR2, fromDate VARCHAR2 DEFAULT NULL, toDate VARCHAR2 DEFAULT NULL)
RETURN block_sess_tab AS
  -- The AUTONOMOUS_TRANSACTION and the rollback at the end of the proc are neccessary to close
  -- the transaction open by Oracle because of the used DB link.
  PRAGMA AUTONOMOUS_TRANSACTION;
  sql_tab block_sess_tab:= block_sess_tab();
  TYPE sess_roots IS TABLE OF NUMBER;
  roots sess_roots;

  TYPE sess_attr IS RECORD
  ( BLOCKING_SESS_SID NUMBER,
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
  BLOCKING_SESS_WAIT_CLASS VARCHAR2(64),
  PREV_SQL_ID VARCHAR2(13),
  BLOCKING_SESS_PREV_SQLTEXT VARCHAR2(1000),
  BLOCKING_SESS_LOGON DATE,
  BLOCKED_SESS_LOGON DATE
  );
   TYPE sess_rec IS TABLE OF sess_attr;
   rec sess_rec;

   stmt VARCHAR2(4000);
   where_clause VARCHAR2(300);
   n BINARY_INTEGER := 0;
BEGIN

  IF (fromDate IS NULL AND toDate IS NULL) THEN
    where_clause :=  'T_STAMP = (SELECT MAX(T_STAMP) FROM DBMON_SCHEMA.DB_BLOCKING_SESSIONS)';
  ELSE
    where_clause :=  'T_STAMP > to_date('''||fromDate||''', ''yyyy-mm-dd"T"hh24:mi:ss'') AND  T_STAMP < to_date('''||toDate||''', ''yyyy-mm-dd"T"hh24:mi:ss'')';
  END IF;

    -- 1. find the roots of the tree

    stmt := 'SELECT root_id FROM
                (SELECT DISTINCT
                    CONNECT_BY_ROOT blocking_sess_sid AS root_id, blocking_sess_logontime
                FROM
                    (
                        SELECT
                            blocking_sess_sid,
                            blocked_sess_id,
                            blocking_sess_logontime,
                            blocked_sess_logontime
                        FROM
                            dbmon_schema.db_blocking_sessions
                        WHERE
                            '||where_clause||' AND db_name = UPPER('''||db||''')
                    )
                CONNECT BY NOCYCLE PRIOR blocked_sess_id = blocking_sess_sid
                             AND blocking_sess_logontime = blocked_sess_logontime
                MINUS
                SELECT DISTINCT
                    blocked_sess_id, NULL
                FROM
                    dbmon_schema.db_blocking_sessions
                WHERE
                    '||where_clause||' AND db_name = UPPER('''||db||''')
                ORDER BY blocking_sess_logontime DESC
            )' ;

    --dbms_output.put_line('count: '||stmt);

    execute immediate stmt BULK COLLECT INTO roots;

    -- 2. Get the tree for each root
    FOR i IN 1..roots.count LOOP
        begin
        -- 3. Find all branches and leafs. Start with the the root/blocking session
        /*SELECT dbmon_schema.block_sess_obj(BLOCKING_SESS_SID, BLOCKED_SESS_ID, DEPTH,
        INST_ID, LOGON_TIME, USER_NAME, OS_USER, PROGRAM, MACHINE, SQL_ID, SQL_TEXT, TIME_WAIT) BULK COLLECT INTO sql_tab
        FROM (*/
          stmt := 'SELECT DISTINCT 0 BLOCKING_SESS_SID,
                '||roots(i)||' BLOCKED_SESS_ID,
                0 AS DEPTH,
                BLOCKING_SESS_INST_ID INST_ID,
                TO_CHAR(BLOCKING_SESS_LOGONTIME, ''dd-mm-yyyy hh24:mi:ss'') LOGON_TIME,
                BLOCKING_SESS_USERNAME USER_NAME,
                BLOCKING_SESS_OSUSER OS_USER,
                BLOCKING_PROGRAM PROGRAM,
                BLOCKING_MACHINE MACHINE,
                BLOCKING_SQLID SQL_ID,
                BLOCKING_SESS_SQLTEXT SQL_TEXT,
                BLOCKING_SESS_seconds_wait TIME_WAIT,
                NULL,
                NULL,
                NULL,
                BLOCKING_SESS_WAIT_CLASS,
                PREV_SQL_ID,
                BLOCKING_SESS_PREV_SQLTEXT,
                blocking_sess_logontime,
                null
              FROM DBMON_SCHEMA.DB_BLOCKING_SESSIONS stmt
              WHERE '||where_clause||'
              AND db_name                       = UPPER('''||db||''')
              AND BLOCKING_SESS_SID             = '||roots(i)||'
              AND BLOCKING_SESS_seconds_wait =
                (SELECT MAX(BLOCKING_SESS_seconds_wait)
                FROM DBMON_SCHEMA.DB_BLOCKING_SESSIONS
                WHERE '||where_clause||'
                AND db_name           = UPPER('''||db||''')
                AND BLOCKING_SESS_SID = stmt.BLOCKING_SESS_SID
                AND BLOCKED_SESS_ID   = stmt.BLOCKED_SESS_ID
                )
            UNION ALL
            SELECT DISTINCT BLOCKING_SESS_SID,
              BLOCKED_SESS_ID,
              LEVEL AS depth,
              BLOCKED_SESS_INST_ID,
              TO_CHAR(BLOCKED_SESS_LOGONTIME, ''dd-mm-yyyy hh24:mi:ss''),
              BLOCKED_SESS_USERNAME,
              BLOCKED_SESS_OSUSER,
              BLOCKED_PROGRAM,
              BLOCKED_MACHINE,
              BLOCKED_SQLID,
              BLOCKED_SESS_SQLTEXT,
              BLOCKED_SESS_SQL_ELAPTIME_SEC,
              BLOCKING_ON_TABLE_OWNER,
              BLOCKING_ON_TABLE_NAME,
              BLOCKING_ON_ROW_ADDRESS,
              NULL,
              NULL,
              NULL,
              blocking_sess_logontime,
              blocked_sess_logontime
            FROM
              (SELECT BLOCKING_SESS_SID,
                BLOCKED_SESS_ID,
                BLOCKED_SESS_INST_ID,
                BLOCKED_SESS_LOGONTIME,
                BLOCKED_SESS_USERNAME,
                BLOCKED_SESS_OSUSER,
                BLOCKED_PROGRAM,
                BLOCKED_MACHINE,
                BLOCKED_SQLID,
                BLOCKED_SESS_SQLTEXT,
                BLOCKED_SESS_SQL_ELAPTIME_SEC,
                BLOCKING_ON_TABLE_OWNER,
                BLOCKING_ON_TABLE_NAME,
                BLOCKING_ON_ROW_ADDRESS,
                blocking_sess_logontime
              FROM DBMON_SCHEMA.DB_BLOCKING_SESSIONS stmt1
              WHERE '||where_clause||'
              AND db_name                       = UPPER('''||db||''')
              AND BLOCKED_SESS_SQL_elaptime_sec =
                (SELECT MAX(BLOCKED_SESS_SQL_elaptime_sec)
                FROM DBMON_SCHEMA.DB_BLOCKING_SESSIONS
                WHERE '||where_clause||'
                AND db_name           = UPPER('''||db||''')
                AND BLOCKING_SESS_SID = stmt1.BLOCKING_SESS_SID
                AND BLOCKED_SESS_ID   = stmt1.BLOCKED_SESS_ID
                )
              )
              START WITH BLOCKING_SESS_SID         = '||roots(i)||'
              CONNECT BY NOCYCLE BLOCKING_SESS_SID = PRIOR BLOCKED_SESS_ID  AND blocking_sess_logontime = blocked_sess_logontime';

        --dbms_output.put_line(''||stmt);
        dbms_output.put_line('=====================================');
        dbms_output.put_line(roots(i));
        dbms_output.put_line('=====================================');


        EXECUTE IMMEDIATE stmt BULK COLLECT INTO rec;

        EXCEPTION
        WHEN NO_DATA_FOUND THEN
          NULL;
        END;

        FOR j IN rec.FIRST .. rec.LAST LOOP
          sql_tab.EXTEND;
          --dbms_output.put_line( rec(j).BLOCKING_SESS_ID || ' || ' || rec(j).WAITING_SESS_ID );
          sql_tab(sql_tab.last) := block_sess_obj(rec(j).BLOCKING_SESS_SID, rec(j).WAITING_SESS_ID, rec(j).DEPTH,
                        rec(j).INST_ID, rec(j).LOGON_TIME, rec(j).USER_NAME, rec(j).OS_USER, rec(j).PROGRAM, rec(j).MACHINE,
                        rec(j).SQL_ID, rec(j).SQL_TEXT, rec(j).TIME_WAIT, rec(j).BLOCKING_ON_TABLE_OWNER, rec(j).BLOCKING_ON_TABLE_NAME,
                        rec(j).BLOCKING_ON_ROW_ADDRESS, rec(j).BLOCKING_SESS_WAIT_CLASS);
        END LOOP;




        dbms_output.put_line('count: '||sql_tab.count);

    END LOOP;
    dbms_output.put_line('final: '||sql_tab.count);

  ROLLBACK;

  RETURN sql_tab;
END GET_BLOCKING_SESSIONS;

--##########################################################################
create or replace FUNCTION                                                                                                                                     GET_EXP_PLAN_DATA(sql_id VARCHAR2, db VARCHAR2) 
RETURN exp_plan_tab AS 
  -- The AUTONOMOUS_TRANSACTION and the rollback at the end of the proc are neccessary to close 
  -- the transaction open by Oracle because of the used DB link.
  PRAGMA AUTONOMOUS_TRANSACTION;
  sql_tab exp_plan_tab:= exp_plan_tab();
  sql_tab2 exp_plan_tab:= exp_plan_tab();
  sql_text varchar2(4000);
  db_name varchar2(10) := '';
BEGIN  
  sql_text := 'BEGIN 
                dbms_application_info.set_client_info@'||db||'('''||sql_id||'''); 
               END;';
  EXECUTE IMMEDIATE sql_text;
  
  sql_text := 'SELECT dbmon_schema.exp_plan_obj(plan_table_output)
              FROM (SELECT plan_table_output 
                    FROM DBMON_SCHEMA_R.QUERY_EXPLAIN_PLAN@'||db||')';
                    
  EXECUTE IMMEDIATE sql_text bulk collect into sql_tab;
  
  -- TODO: if the query returns 0 the select sql_text
  
  --dbms_output.put_line('============');
  --dbms_output.put_line(sql_tab.count);
  
  if (sql_tab.count = 1) then
    --sql_tab := exp_plan_tab();
    sql_text := 'select distinct sql_text from gv$sql@'||db||' where sql_id = '''||sql_id||'''';
    EXECUTE IMMEDIATE sql_text bulk collect into sql_tab2;
  END IF;
  
  ROLLBACK;
  
  RETURN sql_tab;
END GET_EXP_PLAN_DATA;

--##########################################################################
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

--##########################################################################
create or replace FUNCTION                                                                                     GET_SCHEMA_DETAILS (schema_name IN VARCHAR2, db_name IN VARCHAR2) 
RETURN SCHEMA_DETAILS_TAB
AS
  -- The AUTONOMOUS_TRANSACTION and the rollback at the end of the proc are neccessary to close 
  -- the transaction open by Oracle because of the used DB link.
  PRAGMA AUTONOMOUS_TRANSACTION;
  tab SCHEMA_DETAILS_TAB:= SCHEMA_DETAILS_TAB();
  stmt VARCHAR2(4000);
  s_name VARCHAR2(30);
BEGIN
  if not (schema_name is null) then
    s_name := schema_name || '%';
  end if;
  
  stmt := 'SELECT USERNAME, nvl(RESP_NAME,''no info'') RESP_NAME, nvl(RESP_EMAIL, ''no info'') RESP_EMAIL, ACCOUNT_STATUS, 
            nvl(to_char(EXPIRY_DATE), '' '') PASSWORD_EXPIRY_DATE, nvl(EGROUP, ''no info'') EGROUP
            FROM DBA_USERS@'||db_name||'
            LEFT JOIN DBMON_SCHEMA.SCHEMA_RESPONSIBLES ON (USERNAME = SCHEMA_NAME) 
            WHERE (username LIKE '''||s_name||''')
            ORDER BY 1';
  DBMS_OUTPUT.put_line(stmt);
  stmt := 'SELECT DBMON_SCHEMA.SCHEMA_DETAILS_OBJ(USERNAME, RESP_NAME, RESP_EMAIL, ACCOUNT_STATUS, PASSWORD_EXPIRY_DATE, EGROUP) 
           FROM (' || stmt || ')';

  --DBMS_OUTPUT.put_line(stmt);
  execute immediate stmt BULK COLLECT INTO tab;
  
  ROLLBACK;
  
  return tab;
END GET_SCHEMA_DETAILS;

--##########################################################################
create or replace FUNCTION             GET_SCHEMA_SESS_DETAILS (db_name VARCHAR2, user_name VARCHAR2) 
RETURN schema_sess_details_tab AS 
  -- The AUTONOMOUS_TRANSACTION and the rollback at the end of the proc are neccessary to close 
  -- the transaction open by Oracle because of the used DB link.
  PRAGMA AUTONOMOUS_TRANSACTION;
  sql_tab schema_sess_details_tab:= schema_sess_details_tab();
  uname VARCHAR2(30);
  sql_text VARCHAR2(4000);
  where_clause varchar2(100);
BEGIN

  IF (user_name LIKE '0%') THEN
    where_clause := ' WHERE username like UPPER('''|| substr(user_name,2) ||'%'')';
  ELSE
     where_clause := ' WHERE username = UPPER('''|| user_name ||''')';
  END IF;
  
  sql_text := 'SELECT DBMON_SCHEMA.schema_sess_details_obj(INST_ID, SID, STATUS, OSUSER, PROCESS, MACHINE, PROGRAM, 
                                            SQL_ID, EVENT, WAIT_CLASS, SECONDS_IN_WAIT, SERVICE_NAME)
               FROM (
                    SELECT INST_ID, SID, STATUS, OSUSER, PROCESS, MACHINE, PROGRAM, SQL_ID, EVENT, WAIT_CLASS, SECONDS_IN_WAIT, SERVICE_NAME 
                      FROM gv$session@'|| db_name || where_clause || '
                    ORDER BY 3
                    )';

  EXECUTE IMMEDIATE sql_text BULK COLLECT INTO sql_tab;
  
  ROLLBACK;
  
  
  RETURN sql_tab;
END GET_SCHEMA_SESS_DETAILS;

--##########################################################################
create or replace FUNCTION                                                 GET_SESS_DISTRIBUTION_DATA (db VARCHAR2)
RETURN sess_distr_tab AS 
  -- The AUTONOMOUS_TRANSACTION and the rollback at the end of the proc are neccessary to close 
  -- the transaction open by Oracle because of the used DB link.
  PRAGMA AUTONOMOUS_TRANSACTION;
  sql_tab sess_distr_tab:= sess_distr_tab();
  sql_text varchar2(4000);
BEGIN
  
  sql_text := 'SELECT DBMON_SCHEMA.sess_distr_obj(node_id, username, num_active, num_sess, sess_limit, t_stamp)
                FROM
                  (SELECT sub_q.node_id, sub_q.username, sub_q.num_active, sub_q.num_sess,
                  DECODE(REPLACE(translate(p.limit,''1234567890'',''##########''),''#''), NULL, p.limit, 1000) AS sess_limit, t_stamp
                  FROM
                    (SELECT node_id, username, SUM(num_active) num_active, SUM(num_sess) num_sess, t_stamp
                    FROM
                      (SELECT node_id, username, SUM(num_active_sess) num_active, SUM(num_sess) num_sess, t_stamp
                      FROM DBMON_SCHEMA.DB_SESS_DISTR
                      WHERE DB_NAME = '''||upper(db)||'''
                      AND t_stamp   =
                        (SELECT MAX(T_STAMP) 
                        FROM DBMON_SCHEMA.DB_SESS_DISTR WHERE DB_NAME = '''||upper(db)||'''
                        )
                      GROUP BY node_id, username, t_stamp
                      UNION ALL
                      SELECT inst_id, username, 0, 0, t_stamp
                      FROM gv$instance@'||db||' gv,
                        dbmon_schema.DB_SESS_DISTR dbmon
                      WHERE DB_NAME = '''||upper(db)||'''
                      AND t_stamp   =
                        (SELECT MAX(T_STAMP) 
                        FROM DBMON_SCHEMA.DB_SESS_DISTR WHERE DB_NAME = '''||upper(db)||'''
                        )
                      GROUP BY inst_id, username, t_stamp
                      )
                    GROUP BY node_id, username, t_stamp
                    ) sub_q, DBA_PROFILES@'||db||' p, DBA_USERS@'||db||' u
                  WHERE RESOURCE_NAME = ''SESSIONS_PER_USER''
                  AND u.username      = sub_q.username
                  AND p.profile       = u.profile
                  ORDER BY 2,1
                  )';
              
              
              
  
    -- dbms_output.put_line('============');
    --dbms_output.put_line(sql_text);
    
    EXECUTE IMMEDIATE sql_text bulk collect into sql_tab;
    
    ROLLBACK;
    -- dbms_output.put_line(sql_text);
  RETURN sql_tab;
END GET_SESS_DISTRIBUTION_DATA;

--##########################################################################
create or replace FUNCTION             GET_SESSIONS_CHART_DATA(db VARCHAR2, schema_name VARCHAR2, fromDate VARCHAR2, toDate VARCHAR2, node NUMBER)
RETURN sess_distr_tab AS 
  -- The AUTONOMOUS_TRANSACTION and the rollback at the end of the proc are neccessary to close 
  -- the transaction open by Oracle because of the used DB link.
  PRAGMA AUTONOMOUS_TRANSACTION;
  sql_tab sess_distr_tab:= sess_distr_tab();
  sql_text varchar2(4000);
BEGIN
  dbms_output.put_line(fromDate||'  '||toDate);
  sql_text := 'SELECT DBMON_SCHEMA.sess_distr_obj(node_id, username, num_active, num_sess, sess_limit, t_stamp)
                FROM
                  (SELECT sub_q.node_id, sub_q.username, sub_q.num_active, sub_q.num_sess,
                  DECODE(REPLACE(translate(p.limit,''1234567890'',''##########''),''#''), NULL, p.limit, 1000) AS sess_limit, t_stamp
                  FROM
                    (SELECT node_id, username, SUM(num_active) num_active, SUM(num_sess) num_sess, t_stamp
                    FROM
                      (SELECT node_id, username, SUM(num_active_sess) num_active, SUM(num_sess) num_sess, t_stamp
                      FROM DBMON_SCHEMA.DB_SESS_DISTR
                      WHERE DB_NAME = '''||upper(db)||'''
                      AND t_stamp  > to_date('''||fromDate||''', ''yyyy-mm-dd"T"hh24-mi'') 
                      AND t_stamp < to_date('''||toDate||''', ''yyyy-mm-dd"T"hh24-mi'')
                      AND username =  upper('''||schema_name||''') and node_id = '||node||'
                      GROUP BY node_id, username, t_stamp
                      )
                    GROUP BY node_id, username, t_stamp
                    order by t_stamp
                    ) sub_q, DBA_PROFILES@'||db||' p, DBA_USERS@'||db||' u
                  WHERE RESOURCE_NAME = ''SESSIONS_PER_USER''
                  AND u.username      = sub_q.username
                  AND p.profile       = u.profile
                  ORDER BY t_stamp
                  )';
    
    EXECUTE IMMEDIATE sql_text bulk collect into sql_tab;
    
    ROLLBACK;
    dbms_output.put_line(sql_text);
  RETURN sql_tab;
END GET_SESSIONS_CHART_DATA;

--##########################################################################
create or replace FUNCTION             GET_STORAGE_DATA (db VARCHAR2, schema_name VARCHAR2, selected_year NUMBER)
RETURN storage_tab AS 
  -- The AUTONOMOUS_TRANSACTION and the rollback at the end of the proc are neccessary to close 
  -- the transaction open by Oracle because of the used DB link.
  PRAGMA AUTONOMOUS_TRANSACTION;
  SQL_TAB STORAGE_TAB:= STORAGE_TAB();
  OWNER varchar2(30);
  WHERE_CLAUSE varchar2(200);
  COOL_CLAUSE varchar2(200) := '';
  SQL_TEXT varchar2(4000);
  WRAPPER varchar2(4000);
BEGIN
  if (SELECTED_YEAR = 0) then
    WHERE_CLAUSE := '';
  else
    WHERE_CLAUSE := 'and (t_stamp between to_date(''01-01-'||SELECTED_YEAR||''', ''dd-mm-yyyy'') 
                  and to_date(''31-12-'||SELECTED_YEAR||' 23:59:59'', ''dd-mm-yyyy hh24-mi-ss'') )';
  end if;
  
  if UPPER(SCHEMA_NAME) = 'ALL' then 
    OWNER := '%';
  ELSIF UPPER(SCHEMA_NAME) = 'ATLAS_COOL' THEN
    OWNER := 'ATLAS_COOLO%';
  else OWNER := UPPER(SCHEMA_NAME);
  end if;
  
  -- Add all ATLAS_COOL accounts as a group
            
                  
    sql_text := 'SELECT t.DT, TABLE_SIZE, INDEX_SIZE, '''' SCHEMA_NAME 
                FROM
                (SELECT DT, SUM(TABLE_SIZE) TABLE_SIZE
                FROM (
                SELECT TRUNC(t_stamp, ''MM'') DT, DB_NAME, OWNER, SEGMENT_TYPE, SIZE_MB TABLE_SIZE
                  FROM DBMON_SCHEMA.DB_VOLUME_SCHEMES
                  WHERE  TRUNC(t_stamp, ''DDD'') = TRUNC(t_stamp, ''MONTH'') '||where_clause||'
                  AND DB_NAME = UPPER('''||db||''')
                  AND OWNER LIKE UPPER('''||owner||''')
                  AND (SEGMENT_TYPE LIKE ''TABLE%''
                  OR SEGMENT_TYPE IN (''LOBSEGMENT'', ''LOB PARTITION''))
                ORDER BY T_STAMP
                )
                GROUP BY DT
                ORDER BY DT) t
                JOIN 
                (SELECT DT, SUM(INDEX_SIZE) INDEX_SIZE
                FROM (
                SELECT TRUNC(t_stamp, ''MM'') DT, DB_NAME, OWNER, SEGMENT_TYPE, SIZE_MB INDEX_SIZE
                  FROM DBMON_SCHEMA.DB_VOLUME_SCHEMES
                  WHERE  TRUNC(t_stamp, ''DDD'') = TRUNC(t_stamp, ''MONTH'') '||where_clause||'
                  AND DB_NAME = UPPER('''||db||''')
                  AND OWNER LIKE UPPER('''||owner||''')
                  AND SEGMENT_TYPE LIKE ''INDEX%''
                ORDER BY T_STAMP
                )
                GROUP BY DT
                ORDER BY DT) i
                on t.DT = i.DT';
  
  dbms_output.put_line('============'|| sql_text);

  WRAPPER := 'SELECT DBMON_SCHEMA.STORAGE_OBJ(TO_CHAR(trunc(DT, ''MM''), ''MON-YY''), 
                      ROUND(INDEX_SIZE/1024, 2), ROUND(TABLE_SIZE/1024, 2))
                FROM ('||sql_text||')';
           
    dbms_output.put_line('============================================');
    dbms_output.put_line(wrapper);         
  EXECUTE IMMEDIATE wrapper BULK COLLECT INTO sql_tab;
  
  ROLLBACK;
  
  RETURN sql_tab;
END GET_STORAGE_DATA;

--##########################################################################
create or replace FUNCTION                                                  GET_TOP10_PER_SCHEMA (db VARCHAR2, node NUMBER, schema_name VARCHAR2, fromDate VARCHAR2, toDate VARCHAR2)
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
                FROM DBMON_SCHEMA.CHART_METRICS
                WHERE DB_NAME = UPPER('''|| db ||''')
                AND T_STAMP >= TO_DATE('''|| fromDate ||''', ''YYYY-MM-DD"T"HH24:MI:SS'') AND T_STAMP < TO_DATE('''|| toDate ||''', ''YYYY-MM-DD"T"HH24:MI:SS'')
                AND CHART_TYPE = '''|| j.METRIC_NAME ||''' and inst_id = '|| node || ' AND parsing_schema_name like ''' || schema_name || '%'' 
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
END GET_TOP10_PER_SCHEMA;

--##########################################################################
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
                FROM DBMON_SCHEMA.CHART_METRICS
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

--##########################################################################
create or replace FUNCTION                         GET_TOP10_SESSIONS_DATA(db VARCHAR2, fromDate VARCHAR2, toDate VARCHAR2)
  RETURN TOP10_TAB AS
  -- The AUTONOMOUS_TRANSACTION and the rollback at the end of the proc are neccessary to close 
  -- the transaction open by Oracle because of the used DB link.
  PRAGMA AUTONOMOUS_TRANSACTION;
  tab TOP10_TAB:= TOP10_TAB();
  stmt varchar2(32000);
  unionn VARCHAR2(15) := ' UNION ALL ';
  idxj number;
  met_cnt number;
  node_num number;
BEGIN
    
    SELECT DBNODES into node_num FROM DBMON_SCHEMA.DATABASES WHERE UPPER(DBNAME) = UPPER(db);
    
    SELECT count(*) into met_cnt
    FROM DBMON_SCHEMA.DB_METRIC_DESC  
    WHERE METRIC_ID >= 20000;
  
    for i in 1..node_num
      loop
      idxj := 0;    
      for j in ( SELECT METRIC_NAME FROM DBMON_SCHEMA.DB_METRIC_DESC WHERE METRIC_ID >= 20000 )
        loop
        idxj := idxj + 1;
        
        if (i = node_num) and (idxj = met_cnt) then 
          unionn := '';
        end if;
        
        stmt := stmt || 'SELECT inst_id,  chart_type,  parsing_schema_name,  sqlid,  metric_value,  metric_unit, substr(sql_text, 1, 100) sql_text 
                 FROM 
                 (SELECT inst_id,  chart_type,  parsing_schema_name,  sqlid,  metric_value,  metric_unit, db_name from
                    (
                    SELECT inst_id,  chart_type,  parsing_schema_name,  sql_id as sqlid,  AVG(metric_value) metric_value,  metric_unit, db_name
                    FROM DBMON_SCHEMA.CHART_METRICS
                    WHERE DB_NAME = UPPER('''|| db ||''')
                    AND T_STAMP >= TO_DATE('''|| fromDate ||''', ''YYYY-MM-DD"T"HH24:MI'') AND T_STAMP < TO_DATE('''|| toDate ||''', ''YYYY-MM-DD"T"HH24:MI'')
                    AND CHART_TYPE = '''|| j.METRIC_NAME ||''' and inst_id = '|| i ||'
                    GROUP BY inst_id,  chart_type,  parsing_schema_name,  sql_id,  metric_unit, db_name
                    ORDER BY 5 desc
                    )
                  WHERE ROWNUM <= 10) s
                  JOIN  DBMON_SCHEMA.SQL_TEXT_HIST h 
                  ON (sql_id = sqlid and s.db_name = h.db_name)
                 '|| unionn ||'';
          
        end loop;
    end loop;
    
    stmt := 'SELECT DBMON_SCHEMA.TOP10_OBJ(INST_ID,CHART_TYPE,PARSING_SCHEMA_NAME,SQLID,METRIC_VALUE,METRIC_UNIT,SQL_TEXT) 
             FROM (' || stmt || ')';
  
    DBMS_OUTPUT.put_line(stmt);
    EXECUTE IMMEDIATE stmt BULK COLLECT INTO tab;
    
    ROLLBACK;
    
    RETURN tab;
END GET_TOP10_SESSIONS_DATA;

--##########################################################################
create or replace FUNCTION             TEST_CONNECTION (schema_name IN VARCHAR2, db_name IN VARCHAR2) 
                     return SCHEMA_DETAILS_TAB pipelined  AS
     
cool_db_link    VARCHAR2(100);
  v_stmt_str      VARCHAR2(4000);  
  TYPE TagCurTyp  IS REF CURSOR;
  v_tag_cursor    TagCurTyp; 
  
  
  TYPE SCHEMA_DETAILS_rec is record  
  (
    USERNAME VARCHAR2(30),
    RESP_NAME VARCHAR2(1000),
    RESP_EMAIL VARCHAR2(1000),
    ACCOUNT_STATUS VARCHAR2(32),
    PASSWORD_EXPIRY_DATE VARCHAR2(30),
    EGROUP VARCHAR2(50)
  );
  v_row SCHEMA_DETAILS_rec;
   
  tbl_exist number;
  begin

  /* Check if table exists */

--  select count(*) into tbl_exist from all_tables where table_name = foldernamestr and owner = arg_schemaname;



    --create a query for nodes --
  v_stmt_str := 'SELECT USERNAME, nvl(RESP_NAME,''no info'') RESP_NAME, nvl(RESP_EMAIL, ''no info'') RESP_EMAIL, ACCOUNT_STATUS, 
            nvl(to_char(EXPIRY_DATE), '' '') PASSWORD_EXPIRY_DATE, nvl(EGROUP, ''no info'') EGROUP
            FROM DBA_USERS@'||db_name||'
            LEFT JOIN DBMON_SCHEMA.SCHEMA_RESPONSIBLES ON (USERNAME = SCHEMA_NAME) 
            WHERE (username LIKE '''||schema_name||''')
            ORDER BY 1';
  --DBMS_OUTPUT.put_line(stmt);
  --stmt := 'SELECT DBMON_SCHEMA.SCHEMA_DETAILS_OBJ(USERNAME, RESP_NAME, RESP_EMAIL, ACCOUNT_STATUS, PASSWORD_EXPIRY_DATE, EGROUP) 
           --FROM (' || stmt || ')';
      
-- Open cursor & specify bind argument in USING clause:
-- Fetch rows from result set one at a time:

  OPEN v_tag_cursor FOR v_stmt_str;
  LOOP
    FETCH v_tag_cursor INTO v_row;
  EXIT WHEN v_tag_cursor%NOTFOUND;
    pipe row(SCHEMA_DETAILS_OBJ(v_row.USERNAME, v_row.RESP_NAME, v_row.RESP_EMAIL, v_row.ACCOUNT_STATUS, v_row.PASSWORD_EXPIRY_DATE, v_row.EGROUP) );
  END LOOP; 
  -- Close cursor on channels 
  CLOSE v_tag_cursor; 

 -- exception
 -- when OTHERS then
   --   dbms_output.put_line('Skip ' || arg_schemaname);

END TEST_CONNECTION;

--##########################################################################
create or replace FUNCTION                         TOP10_TEST (db VARCHAR2, node NUMBER, schema_name VARCHAR2, fromDate VARCHAR2, toDate VARCHAR2)
RETURN TOP10_TAB
AUTHID CURRENT_USER
AS
tab TOP10_TAB:= TOP10_TAB();
stmt varchar2(32000);
unionn VARCHAR2(15) := ' UNION ALL ';
idxj number;
met_cnt number;
node_num number;
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
                  SELECT inst_id,  chart_type,  parsing_schema_name,  sql_id as sqlid,  sum(metric_value) metric_value,  metric_unit, db_name
                  FROM DBMON_SCHEMA.CHART_METRICS
                  WHERE DB_NAME = UPPER('''|| db ||''')
                  AND T_STAMP >= TO_DATE('''|| fromDate ||''', ''DD-MM-YYYY/HH24:MI:SS'') AND T_STAMP < TO_DATE('''|| toDate ||''', ''DD-MM-YYYY/HH24:MI:SS'')
                  AND CHART_TYPE = '''|| j.METRIC_NAME ||''' and inst_id = '|| node || ' AND parsing_schema_name = ''' || schema_name || ''' 
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
  execute immediate stmt BULK COLLECT INTO tab;
  return tab;
END TOP10_TEST;

--##########################################################################

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
from DBA_APPLY_PROGRESS@offdb p, dba_apply@offdb a where p.apply_name = a.apply_name';
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




--##########################################################################
-- Custom Types
--##########################################################################
create or replace TYPE             TOP10_OBJ AS OBJECT
(
INST_ID	NUMBER(1,0),
CHART_TYPE	VARCHAR2(20 BYTE),
PARSING_SCHEMA_NAME	VARCHAR2(30 BYTE),
SQL_ID	VARCHAR2(30 BYTE),
METRIC_VALUE	NUMBER,
METRIC_UNIT	VARCHAR2(35 BYTE),
SQL_TEXT	VARCHAR2(4000 BYTE)
);

--##########################################################################
create or replace TYPE             TOP10_TAB AS TABLE OF DBMON_SCHEMA.TOP10_OBJ;

--##########################################################################
create or replace TYPE             APPLYLAG_OBJ AS OBJECT
(
source  		VARCHAR2(30 BYTE),
apply_lag		VARCHAR2(64 BYTE),
snapshot_time 	VARCHAR2(30 BYTE),
status  		VARCHAR2(32 BYTE)
);

--##########################################################################
create or replace TYPE             APPLYLAG_TAB AS TABLE OF DBMON_SCHEMA.APPLYLAG_OBJ;

--##########################################################################