package atlas.dbmon.data;

public class StorageInfo implements java.io.Serializable {

	private static final long serialVersionUID = -7705209111920210543L;

	private String dt;
	private Double tableSize;
	private Double indexSize;

	public StorageInfo() {
		super();
	}

	public StorageInfo(String dt, Double tableSize, Double indexSize, String schemaName) {
		super();
		this.dt = dt;
		this.tableSize = tableSize;
		this.indexSize = indexSize;
	}

	public String getDt() {
		return dt;
	}


	public void setDt(String dt) {
		this.dt = dt;
	}


	public Double getTableSize() {
		return tableSize;
	}


	public void setTableSize(Double tableSize) {
		this.tableSize = tableSize;
	}


	public Double getIndexSize() {
		return indexSize;
	}


	public void setIndexSize(Double indexSize) {
		this.indexSize = indexSize;
	}


	@Override
	public String toString() {
		return "StorageInfo [dt=" + dt + ", tableSize=" + tableSize + ", indexSize=" + indexSize + "]";
	}

}
