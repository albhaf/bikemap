// bikemap.js
// Author: Albert Hafvenström <albhaf@gmail.com>
//
// Version: 0.1

var stationsArray = new Array();
	
var map = null;
var geocoder = null;

var maxDistance = 1000;
var maxStations = 10;

var address = null;
var point = null;

// arrays to hold copies of the markers used by the side_bar
// because the function closure trick doesnt work there
var gmarkers = [];

// this variable will collect the html which will eventually be placed in the side_bar
var side_bar_html = '';

if(GBrowserIsCompatible()) {
	

	var activeMarker = new GMarker(new GLatLng(59.32452, 18.071136));
	
	var bounds = new GLatLngBounds();
	
	function citybikeStation(point, label, html) {
		this.point = point;
		this.label = label;
		this.html = html;
	}
	function loadStations() {
		
			GDownloadUrl('citybikes.kml', function(doc) {
				var xmlDoc = GXml.parse(doc);
				var markers = xmlDoc.documentElement.getElementsByTagName('Placemark');
				
				
				for(var j = 0; j < markers.length; j++) {
					// obtain the attribues of each marker
					var coords = markers[j].getElementsByTagName('coordinates')[0].firstChild.nodeValue.split(',');
					var lng = parseFloat(coords[0]);
					var lat = parseFloat(coords[1]);
					var point = new GLatLng(lat,lng);
					bounds.extend(point);

					var label = markers[j].getElementsByTagName('name')[0].firstChild.nodeValue;
					var htmlNode = markers[j].getElementsByTagName('description')
					var html = label;
					if(htmlNode.length > 0) {
						html = htmlNode[0].firstChild.nodeValue;
					}
					
					stationsArray[j] = new citybikeStation(point,label,html);
					
				}
			});
			
			//Script is executed too fast for stationsArray to be populated
			setTimeout("mapDraw(true,true,null,null)", 200);
		
	}
	
	function mapDraw(allMarkers, stationsLoad, point, address) {		
		//~ if(stationsLoad) {
			//~ loadStations();
		//~ }
		//~ var t=setTimeout("", 500);
		
		map = new GMap2(document.getElementById('map'));
		map.addControl(new GLargeMapControl());
		map.addControl(new GMapTypeControl());
		map.enableScrollWheelZoom();
		map.setCenter(new GLatLng(59.32452, 18.071136), 12);
		var mapBounds = map.getBounds();
		geocoder = new GClientGeocoder();
		geocoder.setViewport(mapBounds);
		
		if(point) {
			map.setCenter(point, 14);
			
			var markerIcon = new GIcon(G_DEFAULT_ICON);
			
			markerIcon.image = "images/house.jpg";
			markerIcon.iconSize = new GSize(30,30);
			markerIcon.iconAnchor = new GPoint(15,15);
			
			var marker = new GMarker(point,markerIcon);
			
			map.addOverlay(marker);
			
			//~ marker.openInfoWindowHtml(address);
		}
		
		
		if(allMarkers) {
			drawAllMarkers();
		} else {
			drawClosestMarkers(point);
		}
	}


	function drawAllMarkers() {
			//Reset side_bar_html
			side_bar_html = '';
			
			side_bar_html += '<br><table width="100%">';
			
			
			
			for (var i = 0; i < stationsArray.length; i++) {
			  // create the marker
			  var marker = createMarker(stationsArray[i].point,stationsArray[i].label,stationsArray[i].html);
			  map.addOverlay(marker);
			}
			
			// showAll and closing tag for side_bar_html
			//~ side_bar_html += '<a href="javascript:showAll()">Show all<\/a><br>\n';
			side_bar_html += '</table>';

			// put the assembled side_bar_html contents into the results div
			document.getElementById('results').innerHTML = side_bar_html;
		  //~ });
		  
	}

	
	
	function drawClosestMarkers(addressPoint) {
			var sortedMarkersArray = stationsArray.slice(); // Creates new array so that stationsArray doesn't get sorted

			sortedMarkersArray.sort(function(a, b) {  return (a.point.distanceFrom(addressPoint) - b.point.distanceFrom(addressPoint));   });
			
			//Reset side_bar_html
			side_bar_html = '';
			
			side_bar_html += '<br><table width="100%">';
			
			for (var i = 0; i < maxStations; i++) {				 
			// create the marker
			var marker = createMarker(sortedMarkersArray[i].point,sortedMarkersArray[i].label,sortedMarkersArray[i].html, sortedMarkersArray[i].point.distanceFrom(addressPoint));
			map.addOverlay(marker);
			}

			// closing tag for side_bar_html
			side_bar_html += '</table>';

			// put the assembled side_bar_html contents into the results div
			document.getElementById('results').innerHTML = side_bar_html;
		  //~ });
	}
	
			

	function clickMarker(i) {
		GEvent.trigger(gmarkers[i], 'click');
		//~ map.setCenter(gmarkers[i].getLatLng(),14);
	}

	function createMarker(point, name, html, distance) {
		var marker = new GMarker(point);
	
	
		GEvent.addListener(marker, 'click', function() {
			marker.openInfoWindowHtml(html);
	  
			//Sets activeMarker to be the "clicked" marker and enables it to be closed on request.
			activeMarker = marker;
	  
		});
		// save the info we need to use later for the side_bar
		gmarkers.push(marker);
	
		
		
		if(distance) {
			// add a station to the side_bar html
			side_bar_html += '<tr><td class="stationName"><a href="javascript:clickMarker(' + (gmarkers.length-1) + ')">' + name + '</a></td><td class="stationDistance" style="white-space: nowrap" align="right">' + parseInt(distance) + ' <em>m</em></td></tr>';
		} else {
			side_bar_html += '<tr><td class="stationName"><a href="javascript:clickMarker(' + (gmarkers.length-1) + ')">' + name + '</a></td><td class="stationDistance" style="white-space: nowrap" align="right"></td></tr>';
		 }

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
				  mapDraw(false, false, point, address);
				}
			  }
			);
		  }
	  } else {
		  mapDraw(true, false, null, null);
	  }
	  //~ alert("stationsArray.length = " + stationsArray.length);
	}
	
	
} else {
  alert('Sorry, the Google Maps API is not compatible with this browser');
}
