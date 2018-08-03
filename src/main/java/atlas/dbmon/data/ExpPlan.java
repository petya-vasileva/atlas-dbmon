package atlas.dbmon.data;

public class ExpPlan implements java.io.Serializable {

	private static final long serialVersionUID = -7705209111920210543L;

	private String plan_table_output;
	
	public ExpPlan() {
		super();
	}

	public String getPlan_table_output() {
		return plan_table_output;
	}

	public void setPlan_table_output(String plan_table_output) {
		this.plan_table_output = plan_table_output;
	}

	@Override
	public String toString() {
		return "ExpPlan [plan_table_output=" + plan_table_output + "]";
	}
}
