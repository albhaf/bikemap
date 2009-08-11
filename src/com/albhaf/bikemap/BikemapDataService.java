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
	 * Creates the logging database
	 * WARNING: Removes all previous data, only use when database or table does not yet exist
	 */
	public void createTable() {
		PreparedStatement stmt = null;
		
		String DBStatement = "CREATE TABLE `citybikes` (`ID` INT NOT NULL AUTO_INCREMENT,PRIMARY KEY(ID),`IPAddress` varchar(30) default NULL,`Timestamp` TIMESTAMP,`Address` varchar(100) default NULL,`Lat` varchar(30) default NULL,`Lng` varchar(30) default NULL)";
		
		try {
			stmt = con.prepareStatement(DBStatement);
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
			stmt = con.prepareStatement("INSERT INTO citybikes (Timestamp, IPAddress, Address, Lat, Lng) VALUES(?, ?, ?, ?, ?)");
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
