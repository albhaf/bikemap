package com.albhaf.bikemap;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Date;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class registerAddress extends HttpServlet {
	@Override
	protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		Connection con = null;
		PreparedStatement stmt = null;
		Date now = new Date();
		
		
		try {
			Class.forName("com.mysql.jdbc.Driver").newInstance();
			con = DriverManager.getConnection("jdbc:mysql://localhost:3306/bikemap", "bikemap", "bikemap");
			stmt = con.prepareStatement("INSERT INTO citybikes (Timestamp, Address, Lat, Lng) VALUES(?, ?, ?, ?)");
			stmt.setString(1, now.toString());
			stmt.setString(2, request.getParameter("addr"));
			stmt.setString(3, request.getParameter("lat"));
			stmt.setString(4, request.getParameter("lng"));
			stmt.executeUpdate();
//			System.out.println("Search registered in db.");
			
		} catch (Exception e1) {
			e1.printStackTrace();
		} finally {
			try {
				stmt.close();
				con.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
			
		}

		 
	
		
		
		
//		try {
//			if(!request.getParameter("addr").isEmpty() && !request.getParameter("lat").isEmpty() && !request.getParameter("lng").isEmpty()) {
//		
//				System.out.println("Address registered (" + now.toString() + "): " + request.getParameter("addr") + " " + request.getParameter("lat") + " " + request.getParameter("lng"));
//				response.getWriter().println("0");
//			} else {
//				response.getWriter().println("1");
//			}
//		} catch (NullPointerException e) {
//			response.getWriter().println("1");
//		}
		
		
	}

}
