package com.albhaf.bikemap;

import java.io.IOException;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class GetStations extends HttpServlet {
	BikemapDataService bds;


	@Override
	public void init(ServletConfig config) throws ServletException {
		try {
			bds = new BikemapDataService(config.getInitParameter("database.url"), config.getInitParameter("database.user"), config.getInitParameter("database.password"));

		} catch (Exception e) {
			e.printStackTrace();
			//			throw new ServletException("Unable to connect to database!",  e);
		}




	}

	@Override
	protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		try {
			response.setContentType("text/xml");
			response.setCharacterEncoding("UTF-8");
			
			CitybikeStation[] stationsArray = bds.readStations();
			
			response.getWriter().println("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
			response.getWriter().println("<kml xmlns=\"http://www.opengis.net/kml/2.2\" xmlns:gx=\"http://www.google.com/kml/ext/2.2\" xmlns:kml=\"http://www.opengis.net/kml/2.2\" xmlns:atom=\"http://www.w3.org/2005/Atom\">");
			response.getWriter().println("<Document>");
			
			for(int i = 0; i < stationsArray.length; i++) {
				response.getWriter().println("<Placemark>");
				
				response.getWriter().print("<id>");
				response.getWriter().print(stationsArray[i].station_id);
				response.getWriter().println("</id>");
				
				response.getWriter().print("<name>");
				response.getWriter().print(stationsArray[i].station_name);
				response.getWriter().println("</name>");
				
				response.getWriter().print("<area>");
				response.getWriter().print(stationsArray[i].station_area_code);
				response.getWriter().println("</area>");
				
				response.getWriter().print("<latitude>");
				response.getWriter().print(stationsArray[i].station_lat);
				response.getWriter().println("</latitude>");
				
				response.getWriter().print("<longitude>");
				response.getWriter().print(stationsArray[i].station_lng);
				response.getWriter().println("</longitude>");
				
				response.getWriter().print("<slots>");
				response.getWriter().print(stationsArray[i].station_slots);
				response.getWriter().println("</slots>");
				
				response.getWriter().print("<bikes>");
				response.getWriter().print(stationsArray[i].station_bikes);
				response.getWriter().println("</bikes>");
				
				response.getWriter().println("</Placemark>");
				
				
				//TODO: Change format of output to something more compatible with bikemap.js
//				String stationInfo = String.format("%d: %s (%f, %f)", stationsArray[i].station_id, stationsArray[i].station_name, stationsArray[i].station_lat, stationsArray[i].station_lng, stationsArray[i].station_slots, stationsArray[i].station_bikes);
//				response.getWriter().println(stationInfo);
			}
			
			response.getWriter().println("</Document>");
			response.getWriter().println("</kml>");

		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	@Override
	public void destroy() {
		try {if(bds.con != null) bds.con.close();} catch (Exception e) {}
		super.destroy();
	}
}
