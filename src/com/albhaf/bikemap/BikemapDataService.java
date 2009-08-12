package com.albhaf.bikemap;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class BikemapDataService {
	
	Connection con = null;
	
	public String databaseURL;
	public String databaseUser;
	public String databasePassword;
	
	public BikemapDataService(String databaseURL, String databaseUser, String databasePassword) throws InstantiationException, IllegalAccessException, ClassNotFoundException, SQLException {		
		Class.forName("com.mysql.jdbc.Driver").newInstance();
		con = DriverManager.getConnection(databaseURL, databaseUser, databasePassword);
	}
	

	/**
	 *  
	 */
	public void executeStatement(String SQLStatement) {
		PreparedStatement stmt = null;
		
		try {
			stmt = con.prepareStatement(SQLStatement);
			stmt.executeUpdate();
		} catch (Exception e) {
			
		} finally {
			try {if(stmt != null) stmt.close();} catch(Exception e) {}
		}
	}

	/**
	 * 
	 */
	public void registerSearch(String ipaddress, String address, float latitude, float longitude) {
		PreparedStatement stmt = null;
		
		try {
			stmt = con.prepareStatement("INSERT INTO citybikes_search_log (Timestamp, IPAddress, Address, Lat, Lng) VALUES(?, ?, ?, ?, ?)");
			stmt.setTimestamp(1, new java.sql.Timestamp(System.currentTimeMillis()));
			stmt.setString(2, ipaddress);
			stmt.setString(3, address);
			stmt.setFloat(4, latitude);
			stmt.setFloat(5, longitude);
			stmt.executeUpdate();
		} catch (Exception e1) {
			e1.printStackTrace();
		} finally {
			
			try {if(stmt != null) stmt.close();} catch(Exception e) {}
			
		}
	}
	
}
