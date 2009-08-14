package com.albhaf.bikemap;

import java.io.IOException;
import java.io.PrintWriter;

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
			
			PrintWriter out = response.getWriter();
			
			CitybikeStation[] stationsArray = bds.readStations();
			
			out.println("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
			out.println("<kml xmlns=\"http://www.opengis.net/kml/2.2\" xmlns:gx=\"http://www.google.com/kml/ext/2.2\" xmlns:kml=\"http://www.opengis.net/kml/2.2\" xmlns:atom=\"http://www.w3.org/2005/Atom\">");
			out.println("<Document>");
			
			for(CitybikeStation station : stationsArray) {
				out.println("<Placemark>");
				out.print("<id>" + station.station_id + "</id>");
				out.print("<name>" + station.station_name + "</name>");
				out.print("<area>" + station.station_area + "</area>");
				out.print("<latitude>" + station.station_lat + "</latitude>");
				out.print("<longitude>" + station.station_lng + "</longitude>");
				out.print("<slots>" + station.station_slots + "</slots>");
				out.print("<bikes>" + station.station_bikes + "</bikes>");
				out.println("</Placemark>");
			}
			
			out.println("</Document>");
			out.println("</kml>");

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
