/**
 * 
 */
package atlas.dbmon.data;

/**
 * @author formica
 *
 */
public class MonInfo {
	
	private Long instId;
	private String parsingSchemaName;
	private Long fetches;
	private Long executions;
	private String firstLoadTime;
	private Long parseCalls;
	private Long diskReads;
	private Long directWrites;
	private Long bufferGets;
	private Long applicationWaitTime;
	private Long concurrencyWaitTime;
	private Long clusterWaitTime;
	private Float   cpuTime;
	private Float   userIoWaitTime;
	private Float   elapsedTime;
	private String  service;
	private String  module;
	private String  optimizerMode;
	private Long optimizerCost;
	private Long rowsProcessed;
	
	
	
	public MonInfo() {
		super();
	}



	public MonInfo(Long instId, String parsingSchemaName, Long fetches, Long executions, String firstLoadTime,
			Long parseCalls, Long diskReads, Long directWrites, Long bufferGets,
			Long applicationWaitTime, Long concurrencyWaitTime, Long clusterWaitTime, Float cpuTime,
			Float userIoWaitTime, Float elapsedTime, String service, String module, String optimizerMode,
			Long optimizerCost, Long rowsProcessed) {
		super();
		this.instId = instId;
		this.parsingSchemaName = parsingSchemaName;
		this.fetches = fetches;
		this.executions = executions;
		this.firstLoadTime = firstLoadTime;
		this.parseCalls = parseCalls;
		this.diskReads = diskReads;
		this.directWrites = directWrites;
		this.bufferGets = bufferGets;
		this.applicationWaitTime = applicationWaitTime;
		this.concurrencyWaitTime = concurrencyWaitTime;
		this.clusterWaitTime = clusterWaitTime;
		this.cpuTime = cpuTime;
		this.userIoWaitTime = userIoWaitTime;
		this.elapsedTime = elapsedTime;
		this.service = service;
		this.module = module;
		this.optimizerMode = optimizerMode;
		this.optimizerCost = optimizerCost;
		this.rowsProcessed = rowsProcessed;
	}



	public Long getInstId() {
		return instId;
	}



	public void setInstId(Long instId) {
		this.instId = instId;
	}



	public String getParsingSchemaName() {
		return parsingSchemaName;
	}



	public void setParsingSchemaName(String parsingSchemaName) {
		this.parsingSchemaName = parsingSchemaName;
	}



	public Long getFetches() {
		return fetches;
	}



	public void setFetches(Long fetches) {
		this.fetches = fetches;
	}



	public Long getExecutions() {
		return executions;
	}



	public void setExecutions(Long executions) {
		this.executions = executions;
	}



	public String getFirstLoadTime() {
		return firstLoadTime;
	}



	public void setFirstLoadTime(String firstLoadTime) {
		this.firstLoadTime = firstLoadTime;
	}



	public Long getParseCalls() {
		return parseCalls;
	}



	public void setParseCalls(Long parseCalls) {
		this.parseCalls = parseCalls;
	}



	public Long getDiskReads() {
		return diskReads;
	}



	public void setDiskReads(Long diskReads) {
		this.diskReads = diskReads;
	}



	public Long getDirectWrites() {
		return directWrites;
	}



	public void setDirectWrites(Long directWrites) {
		this.directWrites = directWrites;
	}



	public Long getBufferGets() {
		return bufferGets;
	}



	public void setBufferGets(Long bufferGets) {
		this.bufferGets = bufferGets;
	}



	public Long getApplicationWaitTime() {
		return applicationWaitTime;
	}



	public void setApplicationWaitTime(Long applicationWaitTime) {
		this.applicationWaitTime = applicationWaitTime;
	}



	public Long getConcurrencyWaitTime() {
		return concurrencyWaitTime;
	}



	public void setConcurrencyWaitTime(Long concurrencyWaitTime) {
		this.concurrencyWaitTime = concurrencyWaitTime;
	}



	public Long getClusterWaitTime() {
		return clusterWaitTime;
	}



	public void setClusterWaitTime(Long clusterWaitTime) {
		this.clusterWaitTime = clusterWaitTime;
	}



	public Float getCpuTime() {
		return cpuTime;
	}



	public void setCpuTime(Float cpuTime) {
		this.cpuTime = cpuTime;
	}



	public Float getUserIoWaitTime() {
		return userIoWaitTime;
	}



	public void setUserIoWaitTime(Float userIoWaitTime) {
		this.userIoWaitTime = userIoWaitTime;
	}



	public Float getElapsedTime() {
		return elapsedTime;
	}



	public void setElapsedTime(Float elapsedTime) {
		this.elapsedTime = elapsedTime;
	}



	public String getService() {
		return service;
	}



	public void setService(String service) {
		this.service = service;
	}



	public String getModule() {
		return module;
	}



	public void setModule(String module) {
		this.module = module;
	}



	public String getOptimizerMode() {
		return optimizerMode;
	}



	public void setOptimizerMode(String optimizerMode) {
		this.optimizerMode = optimizerMode;
	}



	public Long getOptimizerCost() {
		return optimizerCost;
	}



	public void setOptimizerCost(Long optimizerCost) {
		this.optimizerCost = optimizerCost;
	}



	public Long getRowsProcessed() {
		return rowsProcessed;
	}



	public void setRowsProcessed(Long rowsProcessed) {
		this.rowsProcessed = rowsProcessed;
	}


}
