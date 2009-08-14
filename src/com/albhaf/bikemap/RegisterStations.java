package com.albhaf.bikemap;

import java.io.IOException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

public class RegisterStations {

	public static String[] loadConfig(String webXML) throws ParserConfigurationException, SAXException, IOException {
		String[] servlet_config = new String[3];

		DocumentBuilder docReader = DocumentBuilderFactory.newInstance().newDocumentBuilder();
		Document xmldoc = docReader.parse(webXML);

		servlet_config[0] = xmldoc.getDocumentElement().getElementsByTagName("param-value").item(0).getTextContent();
		servlet_config[1] = xmldoc.getDocumentElement().getElementsByTagName("param-value").item(1).getTextContent();
		servlet_config[2] = xmldoc.getDocumentElement().getElementsByTagName("param-value").item(2).getTextContent();

		return servlet_config;
	}

	public static CitybikeStation[] loadStations(String citybikesKML) throws SAXException, IOException, ParserConfigurationException {

		DocumentBuilder docReader = DocumentBuilderFactory.newInstance().newDocumentBuilder();
		
		NodeList stationsList = docReader.parse(citybikesKML).getElementsByTagName("Placemark");
				
		CitybikeStation[] stationsArray = new CitybikeStation[(stationsList.getLength())];

		for(int i = 0; i < (stationsList.getLength()); i++) {
			Element stationElement = (Element)stationsList.item(i);
			
			int id = Integer.parseInt(readElement(stationElement, "name").split(" ", 2)[0]);
			String name = readElement(stationElement, "name").split(" ", 2)[1];
			String area = readElement(stationElement, "id");
			float lat = Float.parseFloat(readElement(stationElement, "latitude"));
			float lng = Float.parseFloat(readElement(stationElement, "longitude"));
			
			// stationsArray[i] = new CitybikeStation(id, name, lat, lng, slots, bikes);
			stationsArray[i] = new CitybikeStation(id, name, area, lat, lng, 0, 0);

		}

		return stationsArray;
	}
	
	public static String readElement(Element element, String name) {
		
		return element.getElementsByTagName(name).item(0).getChildNodes().item(0).getTextContent();
		
	}


	public static void main(String[] args) {

		try {
			String[] servletConfig = loadConfig(args[1]);

			CitybikeStation[] stationsArray = loadStations(args[0]);

			BikemapDataService bds = new BikemapDataService(servletConfig[0], servletConfig[1], servletConfig[2]);
			
			bds.executeStatement("DROP TABLE IF EXISTS `citybikes_stations_db`");
			bds.executeStatement("CREATE TABLE IF NOT EXISTS `citybikes_stations_db` (`STATION_ID` INT,PRIMARY KEY(STATION_ID),`STATION_NAME` varchar(40) default NULL, `STATION_AREA` varchar(30) default NULL, `STATION_LAT` float,`STATION_LNG` float,`STATION_SLOTS` INT,`STATION_BIKES` INT) ");

			for(int i = 0; i < stationsArray.length; i++) {
				bds.registerStation(stationsArray[i].station_id, stationsArray[i].station_name, stationsArray[i].station_area, stationsArray[i].station_lat, stationsArray[i].station_lng, stationsArray[i].station_slots, stationsArray[i].station_bikes);
				System.out.println(String.format("%d: %s %s (%f, %f)", stationsArray[i].station_id, stationsArray[i].station_name, stationsArray[i].station_area, stationsArray[i].station_lat, stationsArray[i].station_lng));

			}


		} catch (Exception e) {
			e.printStackTrace();
		}

	}


}
