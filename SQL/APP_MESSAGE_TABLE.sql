CREATE TABLE APP_MESSAGE 
(
  MESSAGE_ID NUMBER
, MESSAGE_TS TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
, MESSAGE VARCHAR2(1000) 
, DB_NAME VARCHAR2(20) DEFAULT 'ALL' 
, VALID_FROM DATE DEFAULT SYSDATE
, VALID_TO DATE DEFAULT SYSDATE +3/24
, IS_ACTIVE VARCHAR2(20) DEFAULT 'true'
, DOWNTIME VARCHAR(20) DEFAULT 'no'
, CONSTRAINT valid_dbs CHECK (DB_NAME IN ('ALL', 'OFFDB', 'ADCDB', 'ONDB', 'ADCDB_ADG', 'ONDB_ADG', 'TEST1', 'TEST2'))
, CONSTRAINT MESSAGE_LENGTH CHECK (LENGTHB(MESSAGE) >= 4)
, CONSTRAINT message_pk PRIMARY KEY (MESSAGE_ID)
);

-- Test-Messages
INSERT INTO APP_MESSAGE (MESSAGE_ID, MESSAGE_TS, MESSAGE, VALID_FROM, VALID_TO) 
	VALUES (1, SYSDATE, 'Test-message, which inform user about a very very important and critical event on the whole cluster.', SYSDATE, SYSDATE + 10);

INSERT INTO APP_MESSAGE (MESSAGE_ID, MESSAGE_TS, MESSAGE, DB_NAME, VALID_FROM, VALID_TO) 
	VALUES (2, SYSDATE, 'Test-message, which inform user about a very very important and critical event on ADCDB.', 'ADCDB', SYSDATE, SYSDATE + 10);

INSERT INTO APP_MESSAGE (MESSAGE_ID, MESSAGE_TS, MESSAGE, DB_NAME, VALID_FROM, VALID_TO, IS_ACTIVE) 
	VALUES ((SELECT MAX(MESSAGE_ID)+1 FROM APP_MESSAGE), SYSDATE, 'This message is not currently shown', 'ADCDB', SYSDATE, SYSDATE + 10, 'false');

INSERT INTO APP_MESSAGE (MESSAGE_ID, MESSAGE) 
	VALUES ((SELECT MAX(MESSAGE_ID)+1 FROM APP_MESSAGE), 'This message is added with all possible defaults');	
-- Maybe add more defaults for from / to, e.g. sysdate and sysdate +3