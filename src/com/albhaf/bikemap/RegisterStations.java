package com.albhaf.bikemap;

import java.io.IOException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.xml.sax.SAXException;

public class RegisterStations {
	
	
	BikemapDataService bds;
	
	public static CitybikeStation[] stationsArray;
	
	public static String[] loadConfig(String webXML) throws ParserConfigurationException, SAXException, IOException {
		String[] servlet_config = new String[3];
		
		DocumentBuilder docReader = DocumentBuilderFactory.newInstance().newDocumentBuilder();
		Document xmldoc = docReader.parse(webXML);
		
		servlet_config[0] = xmldoc.getDocumentElement().getElementsByTagName("param-value").item(0).getTextContent();
		servlet_config[1] = xmldoc.getDocumentElement().getElementsByTagName("param-value").item(1).getTextContent();
		servlet_config[2] = xmldoc.getDocumentElement().getElementsByTagName("param-value").item(2).getTextContent();

		return servlet_config;
		
	}
	
	public static void loadStations(String citybikesKML) throws SAXException, IOException, ParserConfigurationException {
		
		
		DocumentBuilder docReader = DocumentBuilderFactory.newInstance().newDocumentBuilder();
		Element stationsList = docReader.parse(citybikesKML).getElementById("Folder");
		
//		CitybikeStation[] stationsArray = new CitybikeStation[(stationsList.getElementsByTagName("name").getLength()-1)];
		
		for(int i = 0; i < stationsList.getElementsByTagName("Placemark").getLength(); i++) {
			int id = (i+1);
			String name = stationsList.getElementsByTagName("name").item(i-1).toString();
			float lat = Float.parseFloat(stationsList.getElementsByTagName("longitude").item(i).toString());
			float lng = Float.parseFloat(stationsList.getElementsByTagName("latitude").item(i).toString());
//			int slots = stationsList.getDocumentElement().getElementsByTagName(arg0).item(i);
//			int bikes = stationsList.getDocumentElement().getElementsByTagName(arg0).item(i);
			
//			stationsArray[i] = new CitybikeStation(id, name, lat, lng, slots, bikes);
			stationsArray[i] = new CitybikeStation(id, name, lat, lng, 0, 0);
		
		}
		
//		return stationsArray;
		
	}
	

	public static void main(String[] args) {
		
//		try {
//			String[] servletConfig = loadConfig(args[1]);
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
		
		
//		try {
//			stationsArray = loadStations(args[0]);
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
	
//		try {
//			bds = new BikemapDataService(servletConfig[0], servletConfig[1], servletConfig[2]);
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//		
//		for(int i = 0; i < stationsArray.length; i++) {
//			try {
//				bds.registerStation(stationsArray[i].station_id, stationsArray[i].station_name, stationsArray[i].station_lat, stationsArray[i].station_lng, 0, 0);
//			} catch (NumberFormatException e) {
//
//			}
//		}
//		
		for(int j = 0; j < stationsArray.length; j++) {
			System.out.println(stationsArray[j].station_id + stationsArray[j].station_name + stationsArray[j].station_lat + stationsArray[j].station_lng);
		}
	}


}
