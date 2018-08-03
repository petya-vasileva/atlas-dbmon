/**
 * 
 */
package atlas.dbmon.svc;

/**
 * @author formica
 *
 */
public class ConddbServiceException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = -8552538724531679765L;

	public ConddbServiceException(String string) {
		super(string);
	}

	@Override
	public String getMessage() {
		return "ConddbServiceException: " + super.getMessage();
	}

	
}
