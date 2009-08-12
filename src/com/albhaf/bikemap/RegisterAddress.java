package com.albhaf.bikemap;

import java.io.IOException;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class RegisterAddress extends HttpServlet {
	BikemapDataService bds;
	
	
	@Override
	public void init(ServletConfig config) throws ServletException {
		try {
			bds = new BikemapDataService(config.getInitParameter("database.url"), config.getInitParameter("database.user"), config.getInitParameter("database.password"));
		} catch (Exception e) {
			e.printStackTrace();
			throw new ServletException("Unable to connect to database!",  e);
		}
		
		bds.executeStatement("CREATE TABLE IF NOT EXISTS`citybikes_search_log` (`ID` INT NOT NULL AUTO_INCREMENT,PRIMARY KEY(ID),`IPAddress` varchar(30) default NULL,`Timestamp` TIMESTAMP,`Address` varchar(100) default NULL,`Lat` varchar(30) default NULL,`Lng` varchar(30) default NULL)");
	}
	@Override
	protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try {
			bds.registerSearch(request.getRemoteAddr(), request.getParameter("addr"), Float.parseFloat(request.getParameter("lat")), Float.parseFloat(request.getParameter("lng")));
		} catch (NumberFormatException e) {
			
		}		
	}
	
	@Override
	public void destroy() {
		try {if(bds.con != null) bds.con.close();} catch (Exception e) {}
		super.destroy();
	}

}
