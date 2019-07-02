--------------------------------------------------------
--  File created - Tuesday-July-02-2019   
--------------------------------------------------------
--------------------------------------------------------
--  DDL for Package DBMON_PKG
--------------------------------------------------------

  CREATE OR REPLACE PACKAGE "DBMON_SCHEMA"."DBMON_PKG" AS
    FUNCTION get_all_schemas(
        db_name VARCHAR2
    )RETURN schema_tab;

    FUNCTION get_apply_lag(
        db_name VARCHAR2
    )RETURN applylag_tab;

    FUNCTION get_awr_stats4_sqlid(
        db_name   VARCHAR2,
        sql_id    VARCHAR2
    )RETURN awr_tab;

    FUNCTION get_blocking_sessions(
        db_name         VARCHAR2,
        from_date   VARCHAR2 DEFAULT NULL,
        to_date     VARCHAR2 DEFAULT NULL
    )RETURN block_sess_tab;

    FUNCTION get_basic_metrics(
        db_name         VARCHAR2,
        mins       NUMBER
    )RETURN basic_metrics_tab;

    FUNCTION get_db_up_status(
        db_name VARCHAR2
    )RETURN db_up_tab;

    FUNCTION get_exp_plan_data(
        sql_id   VARCHAR2,
        db_name       VARCHAR2
    )RETURN exp_plan_tab;

    FUNCTION get_jobs_info(
        db_name         VARCHAR2,
        schema_name VARCHAR2
    )RETURN job_info_tab;

    FUNCTION get_account_info(
        schema_name   IN   VARCHAR2,
        db_name       IN   VARCHAR2
    )RETURN account_info_tab;

    FUNCTION get_schema_sess_details(
        db_name     VARCHAR2,
        user_name   VARCHAR2
    )RETURN schema_sess_details_tab;

    FUNCTION get_sess_distribution_func(
        db_name VARCHAR2
    )RETURN sess_distr_tab;

    FUNCTION get_compact_sess_distribution(
        db_name VARCHAR2
    )RETURN compact_sess_distr_tab;

    FUNCTION get_num_sessions_chart(
        db_name            VARCHAR2,
        schema_name   VARCHAR2,
        from_date      VARCHAR2,
        to_date        VARCHAR2,
        node          NUMBER
    )RETURN sess_distr_tab;

    FUNCTION get_storage_data(
        db_name              VARCHAR2,
        schema_name     VARCHAR2,
        selected_year   NUMBER
    )RETURN storage_tab;

    FUNCTION get_top10_per_schema_allnodes(
        db_name            VARCHAR2,
        schema_name   VARCHAR2,
        from_date      VARCHAR2,
        to_date        VARCHAR2
    )RETURN top10_tab;

    FUNCTION get_top10_per_schema(
        db_name            VARCHAR2,
        node          NUMBER,
        schema_name   VARCHAR2,
        from_date      VARCHAR2,
        to_date        VARCHAR2
    )RETURN top10_tab;

    FUNCTION get_schema_sess_distribution(
        db_name            VARCHAR2,
        schema_name   VARCHAR2
    )RETURN schema_sess_distr_tab;

    FUNCTION get_top10_sessions_data(
        db_name         VARCHAR2,
        from_date   VARCHAR2,
        to_date     VARCHAR2
    )RETURN top10_tab;

    FUNCTION get_top10_tables_per_schema(
        db_name              VARCHAR2,
        schema_name     VARCHAR2,
        selected_year   NUMBER
    )RETURN top10_tables_tab;

END dbmon_pkg;


