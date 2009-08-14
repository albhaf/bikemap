package com.albhaf.bikemap;

public class CitybikeStation {
	int station_id;
	String station_name;
	int station_area_code;
	float station_lat;
	float station_lng;
	int station_slots;
	int station_bikes;
	
	CitybikeStation(int id, String name, int area_code, float lat, float lng, int slots, int bikes) {
		station_id = id;
		station_name = name;
		station_area_code = area_code;
		station_lat = lat;
		station_lng = lng;
		station_slots = slots;
		station_bikes = bikes;
		
	}
}
