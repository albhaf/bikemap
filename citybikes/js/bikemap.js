// bikemap.js
// Author: Albert Hafvenström <albhaf@gmail.com>
//
// Version: 0.2-rc4

var stationsArray = new Array();

var stationsAreaArray1 = new Array(); // Södermalm
var stationsAreaArray2 = new Array(); // Gamla stan/Djurgården
var stationsAreaArray3 = new Array(); // Vasastan
var stationsAreaArray4 = new Array(); // Kungsholmen/Lilla essingen
var stationsAreaArray5 = new Array(); // Norrmalm/City
var stationsAreaArray6 = new Array(); // Östermalm/Hjorthagen

var maxStations = 10;

var map = null;
var geocoder = null;

var latlngBounds;

var address = null; //
var point = null; //

var gmarkers = [];
var side_bar_html = '';

if(GBrowserIsCompatible()) {
	var activeMarker = new GMarker(new GLatLng(59.32452, 18.071136));
	var bounds = new GLatLngBounds();
	var directionBounds = new GLatLngBounds();

	function citybikeStation(point, label, html, area) {
		this.point = point;
		this.label = label;
		this.html = html;
		this.area = area;
	}

	function sortByStationName(a, b) {
		var x = a.label.toLowerCase();
		var y = b.label.toLowerCase();
		return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	}

	function loadStations() {

		var doc = $.ajax({url: "/citybikes/get_stations",async: false}).responseText;
		var xmlDoc = GXml.parse(doc);
		var markers = xmlDoc.documentElement.getElementsByTagName('Placemark');


		for(var j = 0; j < markers.length; j++) {
			var lat = parseFloat(markers[j].getElementsByTagName('latitude')[0].firstChild.nodeValue);
			var lng = parseFloat(markers[j].getElementsByTagName('longitude')[0].firstChild.nodeValue);

			var point = new GLatLng(lat,lng);
			bounds.extend(point);

			var label = markers[j].getElementsByTagName('name')[0].firstChild.nodeValue;
			var htmlNode = markers[j].getElementsByTagName('description')
				var html = label;
			if(htmlNode.length > 0) {
				html = htmlNode[0].firstChild.nodeValue;
			}

			var area = markers[j].getElementsByTagName('area')[0].firstChild.nodeValue;

			stationsArray[j] = new citybikeStation(point,label,html, area);

		}

		for (var i = 0; i < stationsArray.length; i++) {
			var area_code = stationsArray[i].area;
			switch(area_code) {
				case "1":
					stationsAreaArray1.push(stationsArray[i]);
				stationsAreaArray1.sort(sortByStationName);
				break;
				case "2":
					stationsAreaArray2.push(stationsArray[i]);
				stationsAreaArray2.sort(sortByStationName);
				break;
				case "3":
					stationsAreaArray3.push(stationsArray[i]);
				stationsAreaArray3.sort(sortByStationName);
				break;
				case "4":
					stationsAreaArray4.push(stationsArray[i]);
				stationsAreaArray4.sort(sortByStationName);
				break;
				case "5":
					stationsAreaArray5.push(stationsArray[i]);
				stationsAreaArray5.sort(sortByStationName);
				break;
				case "6":
					stationsAreaArray6.push(stationsArray[i]);
				stationsAreaArray6.sort(sortByStationName);
				break;
			}
		}

		mapDraw();
		drawAllMarkers();
}
	
	function mapDraw() {	
		map = new GMap2(document.getElementById('map'));
		map.addControl(new GLargeMapControl());
		map.addControl(new GMapTypeControl());
		map.enableScrollWheelZoom();
		map.setCenter(new GLatLng(59.32452, 18.071136), 12);
		var mapBounds = map.getBounds();
		geocoder = new GClientGeocoder();
		geocoder.setViewport(mapBounds);
	}

	function drawAllMarkers() {
		map.clearOverlays();
		latlngBounds = new GLatLngBounds();
		gmarkers = [];	
		side_bar_html = '<table width="100%">';
		
		side_bar_html += '<h3>S&ouml;dermalm</h3>';
		for (var i = 0; i < stationsAreaArray1.length; i++) {
		  var marker = createMarker(stationsAreaArray1[i].point,stationsAreaArray1[i].label,stationsAreaArray1[i].html);
		  map.addOverlay(marker);
		}
		
		side_bar_html += '<h3>Gamla stan/Djurg&aring;rden</h3>';
		for (var i = 0; i < stationsAreaArray2.length; i++) {
		  var marker = createMarker(stationsAreaArray2[i].point,stationsAreaArray2[i].label,stationsAreaArray2[i].html);
		  map.addOverlay(marker);
		}
		
		side_bar_html += '<h3>Vasastan</h3>';
		for (var i = 0; i < stationsAreaArray3.length; i++) {
		  var marker = createMarker(stationsAreaArray3[i].point,stationsAreaArray3[i].label,stationsAreaArray3[i].html);
		  map.addOverlay(marker);
		}
		
		side_bar_html += '<h3>Kungsholmen/Lilla essingen</h3>';
		for (var i = 0; i < stationsAreaArray4.length; i++) {
		  var marker = createMarker(stationsAreaArray4[i].point,stationsAreaArray4[i].label,stationsAreaArray4[i].html);
		  map.addOverlay(marker);
		}
		
		side_bar_html += '<h3>Norrmalm/City</h3>';
		for (var i = 0; i < stationsAreaArray5.length; i++) {
		  var marker = createMarker(stationsAreaArray5[i].point,stationsAreaArray5[i].label,stationsAreaArray5[i].html);
		  map.addOverlay(marker);
		}
		
		side_bar_html += '<h3>&Ouml;stermalm/Hjorthagen</h3>';
		for (var i = 0; i < stationsAreaArray6.length; i++) {
		  var marker = createMarker(stationsAreaArray6[i].point,stationsAreaArray6[i].label,stationsAreaArray6[i].html);
		  map.addOverlay(marker);
		}
		
		map.setCenter( latlngBounds.getCenter( ), map.getBoundsZoomLevel( latlngBounds ) );
		
		side_bar_html += '</table>';
		document.getElementById('results').innerHTML = side_bar_html;
		  
	}
	
	function drawClosestMarkers(clearMarkers, addressPoint, maxStations, image) {

		if(clearMarkers) {
			map.clearOverlays();
			gmarkers = [];
			latlngBounds = new GLatLngBounds();
			side_bar_html = '';
		}
			
		setAddressMarker(addressPoint, image);
		
		var sortedMarkersArray = stationsArray.slice(); // Creates new array so that stationsArray doesn't get sorted

		sortedMarkersArray.sort(function(a, b) {  return (a.point.distanceFrom(addressPoint) - b.point.distanceFrom(addressPoint));   });

		side_bar_html += '<table width="100%">';
		
		for (var i = 0; i < maxStations; i++) {				 
			var marker = createMarker(sortedMarkersArray[i].point,sortedMarkersArray[i].label,sortedMarkersArray[i].html, sortedMarkersArray[i].point.distanceFrom(addressPoint));
			map.addOverlay(marker);
		}
		
		map.setCenter( latlngBounds.getCenter( ), map.getBoundsZoomLevel( latlngBounds ) );

		side_bar_html += '</table>';
		document.getElementById('results').innerHTML = side_bar_html;
	}		

	function clickMarker(i) {
		GEvent.trigger(gmarkers[i], 'click');
	}

	function createMarker(point, name, html, distance) {
		var marker = new GMarker(point);
	
		GEvent.addListener(marker, 'click', function() {
			marker.openInfoWindowHtml(html);
			activeMarker = marker;
		});
		
		gmarkers.push(marker);

		if(distance) {
			side_bar_html += '<tr><td class="stationName"><a href="javascript:clickMarker(' + (gmarkers.length-1) + ')">' + name + '</a></td><td class="stationDistance" style="white-space: nowrap" align="right">' + parseInt(distance) + ' <em>m</em></td></tr>';
		} else {
			side_bar_html += '<tr><td class="stationName"><a href="javascript:clickMarker(' + (gmarkers.length-1) + ')">' + name + '</a></td><td class="stationDistance" style="white-space: nowrap" align="right"></td></tr>';
		 }
		
		latlngBounds.extend(point);
		
		return marker;
	}

	function setAddress(address) {
		if(address) {
			if (geocoder) {
				geocoder.getLatLng(
					address,
					function(point) {
						if (!point) {
							alert(address + " not found");
						} else {
							side_bar_html = '';
							drawClosestMarkers(true, point, maxStations, "images/house.jpg");
							$.get("/citybikes/register?addr=" + address + "&lat=" + point.lat() + "&lng=" + point.lng(), function(returnCode){if(returnCode==1){alert(returnCode);}});
						}
					}
				);
			}
		} else {
			drawAllMarkers();
		}
	}
	
	function showStationSearch() {
		var search_form_html = '<fieldset><legend>Search for a station near your location</legend><form name="search_form" action="#" onsubmit="setAddress(this.address.value); return false"><table><tr><td>Adress:  <input name="address" type="text" size="30"></td><td><input type="submit" value="Search"></td></tr></table></form></fieldset>';
		document.getElementById('search_form').innerHTML = search_form_html;
	}
	
	function showDirectionSearch() {
		var search_form_html = '<fieldset><legend>Travelling directions</legend><form name="search_form" action="#" onsubmit="drawDirectionMarkers(this.address.value,this.destination.value); return false"><table><tr>Adress:  <input name="address" type="text" size="30"></td><td></td></tr><tr><td>Destination:  <input name="destination" type="text" size="30"></td><td></td><td><input type="submit" value="Search"></td></tr></table></form></fieldset>';
		document.getElementById('search_form').innerHTML = search_form_html;
	}
	
	function drawDirectionMarkers(start, destination) {		
		if (geocoder) {
			geocoder.getLatLng(
			  start,
			  function(point) {
				if (!point) {
				  alert(address + " not found");
				} else {	
					drawClosestMarkers(true, point, 5, "images/start.jpg");
					side_bar_html = '<h3>Address</h3>'+side_bar_html;
					
					geocoder.getLatLng(
						destination,
						function(point) {
							if (!point) {
								alert(address + " not found");
							} else {
								side_bar_html += '<h3>Destination</h3>';
								drawClosestMarkers(false, point, 5, "images/goal.gif");
								map.setCenter( latlngBounds.getCenter( ), map.getBoundsZoomLevel( latlngBounds ) );
							}
						}
					);
				}
			  }
			);
		}
	}
	
	function setAddressMarker(point, image) {
		var markerIcon = new GIcon(G_DEFAULT_ICON);
		
		markerIcon.image = image;
		markerIcon.iconSize = new GSize(30,30);
		markerIcon.iconAnchor = new GPoint(15,15);
		
		var addressMarker = new GMarker(point,markerIcon);
		
		map.addOverlay(addressMarker);
	}
		
	
} else {
  alert('Sorry, the Google Maps API is not compatible with this browser');
}