/
--------------------------------------------------------
--  DDL for Package Body DBMON_PKG
--------------------------------------------------------

  CREATE OR REPLACE PACKAGE BODY "DBMON_SCHEMA"."DBMON_PKG" AS

    FUNCTION get_all_schemas(
        db_name VARCHAR2
    )RETURN schema_tab AS 
          -- The AUTONOMOUS_TRANSACTION and the rollback at the end of the proc are neccessary to close 
          -- the transaction open by Oracle because of the used DB link.

        PRAGMA autonomous_transaction;
        sql_tab       schema_tab := schema_tab();
        cool_clause   VARCHAR2(200);
        sql_text      VARCHAR2(4000);
        wrapper       VARCHAR2(4000);
    BEGIN
        IF(upper(db_name)= 'OFFDB')THEN
            cool_clause := 'UNION 
                       SELECT ''ATLAS_COOL'' 
                         FROM DUAL';
        END IF;
        IF(upper(db_name)= 'ALL')THEN
            SELECT
                dbmon_schema.schema_obj(username)
            BULK COLLECT
            INTO sql_tab
            FROM
                (
                    SELECT DISTINCT
                        username
                    FROM
                        dbmon_schema.schema_details
                    ORDER BY
                        1
                );

        ELSE
            sql_text := 'SELECT DBMON_SCHEMA.schema_obj(username)
                       FROM (
                    SELECT username 
                        FROM dba_users@'
                        || db_name
                        || '
                        WHERE (username NOT LIKE ''%\_R'' escape ''\'' AND username NOT LIKE ''%\_W'' escape ''\'') 
                        AND username LIKE ''ATLAS%''
                    UNION 
                     SELECT ''ALL'' FROM DUAL '
                        || cool_clause
                        || '
                     ORDER BY 1)';
            EXECUTE IMMEDIATE sql_text BULK COLLECT
            INTO sql_tab;
        END IF;

        ROLLBACK;
        RETURN sql_tab;
    END get_all_schemas;

    FUNCTION get_apply_lag(
        db_name VARCHAR2
    )RETURN applylag_tab AS 
        -- The AUTONOMOUS_TRANSACTION and the rollback at the end of the proc are neccessary to close 
        -- the transaction open by Oracle because of the used DB link.
        PRAGMA autonomous_transaction;
        sql_tab    applylag_tab := applylag_tab();
        sql_text   VARCHAR2(4000);
    BEGIN
        IF(upper(db_name)= 'OFFDB')THEN
            sql_text := 'select a.apply_name as source, TO_CHAR((APPLY_TIME - APPLIED_MESSAGE_CREATE_TIME)*86400) as apply_lag, TO_CHAR(SYSDATE, ''YYYY-MM-DD HH24:MI:SS'') as snapshot_time, status 
            from DBA_APPLY_PROGRESS@offdb p, dba_apply@offdb a where p.apply_name = a.apply_name and a.apply_name !=''OGG$C_COOLOF'' '
            ;
                --DBMS_OUTPUT.put_line(sql_text);
        ELSE
            sql_text := 'SELECT NULL as source, sysdate + (TO_DSINTERVAL(VALUE) * 86400) - sysdate as apply_lag, NULL as snapshot_time, NULL as status FROM gV$DATAGUARD_STATS@'
                        || db_name
                        || ' WHERE NAME = ''apply lag'' AND value IS NOT NULL';
            --DBMS_OUTPUT.put_line(sql_text);
        END IF;

        sql_text := 'SELECT DBMON_SCHEMA.APPLYLAG_OBJ(SOURCE,APPLY_LAG,SNAPSHOT_TIME,STATUS) 
                     FROM ('
                    || sql_text
                    || ')';
        --DBMS_OUTPUT.put_line(sql_text);
        EXECUTE IMMEDIATE sql_text BULK COLLECT
        INTO sql_tab;
        ROLLBACK;
        RETURN sql_tab;
    END get_apply_lag;

    FUNCTION get_awr_stats4_sqlid(
        db_name   VARCHAR2,
        sql_id    VARCHAR2
    )RETURN awr_tab AS 
          -- The AUTONOMOUS_TRANSACTION and the rollback at the end of the proc are neccessary to close 
          -- the transaction open by Oracle because of the used DB link.

        PRAGMA autonomous_transaction;
        sql_tab    awr_tab := awr_tab();
        sql_text   VARCHAR2(4000);
        wrapper    VARCHAR2(4000);
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
                      MODULE, PARSING_SCHEMA_NAME, FETCHES_DELTA fetches,		       SORTS_DELTA sorts, EXECUTIONS_DELTA execs, PX_SERVERS_EXECS_DELTA pxexecs, 
                      LOADS_DELTA loads, INVALIDATIONS_DELTA invalid, PARSE_CALLS_DELTA parse_calls, DISK_READS_DELTA disk_reads,BUFFER_GETS_DELTA buffer_gets,
                      DIRECT_WRITES_DELTA direct_writes, ROWS_PROCESSED_DELTA rows_proc, round(CPU_TIME_DELTA/1000000,2) cpu_time, 
                      round(ELAPSED_TIME_DELTA/1000000,2) elapsed_time, 
                      round(DECODE(EXECUTIONS_DELTA, 0, 1, round(ELAPSED_TIME_DELTA/1000000,2))/DECODE(EXECUTIONS_DELTA, 0, 1, EXECUTIONS_DELTA), 2) etime_per_exec, 
                      round(IOWAIT_DELTA/1000000,2) iowait,round(CLWAIT_DELTA/1000000,2) cluster_wait,round(APWAIT_DELTA/1000000,2) app_wait,round(CCWAIT_DELTA/1000000,2) concurrency,
                      round(PLSEXEC_TIME_DELTA/1000000,2) plsql_time,round(JAVEXEC_TIME_DELTA/1000000,2) java_time
                     FROM DBA_HIST_SQLSTAT@'
                    || db_name
                    || ' hsql, dba_hist_snapshot@'
                    || db_name
                    || ' hs WHERE sql_id='''
                    || sql_id
                    || ''' AND hsql.snap_id=hs.snap_id 
                     AND hsql.instance_number = hs.instance_number
                     ORDER BY hs.snap_id DESC)'
                    ;

                 -- AND hsql.executions_delta > 0 
                 -- remove condition since the query does not show statements running multiple hours

        EXECUTE IMMEDIATE sql_text BULK COLLECT
        INTO sql_tab;
        ROLLBACK;
        RETURN sql_tab;
    END get_awr_stats4_sqlid;

    FUNCTION get_basic_metrics(
        db_name   VARCHAR2,
        mins      NUMBER
    )RETURN basic_metrics_tab AS 
          -- The AUTONOMOUS_TRANSACTION and the rollback at the end of the proc are neccessary to close 
          -- the transaction open by Oracle because of the used DB link.

        PRAGMA autonomous_transaction;
        sql_tab    basic_metrics_tab := basic_metrics_tab();
        sql_text   VARCHAR2(4000);
        wrapper    VARCHAR2(4000);
    BEGIN
        sql_text := 'SELECT basic_metrics_OBJ(metric, unit, threshold, visible, cnt_nodes, Node1, Node2, Node3, Node4)
                    FROM (
                    SELECT metric, unit, threshold, visible, cnt_nodes, Node1, Node2, Node3, Node4  FROM
                    (
                      SELECT DISTINCT
                        round(AVG(dbhm.metric_value)OVER(
                            PARTITION BY dbhm.metric_id,dbhm.inst_id
                        ))AS avg_cnt,
                        dbhm.inst_id            AS inst_id,
                        dbmd.metric_name        AS metric,
                        dbmd.metric_unit        AS unit,
                        dbmt.threshold          AS threshold,
                        dbmd.homepage_visible   AS visible,
                        dbs.dbnodes             AS cnt_nodes
                    FROM
                        dbmon_schema.db_hist_metrics        dbhm
                        JOIN dbmon_schema.db_metric_desc         dbmd ON dbhm.metric_id = dbmd.metric_id
                        JOIN dbmon_schema.db_metrics_threshold dbmt ON(dbhm.metric_id = dbmt.metric_id
                                                                      AND dbhm.dbname = dbmt.dbname)
                        LEFT JOIN dbmon_schema.databases              dbs ON dbhm.dbname = dbs.dbname
                    WHERE
                        t_stamp > SYSDATE -('
                    || mins
                    || ' /(24*60))
                        AND upper(dbhm.dbname)= upper('''
                    || db_name
                    || ''')
                    ORDER BY
                        dbhm.inst_id
                    )
                    PIVOT
                    (
                      MAX(avg_cnt)
                      FOR inst_id IN (1 as Node1, 2 as Node2, 3 as Node3, 4 as Node4)
                    )
                    ORDER BY metric)'
                    ;
        EXECUTE IMMEDIATE sql_text BULK COLLECT
        INTO sql_tab;
        ROLLBACK;
        RETURN sql_tab;
    END get_basic_metrics;

    FUNCTION get_blocking_sessions(
        db_name     VARCHAR2,
        from_date   VARCHAR2 DEFAULT NULL,
        TO_DATE     VARCHAR2 DEFAULT NULL
    )RETURN block_sess_tab AS
  -- The AUTONOMOUS_TRANSACTION and the rollback at the end of the proc are neccessary to close
  -- the transaction open by Oracle because of the used DB link.

        PRAGMA autonomous_transaction;
        sql_tab        block_sess_tab := block_sess_tab();
        TYPE sess_roots IS
            TABLE OF NUMBER;
        roots          sess_roots;
        TYPE sess_attr IS RECORD(
            blocking_sess_sid            NUMBER,
            waiting_sess_id              NUMBER,
            depth                        NUMBER,
            inst_id                      NUMBER,
            logon_time                   VARCHAR2(20),
            user_name                    VARCHAR2(30),
            os_user                      VARCHAR2(30),
            program                      VARCHAR2(48),
            machine                      VARCHAR2(64),
            sql_id                       VARCHAR2(13),
            sql_text                     VARCHAR2(1000),
            time_wait                    NUMBER,
            blocking_on_table_owner      VARCHAR2(30),
            blocking_on_table_name       VARCHAR2(30),
            blocking_on_row_address      VARCHAR2(18),
            blocking_sess_wait_class     VARCHAR2(64),
            prev_sql_id                  VARCHAR2(13),
            blocking_sess_prev_sqltext   VARCHAR2(1000),
            blocking_sess_logon          DATE,
            blocked_sess_logon           DATE
        );
        TYPE sess_rec IS
            TABLE OF sess_attr;
        rec            sess_rec;
        stmt           VARCHAR2(4000);
        where_clause   VARCHAR2(300);
        n              BINARY_INTEGER := 0;
    BEGIN
        IF(from_date IS NULL AND TO_DATE IS NULL)THEN
            where_clause := 'T_STAMP = (SELECT MAX(T_STAMP) FROM DBMON_SCHEMA.DB_BLOCKING_SESSIONS)';
        ELSE
            where_clause := 'T_STAMP > to_date('''
                            || from_date
                            || ''', ''yyyy-mm-dd"T"hh24:mi:ss'') AND  T_STAMP < to_date('''
                            || TO_DATE
                            || ''', ''yyyy-mm-dd"T"hh24:mi:ss'')';
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
                            '
                || where_clause
                || ' AND db_name = UPPER('''
                || db_name
                || ''')
                    )
                CONNECT BY NOCYCLE PRIOR blocked_sess_id = blocking_sess_sid
                             AND blocking_sess_logontime = blocked_sess_logontime
                MINUS
                SELECT DISTINCT
                    blocked_sess_id, NULL
                FROM
                    dbmon_schema.db_blocking_sessions
                WHERE
                    '
                || where_clause
                || ' AND db_name = UPPER('''
                || db_name
                || ''')
                ORDER BY blocking_sess_logontime DESC
            )';

    --dbms_output.put_line('count: '||stmt);

        EXECUTE IMMEDIATE stmt BULK COLLECT
        INTO roots;

    -- 2. Get the tree for each root
        FOR i IN 1..roots.count LOOP
            BEGIN
        -- 3. Find all branches and leafs. Start with the the root/blocking session
        /*SELECT dbmon_schema.block_sess_obj(BLOCKING_SESS_SID, BLOCKED_SESS_ID, DEPTH,
        INST_ID, LOGON_TIME, USER_NAME, OS_USER, PROGRAM, MACHINE, SQL_ID, SQL_TEXT, TIME_WAIT) BULK COLLECT INTO sql_tab
        FROM (*/

        --- add serial number to the query
                stmt := 'SELECT DISTINCT 0 BLOCKING_SESS_SID,
                '
                        || roots(i)
                        || ' BLOCKED_SESS_ID,
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
              WHERE '
                        || where_clause
                        || '
              AND db_name                       = UPPER('''
                        || db_name
                        || ''')
              AND BLOCKING_SESS_SID             = '
                        || roots(i)
                        || '
              AND BLOCKING_SESS_seconds_wait =
                (SELECT MAX(BLOCKING_SESS_seconds_wait)
                FROM DBMON_SCHEMA.DB_BLOCKING_SESSIONS
                WHERE '
                        || where_clause
                        || '
                AND db_name           = UPPER('''
                        || db_name
                        || ''')
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
              WHERE '
                        || where_clause
                        || '
              AND db_name                       = UPPER('''
                        || db_name
                        || ''')
              AND BLOCKED_SESS_SQL_elaptime_sec =
                (SELECT MAX(BLOCKED_SESS_SQL_elaptime_sec)
                FROM DBMON_SCHEMA.DB_BLOCKING_SESSIONS
                WHERE '
                        || where_clause
                        || '
                AND db_name           = UPPER('''
                        || db_name
                        || ''')
                AND BLOCKING_SESS_SID = stmt1.BLOCKING_SESS_SID
                AND BLOCKED_SESS_ID   = stmt1.BLOCKED_SESS_ID
                )
              )
              START WITH BLOCKING_SESS_SID         = '
                        || roots(i)
                        || '
              CONNECT BY NOCYCLE BLOCKING_SESS_SID = PRIOR BLOCKED_SESS_ID  AND blocking_sess_logontime = blocked_sess_logontime'
                        ;

        --dbms_output.put_line(''||stmt);

                dbms_output.put_line('=====================================');
                dbms_output.put_line(roots(i));
                dbms_output.put_line('=====================================');
                EXECUTE IMMEDIATE stmt BULK COLLECT
                INTO rec;
            EXCEPTION
                WHEN no_data_found THEN
                    NULL;
            END;

            FOR j IN rec.first..rec.last LOOP
                sql_tab.extend;
          --dbms_output.put_line( rec(j).BLOCKING_SESS_ID || ' || ' || rec(j).WAITING_SESS_ID );
                sql_tab(sql_tab.last):= block_sess_obj(rec(j).blocking_sess_sid,rec(j).waiting_sess_id,rec(j).depth,rec(j).inst_id
                ,rec(j).logon_time,rec(j).user_name,rec(j).os_user,rec(j).program,rec(j).machine,rec(j).sql_id,rec(j).sql_text,rec
                (j).time_wait,rec(j).blocking_on_table_owner,rec(j).blocking_on_table_name,rec(j).blocking_on_row_address,rec(j).
                blocking_sess_wait_class);

            END LOOP;

            dbms_output.put_line('count: ' || sql_tab.count);
        END LOOP;

        dbms_output.put_line('final: ' || sql_tab.count);
        ROLLBACK;
        RETURN sql_tab;
    END get_blocking_sessions;

    FUNCTION get_db_up_status(
        db_name VARCHAR2
    )RETURN db_up_tab AS 
  -- The AUTONOMOUS_TRANSACTION and the rollback at the end of the proc are neccessary to close 
  -- the transaction open by Oracle because of the used DB link.
        PRAGMA autonomous_transaction;
        sql_tab    db_up_tab := db_up_tab();
        sql_text   VARCHAR2(4000);
    BEGIN
        sql_text := 'SELECT DBMON_SCHEMA.DB_UP_OBJ(STATUS) 
           FROM ( SELECT ''1'' as STATUS from DUAL@'
                    || db_name
                    || ')';
        EXECUTE IMMEDIATE sql_text BULK COLLECT
        INTO sql_tab;
        ROLLBACK;
        RETURN sql_tab;
    END get_db_up_status;

    FUNCTION get_exp_plan_data(
        sql_id    VARCHAR2,
        db_name   VARCHAR2
    )RETURN exp_plan_tab AS 
  -- The AUTONOMOUS_TRANSACTION and the rollback at the end of the proc are neccessary to close 
  -- the transaction open by Oracle because of the used DB link.

        PRAGMA autonomous_transaction;
        sql_tab    exp_plan_tab := exp_plan_tab();
        sql_tab2   exp_plan_tab := exp_plan_tab();
        sql_text   VARCHAR2(4000);
    BEGIN
        sql_text := 'BEGIN 
                DBMS_APPLICATION_INFO.SET_MODULE@'
                    || db_name
                    || '(module_name => ''dbmon'', action_name => ''get exec_plan''); 
               END;';
        EXECUTE IMMEDIATE sql_text;
        sql_text := 'BEGIN 
                dbms_application_info.set_client_info@'
                    || db_name
                    || '('''
                    || sql_id
                    || '''); 
               END;';
        EXECUTE IMMEDIATE sql_text;
        sql_text := 'SELECT dbmon_schema.exp_plan_obj(plan_table_output)
              FROM (SELECT plan_table_output 
                    FROM DBMON_SCHEMA_R.QUERY_EXPLAIN_PLAN@'
                    || db_name
                    || ')';
        EXECUTE IMMEDIATE sql_text BULK COLLECT
        INTO sql_tab;

  -- TODO: if the query returns 0 the select sql_text

  --dbms_output.put_line('============');
  --dbms_output.put_line(sql_tab.count);
        IF(sql_tab.count = 1)THEN
    --sql_tab := exp_plan_tab();
            sql_text := 'select distinct sql_text from gv$sql@'
                        || db_name
                        || ' where sql_id = '''
                        || sql_id
                        || '''';
            EXECUTE IMMEDIATE sql_text BULK COLLECT
            INTO sql_tab2;
        END IF;

        ROLLBACK;
        RETURN sql_tab;
    END get_exp_plan_data;

    FUNCTION get_jobs_info(
        db_name       VARCHAR2,
        schema_name   VARCHAR2
    )RETURN job_info_tab AS 
  -- The AUTONOMOUS_TRANSACTION and the rollback at the end of the proc are neccessary to close 
  -- the transaction open by Oracle because of the used DB link.
        PRAGMA autonomous_transaction;
        sql_tab    job_info_tab := job_info_tab();
        sql_text   VARCHAR2(4000);
    -- Variablen
    BEGIN
        IF(schema_name = 'all')THEN
            sql_text := ' SELECT owner,    job_name,    job_class,    
                                TO_CHAR(last_start_date,''DD-MM-YYYY HH24:MI:SS'') AS last_start_date,
                                nvl(substr(last_run_duration, 0, instr(last_run_duration, ''.'')-1),''-'') AS last_run_duration,
                                last_status,    current_state,    
                                TO_CHAR(next_run_time,''DD-MM-YYYY HH24:MI:SS'') AS next_run_time,
                                repeat_interval,    info
                            FROM
                                dbmon_schema.db_scheduler_jobs
                            WHERE
                                db_name = upper( ('''
                                                    || db_name
                                                    || ''') )
                                AND t_stamp = (
                                    SELECT MAX(t_stamp)
                                    FROM dbmon_schema.db_scheduler_jobs
                                )'
                                                    ;
                                    ELSE
                                        sql_text := ' SELECT owner,    job_name,    job_class,    
                                TO_CHAR(last_start_date,''DD-MM-YYYY HH24:MI:SS'') AS last_start_date,
                                nvl(substr(last_run_duration, 0, instr(last_run_duration, ''.'')-1),''-'') AS last_run_duration,
                                last_status,    current_state,    
                                TO_CHAR(next_run_time,''DD-MM-YYYY HH24:MI:SS'') AS next_run_time,
                                repeat_interval,    info
                            FROM
                                dbmon_schema.db_scheduler_jobs
                            WHERE
                                db_name = upper('''
                                                    || db_name
                                                    || ''')
                                AND owner LIKE upper( '''
                                                    || schema_name
                                                    || ''')
                                AND t_stamp = (
                                    SELECT MAX(t_stamp)
                                    FROM dbmon_schema.db_scheduler_jobs
                                )'
                                                    ;
        END IF;

        dbms_output.put_line(sql_text);
        sql_text := 'SELECT DBMON_SCHEMA.JOB_INFO_OBJ(OWNER, JOB_NAME, JOB_CLASS, LAST_START_DATE, LAST_RUN_DURATION, LAST_STATUS, CURRENT_STATE, NEXT_RUN_TIME, REPEAT_INTERVAL, INFO) 
           FROM ('
                    || sql_text
                    || ')';
        EXECUTE IMMEDIATE sql_text BULK COLLECT
        INTO sql_tab;
        ROLLBACK;
        RETURN sql_tab;
    END get_jobs_info;

    FUNCTION get_account_info(
        schema_name   IN   VARCHAR2,
        db_name       IN   VARCHAR2
    )RETURN account_info_tab AS
  -- The AUTONOMOUS_TRANSACTION and the rollback at the end of the proc are neccessary to close 
  -- the transaction open by Oracle because of the used DB link.

        PRAGMA autonomous_transaction;
        tab      account_info_tab := account_info_tab();
        stmt     VARCHAR2(4000);
        s_name   VARCHAR2(30);
    BEGIN
        IF NOT(schema_name IS NULL)THEN
            s_name := schema_name || '%';
        END IF;

        stmt := 'SELECT USERNAME, nvl(RESP_NAME,''no info'') RESP_NAME, nvl(RESP_EMAIL, ''no info'') RESP_EMAIL, ACCOUNT_STATUS, 
            nvl(to_char(EXPIRY_DATE), '' '') PASSWORD_EXPIRY_DATE, nvl(EGROUP, ''no info'') EGROUP
            FROM DBA_USERS@'
                || db_name
                || '
            LEFT JOIN DBMON_SCHEMA.SCHEMA_RESPONSIBLES ON (USERNAME = SCHEMA_NAME) 
            WHERE (username LIKE UPPER('''
                || s_name
                || '''))
            ORDER BY 1';
        dbms_output.put_line(stmt);
        stmt := 'SELECT DBMON_SCHEMA.ACCOUNT_INFO_OBJ(USERNAME, RESP_NAME, RESP_EMAIL, ACCOUNT_STATUS, PASSWORD_EXPIRY_DATE, EGROUP) 
           FROM ('
                || stmt
                || ')';

  --DBMS_OUTPUT.put_line(stmt);
        EXECUTE IMMEDIATE stmt BULK COLLECT
        INTO tab;
        ROLLBACK;
        RETURN tab;
    END get_account_info;

    FUNCTION get_schema_sess_details(
        db_name     VARCHAR2,
        user_name   VARCHAR2
    )RETURN schema_sess_details_tab AS 
  -- The AUTONOMOUS_TRANSACTION and the rollback at the end of the proc are neccessary to close 
  -- the transaction open by Oracle because of the used DB link.

        PRAGMA autonomous_transaction;
        sql_tab        schema_sess_details_tab := schema_sess_details_tab();
        uname          VARCHAR2(30);
        sql_text       VARCHAR2(4000);
        where_clause   VARCHAR2(100);
    BEGIN
        IF(user_name LIKE '%*')THEN
            where_clause := ' WHERE username like UPPER('''
                            || replace(user_name,'*','%')
                            || ''') ';
        ELSE
            where_clause := ' WHERE username = UPPER('''
                            || user_name
                            || ''')';
        END IF;

        sql_text := 'SELECT DBMON_SCHEMA.schema_sess_details_obj(INST_ID, SID, STATUS, OSUSER, PROCESS, MACHINE, PROGRAM, 
                                            SQL_ID, EVENT, WAIT_CLASS, SECONDS_IN_WAIT, SERVICE_NAME)
               FROM (
                    SELECT INST_ID, SID, STATUS, OSUSER, PROCESS, MACHINE, PROGRAM, SQL_ID, EVENT, WAIT_CLASS, SECONDS_IN_WAIT, SERVICE_NAME 
                      FROM gv$session@'
                    || db_name
                    || where_clause
                    || '
                    ORDER BY 3
                    )';
        EXECUTE IMMEDIATE sql_text BULK COLLECT
        INTO sql_tab;
        ROLLBACK;
        RETURN sql_tab;
    END get_schema_sess_details;

    FUNCTION get_sess_distribution_func(
        db_name VARCHAR2
    )RETURN sess_distr_tab AS 
  -- The AUTONOMOUS_TRANSACTION and the rollback at the end of the proc are neccessary to close 
  -- the transaction open by Oracle because of the used DB link.
        PRAGMA autonomous_transaction;
        sql_tab    sess_distr_tab := sess_distr_tab();
        sql_text   VARCHAR2(4000);
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
                      WHERE DB_NAME = '''
                    || upper(db_name)
                    || '''
                      AND t_stamp   =
                        (SELECT MAX(T_STAMP) 
                        FROM DBMON_SCHEMA.DB_SESS_DISTR WHERE DB_NAME = '''
                    || upper(db_name)
                    || '''
                        )
                      GROUP BY node_id, username, t_stamp
                      UNION ALL
                      SELECT inst_id, username, 0, 0, t_stamp
                      FROM gv$instance@'
                    || db_name
                    || ' gv,
                        dbmon_schema.DB_SESS_DISTR dbmon
                      WHERE DB_NAME = '''
                    || upper(db_name)
                    || '''
                      AND t_stamp   =
                        (SELECT MAX(T_STAMP) 
                        FROM DBMON_SCHEMA.DB_SESS_DISTR WHERE DB_NAME = '''
                    || upper(db_name)
                    || '''
                        )
                      GROUP BY inst_id, username, t_stamp
                      )
                    GROUP BY node_id, username, t_stamp
                    ) sub_q, DBA_PROFILES@'
                    || db_name
                    || ' p, DBA_USERS@'
                    || db_name
                    || ' u
                  WHERE RESOURCE_NAME = ''SESSIONS_PER_USER''
                  AND u.username      = sub_q.username
                  AND p.profile       = u.profile
                  ORDER BY 2,1
                  )'
                    ;

        EXECUTE IMMEDIATE sql_text BULK COLLECT
        INTO sql_tab;
        ROLLBACK;
    -- dbms_output.put_line(sql_text);
        RETURN sql_tab;
    END get_sess_distribution_func;

    FUNCTION get_compact_sess_distribution(
        db_name VARCHAR2
    )RETURN compact_sess_distr_tab AS 
  -- The AUTONOMOUS_TRANSACTION and the rollback at the end of the proc are neccessary to close 
  -- the transaction open by Oracle because of the used DB link.
        PRAGMA autonomous_transaction;
        sql_tab   compact_sess_distr_tab := compact_sess_distr_tab();
        stmt      VARCHAR2(4000);
    BEGIN
        stmt := 'Select af.USERNAME
                , CASE af.NODE1 WHEN ''0/0'' THEN '' '' ELSE af.NODE1 END as node1
                , CASE af.NODE2 WHEN ''0/0'' THEN '' '' ELSE af.NODE2 END as node2
                , CASE af.NODE3 WHEN ''0/0'' THEN '' '' ELSE af.NODE3 END as node3
                , CASE af.NODE4 WHEN ''0/0'' THEN '' '' ELSE af.NODE4 END as node4
                , bs.ACTIVE_SESS as num_active_sess, bs.SESS as num_sess, af.SESS_LIMIT, bs.WORKLOAD, bs.TO_DISPLAY  
                from (
                    SELECT * FROM
                    (
                        select node_id, username, 
                        -- as workload,
                        num_active_sess, num_sess, sess_limit, t_stamp
                        from table(DBMON_SCHEMA.GET_SESS_DISTRIBUTION_DATA('''
                || db_name
                || '''))
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
                        , round(sum(NUM_SESS) / SESS_LIMIT, 2) as WORKLOAD
                        ,sum(NUM_ACTIVE_SESS) || ''/'' || sum(NUM_SESS) AS TO_DISPLAY 
                        from table(DBMON_SCHEMA.GET_SESS_DISTRIBUTION_DATA('''
                || db_name
                || '''))
                        group by USERNAME, SESS_LIMIT) bs
                    ON af.USERNAME = bs.USERNAME'
                ;      

    -- dbms_output.put_line('============');
    --dbms_output.put_line(sql_text);
        stmt := 'SELECT DBMON_SCHEMA.COMPACT_SESS_DISTR_OBJ(username, node1, node2, node3, node4, num_active_sess, 
                                                   num_sess, sess_limit, workload, to_display) 
           FROM ('
                || stmt
                || ')
           ORDER BY num_active_sess DESC';
        EXECUTE IMMEDIATE stmt BULK COLLECT
        INTO sql_tab;
        ROLLBACK;
    -- dbms_output.put_line(sql_text);
        RETURN sql_tab;
    END get_compact_sess_distribution;

    FUNCTION get_num_sessions_chart(
        db_name       VARCHAR2,
        schema_name   VARCHAR2,
        from_date     VARCHAR2,
        TO_DATE       VARCHAR2,
        node          NUMBER
    )RETURN sess_distr_tab AS 
  -- The AUTONOMOUS_TRANSACTION and the rollback at the end of the proc are neccessary to close 
  -- the transaction open by Oracle because of the used DB link.
        PRAGMA autonomous_transaction;
        sql_tab    sess_distr_tab := sess_distr_tab();
        sql_text   VARCHAR2(4000);
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
                      WHERE DB_NAME = '''
                    || upper(db_name)
                    || '''
                      AND t_stamp  > to_date('''
                    || from_date
                    || ''', ''yyyy-mm-dd"T"hh24-mi'') 
                      AND t_stamp < to_date('''
                    || TO_DATE
                    || ''', ''yyyy-mm-dd"T"hh24-mi'')
                      AND username =  upper('''
                    || schema_name
                    || ''') and node_id = '
                    || node
                    || '
                      GROUP BY node_id, username, t_stamp
                      )
                    GROUP BY node_id, username, t_stamp
                    order by t_stamp
                    ) sub_q, DBA_PROFILES@'
                    || db_name
                    || ' p, DBA_USERS@'
                    || db_name
                    || ' u
                  WHERE RESOURCE_NAME = ''SESSIONS_PER_USER''
                  AND u.username      = sub_q.username
                  AND p.profile       = u.profile
                  ORDER BY t_stamp
                  )'
                    ;

        EXECUTE IMMEDIATE sql_text BULK COLLECT
        INTO sql_tab;
        ROLLBACK;
        dbms_output.put_line(sql_text);
        RETURN sql_tab;
    END get_num_sessions_chart;

    FUNCTION get_storage_data(
        db_name         VARCHAR2,
        schema_name     VARCHAR2,
        selected_year   NUMBER
    )RETURN storage_tab AS 
  -- The AUTONOMOUS_TRANSACTION and the rollback at the end of the proc are neccessary to close 
  -- the transaction open by Oracle because of the used DB link.

        PRAGMA autonomous_transaction;
        sql_tab        storage_tab := storage_tab();
        owner          VARCHAR2(30);
        where_clause   VARCHAR2(200);
        cool_clause    VARCHAR2(200):= '';
        sql_text       VARCHAR2(4000);
        wrapper        VARCHAR2(4000);
    BEGIN
        IF(selected_year = 0)THEN
            where_clause := '';
        ELSE
            where_clause := 'and (t_stamp between to_date(''01-01-'
                            || selected_year
                            || ''', ''dd-mm-yyyy'') 
                  and to_date(''31-12-'
                            || selected_year
                            || ' 23:59:59'', ''dd-mm-yyyy hh24-mi-ss'') )';
        END IF;

        IF upper(schema_name)= 'ALL' THEN
            owner := '%';
        ELSIF upper(schema_name)= 'ATLAS_COOL' THEN
            owner := 'ATLAS_COOLO%';
        ELSE
            owner := upper(schema_name);
        END IF;

  -- Add all ATLAS_COOL accounts as a group

        sql_text := 'SELECT t.DT, TABLE_SIZE, INDEX_SIZE, '''' SCHEMA_NAME 
                FROM
                (SELECT DT, SUM(TABLE_SIZE) TABLE_SIZE
                FROM (
                SELECT TRUNC(t_stamp, ''MM'') DT, DB_NAME, OWNER, SEGMENT_TYPE, SIZE_MB TABLE_SIZE
                  FROM DBMON_SCHEMA.DB_VOLUME_SCHEMES
                  WHERE  TRUNC(t_stamp, ''DDD'') = TRUNC(t_stamp, ''MONTH'') '
                    || where_clause
                    || '
                  AND DB_NAME = UPPER('''
                    || db_name
                    || ''')
                  AND OWNER LIKE UPPER('''
                    || owner
                    || ''')
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
                  WHERE  TRUNC(t_stamp, ''DDD'') = TRUNC(t_stamp, ''MONTH'') '
                    || where_clause
                    || '
                  AND DB_NAME = UPPER('''
                    || db_name
                    || ''')
                  AND OWNER LIKE UPPER('''
                    || owner
                    || ''')
                  AND SEGMENT_TYPE LIKE ''INDEX%''
                ORDER BY T_STAMP
                )
                GROUP BY DT
                ORDER BY DT) i
                on t.DT = i.DT'
                    ;

        dbms_output.put_line('============' || sql_text);
        wrapper := 'SELECT DBMON_SCHEMA.STORAGE_OBJ(TO_CHAR(trunc(DT, ''MM''), ''MON-YY''), 
                      ROUND(INDEX_SIZE/1024, 2), ROUND(TABLE_SIZE/1024, 2))
                FROM ('
                   || sql_text
                   || ')';
        dbms_output.put_line('============================================');
        dbms_output.put_line(wrapper);
        EXECUTE IMMEDIATE wrapper BULK COLLECT
        INTO sql_tab;
        ROLLBACK;
        RETURN sql_tab;
    END get_storage_data;

    FUNCTION get_top10_per_schema_allnodes(
        db_name       VARCHAR2,
        schema_name   VARCHAR2,
        from_date     VARCHAR2,
        TO_DATE       VARCHAR2
    )RETURN top10_tab AS
  -- The AUTONOMOUS_TRANSACTION and the rollback at the end of the proc are neccessary to close 
  -- the transaction open by Oracle because of the used DB link.

        PRAGMA autonomous_transaction;
        tab        top10_tab := top10_tab();
        stmt       VARCHAR2(32000);
        unionn     VARCHAR2(15):= ' UNION ALL ';
        idxj       NUMBER;
        met_cnt    NUMBER;
        node_num   NUMBER;
    BEGIN

  --SELECT DBNODES into node_num FROM DBMON_SCHEMA.DATABASES WHERE UPPER(DBNAME) = UPPER(db_name);
        SELECT
            COUNT(*)
        INTO met_cnt
        FROM
            dbmon_schema.db_metric_desc
        WHERE
            metric_id >= 20000;

  --FOR i IN 1..node_num
    --loop

        idxj := 0;
        FOR j IN(
            SELECT
                metric_name
            FROM
                dbmon_schema.db_metric_desc
            WHERE
                metric_id >= 20000
        )LOOP
            idxj := idxj + 1;
            IF(idxj = met_cnt)THEN
                unionn := '';
            END IF;
            stmt := stmt
                    || 'SELECT inst_id,  chart_type,  parsing_schema_name,  sqlid,  metric_value,  metric_unit, substr(sql_text, 1, 100) sql_text 
             FROM 
             (SELECT inst_id,  chart_type,  parsing_schema_name,  sqlid,  metric_value,  metric_unit, db_name from
                (
                SELECT inst_id,  chart_type,  parsing_schema_name,  sql_id as sqlid,  AVG(metric_value) metric_value,  metric_unit, db_name
                FROM DBMON_SCHEMA.TOP_SQL_PER_DB_SCHEMA
                WHERE DB_NAME = UPPER('''
                    || db_name
                    || ''')
                AND T_STAMP >= TO_DATE('''
                    || from_date
                    || ''', ''YYYY-MM-DD"T"HH24:MI:SS'') AND T_STAMP < TO_DATE('''
                    || TO_DATE
                    || ''', ''YYYY-MM-DD"T"HH24:MI:SS'')
                AND CHART_TYPE = '''
                    || j.metric_name
                    || '''  AND upper(parsing_schema_name) like upper('''
                    || schema_name
                    || '%'') 
                GROUP BY inst_id,  chart_type,  parsing_schema_name,  sql_id,  metric_unit, db_name
                ORDER BY 5 desc
                )
              WHERE ROWNUM <= 10) s
              JOIN  DBMON_SCHEMA.SQL_TEXT_HIST h 
              ON (sql_id = sqlid and s.db_name = h.db_name)
             '
                    || unionn
                    || '';

        END LOOP;
  --end loop;

        stmt := 'SELECT DBMON_SCHEMA.TOP10_OBJ(INST_ID,CHART_TYPE,PARSING_SCHEMA_NAME,SQLID,METRIC_VALUE,METRIC_UNIT,SQL_TEXT) 
           FROM ('
                || stmt
                || ')';
        dbms_output.put_line(stmt);
        EXECUTE IMMEDIATE stmt BULK COLLECT
        INTO tab;
        ROLLBACK;
        RETURN tab;
    END get_top10_per_schema_allnodes;

    FUNCTION get_schema_sess_distribution(
        db_name       VARCHAR2,
        schema_name   VARCHAR2
    )RETURN schema_sess_distr_tab AS 
      -- The AUTONOMOUS_TRANSACTION and the rollback at the end of the proc are neccessary to close 
      -- the transaction open by Oracle because of the used DB link.
        PRAGMA autonomous_transaction;
        sql_tab    schema_sess_distr_tab := schema_sess_distr_tab();
        sql_text   VARCHAR2(4000);
    BEGIN
        sql_text := 'SELECT DBMON_SCHEMA.schema_sess_distr_obj(node_id, username, num_active, num_sess, osuser, machine, program)
                    FROM
                      (
                        SELECT NODE_ID, USERNAME, NUM_ACTIVE_SESS num_active, NUM_SESS,
                        OSUSER, MACHINE, PROGRAM
                        FROM DBMON_SCHEMA.DB_SESS_DISTR 
                        WHERE db_name = UPPER('''
                    || db_name
                    || ''') AND USERNAME LIKE  CONCAT( UPPER('''
                    || schema_name
                    || '''), ''%'' ) 
                        AND t_stamp = (SELECT MAX(T_STAMP) 
                        FROM DBMON_SCHEMA.DB_SESS_DISTR WHERE DB_NAME = UPPER('''
                    || db_name
                    || '''))
                        ORDER BY 4 desc
                      )';

        EXECUTE IMMEDIATE sql_text BULK COLLECT
        INTO sql_tab;
        ROLLBACK;
        RETURN sql_tab;
    END get_schema_sess_distribution;

    FUNCTION get_top10_per_schema(
        db_name       VARCHAR2,
        node          NUMBER,
        schema_name   VARCHAR2,
        from_date     VARCHAR2,
        TO_DATE       VARCHAR2
    )RETURN top10_tab AS
  -- The AUTONOMOUS_TRANSACTION and the rollback at the end of the proc are neccessary to close 
  -- the transaction open by Oracle because of the used DB link.

        PRAGMA autonomous_transaction;
        tab        top10_tab := top10_tab();
        stmt       VARCHAR2(32000);
        unionn     VARCHAR2(15):= ' UNION ALL ';
        idxj       NUMBER;
        met_cnt    NUMBER;
        node_num   NUMBER;
    BEGIN

  --SELECT DBNODES into node_num FROM DBMON_SCHEMA.DATABASES WHERE UPPER(DBNAME) = UPPER(db_name);
        SELECT
            COUNT(*)
        INTO met_cnt
        FROM
            dbmon_schema.db_metric_desc
        WHERE
            metric_id >= 20000;

  --FOR i IN 1..node_num
    --loop

        idxj := 0;
        FOR j IN(
            SELECT
                metric_name
            FROM
                dbmon_schema.db_metric_desc
            WHERE
                metric_id >= 20000
        )LOOP
            idxj := idxj + 1;
            IF(idxj = met_cnt)THEN
                unionn := '';
            END IF;
            stmt := stmt
                    || 'SELECT inst_id,  chart_type,  parsing_schema_name,  sqlid,  metric_value,  metric_unit, substr(sql_text, 1, 100) sql_text 
             FROM 
             (SELECT inst_id,  chart_type,  parsing_schema_name,  sqlid,  metric_value,  metric_unit, db_name from
                (
                SELECT inst_id,  chart_type,  parsing_schema_name,  sql_id as sqlid,  AVG(metric_value) metric_value,  metric_unit, db_name
                FROM DBMON_SCHEMA.TOP_SQL_PER_DB_SCHEMA
                WHERE DB_NAME = UPPER('''
                    || db_name
                    || ''')
                AND T_STAMP >= TO_DATE('''
                    || from_date
                    || ''', ''YYYY-MM-DD"T"HH24:MI:SS'') AND T_STAMP < TO_DATE('''
                    || TO_DATE
                    || ''', ''YYYY-MM-DD"T"HH24:MI:SS'')
                AND CHART_TYPE = '''
                    || j.metric_name
                    || ''' and inst_id = '
                    || node
                    || ' AND parsing_schema_name like '''
                    || upper(schema_name)
                    || '%'' 
                GROUP BY inst_id,  chart_type,  parsing_schema_name,  sql_id,  metric_unit, db_name
                ORDER BY 5 desc
                )
              WHERE ROWNUM <= 10) s
              JOIN  DBMON_SCHEMA.SQL_TEXT_HIST h 
              ON (sql_id = sqlid and s.db_name = h.db_name)
             '
                    || unionn
                    || '';

        END LOOP;
  --end loop;

        stmt := 'SELECT DBMON_SCHEMA.TOP10_OBJ(INST_ID,CHART_TYPE,PARSING_SCHEMA_NAME,SQLID,ROUND(METRIC_VALUE,1),METRIC_UNIT,SQL_TEXT) 
           FROM ('
                || stmt
                || ')';
        dbms_output.put_line(stmt);
        EXECUTE IMMEDIATE stmt BULK COLLECT
        INTO tab;
        ROLLBACK;
        RETURN tab;
    END get_top10_per_schema;

    FUNCTION get_top10_sessions_data(
        db_name     VARCHAR2,
        from_date   VARCHAR2,
        TO_DATE     VARCHAR2
    )RETURN top10_tab AS
  -- The AUTONOMOUS_TRANSACTION and the rollback at the end of the proc are neccessary to close 
  -- the transaction open by Oracle because of the used DB link.

        PRAGMA autonomous_transaction;
        tab        top10_tab := top10_tab();
        stmt       VARCHAR2(32000);
        unionn     VARCHAR2(15):= ' UNION ALL ';
        idxj       NUMBER;
        met_cnt    NUMBER;
        node_num   NUMBER;
    BEGIN
        SELECT
            dbnodes
        INTO node_num
        FROM
            dbmon_schema.databases
        WHERE
            upper(dbname)= upper(db_name);

        SELECT
            COUNT(*)
        INTO met_cnt
        FROM
            dbmon_schema.db_metric_desc
        WHERE
            metric_id >= 20000;

        FOR i IN 1..node_num LOOP
            idxj := 0;
            FOR j IN(
                SELECT
                    metric_name
                FROM
                    dbmon_schema.db_metric_desc
                WHERE
                    metric_id >= 20000
            )LOOP
                idxj := idxj + 1;
                IF(i = node_num)AND(idxj = met_cnt)THEN
                    unionn := '';
                END IF;

                stmt := stmt
                        || 'SELECT inst_id,  chart_type,  parsing_schema_name,  sqlid,  metric_value,  metric_unit, substr(sql_text, 1, 100) sql_text 
                 FROM 
                 (SELECT inst_id,  chart_type,  parsing_schema_name,  sqlid,  metric_value,  metric_unit, db_name from
                    (
                    SELECT inst_id,  chart_type,  parsing_schema_name,  sql_id as sqlid,  AVG(metric_value) metric_value,  metric_unit, db_name
                    FROM DBMON_SCHEMA.CHART_METRICS
                    WHERE DB_NAME = UPPER('''
                        || db_name
                        || ''')
                    AND T_STAMP >= TO_DATE('''
                        || from_date
                        || ''', ''YYYY-MM-DD"T"HH24:MI'') AND T_STAMP < TO_DATE('''
                        || TO_DATE
                        || ''', ''YYYY-MM-DD"T"HH24:MI'')
                    AND CHART_TYPE = '''
                        || j.metric_name
                        || ''' and inst_id = '
                        || i
                        || '
                    GROUP BY inst_id,  chart_type,  parsing_schema_name,  sql_id,  metric_unit, db_name
                    ORDER BY 5 desc
                    )
                  WHERE ROWNUM <= 10) s
                  JOIN  DBMON_SCHEMA.SQL_TEXT_HIST h 
                  ON (sql_id = sqlid and s.db_name = h.db_name)
                 '
                        || unionn
                        || '';

            END LOOP;

        END LOOP;

        stmt := 'SELECT DBMON_SCHEMA.TOP10_OBJ(INST_ID,CHART_TYPE,PARSING_SCHEMA_NAME,SQLID,METRIC_VALUE,METRIC_UNIT,SQL_TEXT) 
             FROM ('
                || stmt
                || ')';
        dbms_output.put_line(stmt);
        EXECUTE IMMEDIATE stmt BULK COLLECT
        INTO tab;
        ROLLBACK;
        RETURN tab;
    END get_top10_sessions_data;

    FUNCTION get_top10_tables_per_schema(
        db_name         VARCHAR2,
        schema_name     VARCHAR2,
        selected_year   NUMBER
    )RETURN top10_tables_tab AS
  -- The AUTONOMOUS_TRANSACTION and the rollback at the end of the proc are neccessary to close 
  -- the transaction open by Oracle because of the used DB link.

        PRAGMA autonomous_transaction;
        tab            top10_tables_tab := top10_tables_tab();
        stmt           VARCHAR2(32000);
        unionn         VARCHAR2(15):= ' UNION ALL ';
        where_clause   VARCHAR2(200);
        owner          VARCHAR2(30);
        idxj           NUMBER;
        node_num       NUMBER;
    BEGIN
        IF(selected_year = 0)THEN
            where_clause := '';
        ELSE
            where_clause := 'and (t_stamp between to_date(''01-01-'
                            || selected_year
                            || ''', ''dd-mm-yyyy'') 
    and to_date(''31-12-'
                            || selected_year
                            || ' 23:59:59'', ''dd-mm-yyyy hh24-mi-ss''))';
        END IF;

        IF upper(schema_name)= 'ALL' THEN
            owner := '%';
        ELSIF upper(schema_name)= 'ATLAS_COOL' THEN
            owner := 'ATLAS_COOLO%';
        ELSE
            owner := upper(schema_name);
        END IF;

        idxj := 0;
        FOR j IN(
            SELECT
                object_name,
                object_type,
                size_mb
            FROM
                (
                    SELECT
                        object_name,
                        object_type,
                        size_mb
                    FROM
                        dbmon_schema.db_volume_objects
                    WHERE
                        t_stamp > SYSDATE - 1
                        AND object_type IN(
                            'TABLE',
                            'INDEX',
                            'TABLE PARTITION',
                            'INDEX PARTITION'
                        )
                        AND db_name = upper(db_name)
                        AND owner LIKE upper(schema_name)
                        AND size_mb IS NOT NULL
                    ORDER BY
                        size_mb DESC
                )
            WHERE
                ROWNUM <= 10
            ORDER BY
                size_mb DESC
        )LOOP
            idxj := idxj + 1;
            IF(idxj = 10)THEN
                unionn := '';
            END IF;
            stmt := stmt
                    || ' SELECT to_char(DT, ''dd-mm-yyyy'') DT, ROUND(SUM(TABLE_SIZE)/1000,3) TABLE_SIZE_GB, OBJECT_TYPE, OWNER, OBJECT_NAME
                FROM (
                SELECT TRUNC(t_stamp, ''MM'') DT, DB_NAME, OWNER, OBJECT_TYPE, OBJECT_NAME, SIZE_MB TABLE_SIZE
                  FROM DBMON_SCHEMA.DB_VOLUME_OBJECTS
                  WHERE  TRUNC(t_stamp, ''DDD'') = TRUNC(t_stamp, ''MONTH'')
                  AND DB_NAME = UPPER('''
                    || db_name
                    || ''')
                  AND OWNER LIKE UPPER('''
                    || owner
                    || ''')
                  AND OBJECT_NAME = UPPER('''
                    || j.object_name
                    || ''')
                  AND OBJECT_TYPE = UPPER('''
                    || j.object_type
                    || ''')
                  '
                    || where_clause
                    || '
                  ORDER BY T_STAMP
                )
                GROUP BY DT, OBJECT_TYPE, OWNER, OBJECT_NAME
                 '
                    || unionn
                    || '';

        END LOOP;

        stmt := 'SELECT DBMON_SCHEMA.TOP10_TABLES_OBJ(DT, TABLE_SIZE_GB, OBJECT_TYPE, OWNER, OBJECT_NAME ) 
                 FROM ('
                    || stmt
                    || ')
                ORDER BY OBJECT_NAME, DT';
        dbms_output.put_line(stmt);
        EXECUTE IMMEDIATE stmt BULK COLLECT
        INTO tab;
        ROLLBACK;
        RETURN tab;
    END get_top10_tables_per_schema;

END dbmon_pkg;


/

