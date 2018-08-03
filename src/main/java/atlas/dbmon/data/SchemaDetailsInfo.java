package atlas.dbmon.data;

public class SchemaDetailsInfo implements java.io.Serializable {

	private static final long serialVersionUID = -7705209111920210543L;

	private String userName;
	private String respName;
	private String respEmail;
	private String accountStatus;
	private String passwordExpiryDate;
	private String egroup;
	
	public SchemaDetailsInfo() {
		super();
		// TODO Auto-generated constructor stub
	}

	public SchemaDetailsInfo(String userName, String respName, String respEmail, String accountStatus, String passwordExpiryDate,
			String egroup) {
		super();
		this.userName = userName;
		this.respName = respName;
		this.respEmail = respEmail;
		this.accountStatus = accountStatus;
		this.passwordExpiryDate = passwordExpiryDate;
		this.egroup = egroup;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getRespName() {
		return respName;
	}

	public void setRespName(String respName) {
		this.respName = respName;
	}

	public String getRespEmail() {
		return respEmail;
	}

	public void setRespEmail(String respEmail) {
		this.respEmail = respEmail;
	}

	public String getAccountStatus() {
		return accountStatus;
	}

	public void setAccountStatus(String accountStatus) {
		this.accountStatus = accountStatus;
	}

	public String getPasswordExpiryDate() {
		return passwordExpiryDate;
	}

	public void setPasswordExpiryDate(String passwordExpiryDate) {
		this.passwordExpiryDate = passwordExpiryDate;
	}

	public String getEgroup() {
		return egroup;
	}

	public void setEgroup(String egroup) {
		this.egroup = egroup;
	}

	@Override
	public String toString() {
		return "SchemaDetailsInfo [userName=" + userName + ", respName=" + respName + ", respEmail=" + respEmail
				+ ", accountStatus=" + accountStatus + ", passwordExpiryDate=" + passwordExpiryDate + ", egroup=" + egroup + "]";
	}

}
