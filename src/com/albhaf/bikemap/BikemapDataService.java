package com.albhaf.bikemap;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class BikemapDataService {
	
	Connection con = null;
	
//	public String databaseURL;
//	public String databaseUser;
//	public String databasePassword;
	
	public BikemapDataService(String databaseURL, String databaseUser, String databasePassword) throws InstantiationException, IllegalAccessException, ClassNotFoundException, SQLException {		
		Class.forName("com.mysql.jdbc.Driver").newInstance();
		con = DriverManager.getConnection(databaseURL, databaseUser, databasePassword);
	}
	

	/**
	 *  
	 */
	public void executeStatement(String SQLStatement) throws Exception {
		PreparedStatement stmt = null;
		
		try {
			stmt = con.prepareStatement(SQLStatement);
			stmt.executeUpdate();
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
	
	public void registerStation(int station_id, String station_name, String station_area, float station_lat, float station_lng, int station_slots, int station_bikes) {
		PreparedStatement stmt = null;
		
		try {
			stmt = con.prepareStatement("INSERT INTO citybikes_stations_db (STATION_ID, STATION_NAME, STATION_AREA, STATION_LAT, STATION_LNG, STATION_SLOTS, STATION_BIKES) VALUES(?, ?, ?, ?, ?, ?, ?)");
			stmt.setInt(1, station_id);
			stmt.setString(2, station_name);
			stmt.setString(3, station_area);
			stmt.setFloat(4, station_lat);
			stmt.setFloat(5, station_lng);
			stmt.setInt(6, station_slots);
			stmt.setInt(7, station_bikes);
			stmt.executeUpdate();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {if(stmt != null) stmt.close();} catch(Exception e) {}
		}
	}
	
	public CitybikeStation[] readStations() throws SQLException {
		Statement rowStmt = null;
		Statement stmt = null;
		
		int count=0;
		
		try {
		rowStmt = con.createStatement();
		
		
		ResultSet result = rowStmt.executeQuery("SELECT COUNT(*) FROM citybikes_stations_db");
		
		
		while (result.next()){
			count = result.getInt(1);
		}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {if(rowStmt != null) rowStmt.close();} catch(Exception e) {}
		}
				
		CitybikeStation[] stationsArray = new CitybikeStation[(count)];
		
		stmt = con.createStatement();
		ResultSet stations = stmt.executeQuery("SELECT * FROM citybikes_stations_db");
		
		stations.beforeFirst();
		
		int dbEntry = 0;
		while (stations != null && stations.next()) {
			int id = stations.getInt("STATION_ID");
			String name = stations.getString("STATION_NAME");
			String area = stations.getString("STATION_AREA");
			float lat = stations.getFloat("STATION_LAT");
			float lng = stations.getFloat("STATION_LNG");
			int slots = stations.getInt("STATION_SLOTS");
			int bikes = stations.getInt("STATION_BIKES");
			
			stationsArray[dbEntry++] = new CitybikeStation(id, name, area, lat, lng, slots, bikes);
			
		}		
		return stationsArray;
	}
	
}
