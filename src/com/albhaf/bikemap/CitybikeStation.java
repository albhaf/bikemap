package com.albhaf.bikemap;

public class CitybikeStation {
	int station_id;
	String station_name;
	String station_area;
	float station_lat;
	float station_lng;
	int station_slots;
	int station_bikes;
	
	CitybikeStation(int id, String name, String area, float lat, float lng, int slots, int bikes) {
		station_id = id;
		station_name = name;
		station_area = area;
		station_lat = lat;
		station_lng = lng;
		station_slots = slots;
		station_bikes = bikes;
		
	}
}
