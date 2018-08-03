package atlas.dbmon.data;

public class AWRInfo implements java.io.Serializable {


	/**
	 * @author petya
	 */
	private static final long serialVersionUID = -7705209111920210543L;

	private int inst;
	private String begin_time;
	private String module;
	private String parsing_schema_name;
	private long fetches;
	private long sorts;
	private long execs;
	private long pxexecs;
	private long loads;
	private int invalid;
	private long parse_calls;
	private long disk_reads;
	private long buffer_gets;
	private long direct_writes;
	private long rows_proc;
	private int cpu_time;
	private int elapsed_time;
	private long etime_per_exec;
	private int iowait;
	private int cluster_wait;
	private int app_wait;
	private int concurrency;
	private int plsql_time;
	private long plan_hash_value;


	public AWRInfo() {
		super();
	}

	public int getInst() {
		return inst;
	}


	public void setInst(int inst) {
		this.inst = inst;
	}


	public String getBegin_time() {
		return begin_time;
	}


	public void setBegin_time(String begin_time) {
		this.begin_time = begin_time;
	}


	public String getModule() {
		return module;
	}


	public void setModule(String module) {
		this.module = module;
	}


	public String getParsing_schema_name() {
		return parsing_schema_name;
	}


	public void setParsing_schema_name(String parsing_schema_name) {
		this.parsing_schema_name = parsing_schema_name;
	}


	public long getFetches() {
		return fetches;
	}


	public void setFetches(long fetches) {
		this.fetches = fetches;
	}


	public long getSorts() {
		return sorts;
	}


	public void setSorts(long sorts) {
		this.sorts = sorts;
	}


	public long getExecs() {
		return execs;
	}


	public void setExecs(long execs) {
		this.execs = execs;
	}


	public long getPxexecs() {
		return pxexecs;
	}


	public void setPxexecs(long pxexecs) {
		this.pxexecs = pxexecs;
	}


	public long getLoads() {
		return loads;
	}


	public void setLoads(long loads) {
		this.loads = loads;
	}


	public int getInvalid() {
		return invalid;
	}


	public void setInvalid(int invalid) {
		this.invalid = invalid;
	}


	public long getParse_calls() {
		return parse_calls;
	}


	public void setParse_calls(long parse_calls) {
		this.parse_calls = parse_calls;
	}


	public long getDisk_reads() {
		return disk_reads;
	}


	public void setDisk_reads(long disk_reads) {
		this.disk_reads = disk_reads;
	}


	public long getBuffer_gets() {
		return buffer_gets;
	}


	public void setBuffer_gets(long buffer_gets) {
		this.buffer_gets = buffer_gets;
	}


	public long getDirect_writes() {
		return direct_writes;
	}


	public void setDirect_writes(long direct_writes) {
		this.direct_writes = direct_writes;
	}


	public long getRows_proc() {
		return rows_proc;
	}


	public void setRows_proc(long rows_proc) {
		this.rows_proc = rows_proc;
	}


	public int getCpu_time() {
		return cpu_time;
	}


	public void setCpu_time(int cpu_time) {
		this.cpu_time = cpu_time;
	}


	public int getElapsed_time() {
		return elapsed_time;
	}


	public void setElapsed_time(int elapsed_time) {
		this.elapsed_time = elapsed_time;
	}


	public long getEtime_per_exec() {
		return etime_per_exec;
	}


	public void setEtime_per_exec(long etime_per_exec) {
		this.etime_per_exec = etime_per_exec;
	}


	public int getIowait() {
		return iowait;
	}


	public void setIowait(int iowait) {
		this.iowait = iowait;
	}


	public int getCluster_wait() {
		return cluster_wait;
	}


	public void setCluster_wait(int cluster_wait) {
		this.cluster_wait = cluster_wait;
	}


	public int getApp_wait() {
		return app_wait;
	}


	public void setApp_wait(int app_wait) {
		this.app_wait = app_wait;
	}


	public int getConcurrency() {
		return concurrency;
	}


	public void setConcurrency(int concurrency) {
		this.concurrency = concurrency;
	}


	public int getPlsql_time() {
		return plsql_time;
	}


	public void setPlsql_time(int plsql_time) {
		this.plsql_time = plsql_time;
	}


	public long getPlan_hash_value() {
		return plan_hash_value;
	}


	public void setPlan_hash_value(long plan_hash_value) {
		this.plan_hash_value = plan_hash_value;
	}

	@Override
	public String toString() {
		return "AWRInfo [inst=" + inst + ", begin_time=" + begin_time + ", module=" + module + ", parsing_schema_name="
				+ parsing_schema_name + ", fetches=" + fetches + ", sorts=" + sorts + ", execs=" + execs + ", pxexecs=" + pxexecs
				+ ", loads=" + loads + ", invalid=" + invalid + ", parse_calls=" + parse_calls + ", disk_reads=" + disk_reads
				+ ", buffer_gets=" + buffer_gets + ", direct_writes=" + direct_writes + ", rows_proc=" + rows_proc
				+ ", cpu_time=" + cpu_time + ", elapsed_time=" + elapsed_time + ", etime_per_exec=" + etime_per_exec
				+ ", iowait=" + iowait + ", cluster_wait=" + cluster_wait + ", app_wait=" + app_wait + ", concurrency="
				+ concurrency + ", plsql_time=" + plsql_time + ", plan_hash_value=" + plan_hash_value + "]";
	}

}
