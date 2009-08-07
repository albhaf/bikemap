var map = null;
var geocoder = null;

var maxDistance = 1000;

if(GBrowserIsCompatible()) {
	
	
	// arrays to hold copies of the markers used by the side_bar
	// because the function closure trick doesnt work there
	var gmarkers = [];

	// this variable will collect the html which will eventually be placed in the side_bar
	var side_bar_html = '';
	
	var bounds = new GLatLngBounds();

	function mapInit() {
		
		//~ map = new GMap2(document.getElementById('map'));
		//~ map.addControl(new GLargeMapControl());
		//~ map.addControl(new GMapTypeControl());
		//~ map.setCenter(new GLatLng(59.32452, 18.071136), 12);
		mapDraw(true, null, null);
		geocoder = new GClientGeocoder();
		geocoder.setViewport(bounds);
		//~ if(address) {
			//~ setAddress(address);
		//~ } else {
			//~ drawAllMarkers();
		//~ }
	}
	
	function mapDraw(allMarkers, point, address) {
		map = new GMap2(document.getElementById('map'));
		map.addControl(new GLargeMapControl());
		map.addControl(new GMapTypeControl());
		
		if(point) {
			map.setCenter(point, 14);
			
			var markerIcon = new GIcon(G_DEFAULT_ICON);
			
			markerIcon.image = "images/house.jpg";
			markerIcon.iconSize = new GSize(30,30);
			markerIcon.iconAnchor = new GPoint(15,15);
			
			var marker = new GMarker(point,markerIcon);
			
			map.addOverlay(marker);
			
			//~ marker.openInfoWindowHtml(address);
		} else {
			map.setCenter(new GLatLng(59.32452, 18.071136), 12);
		}
		
		if(allMarkers) {
			drawAllMarkers();
		} else {
			drawClosestMarkers(point);
		}
	}


	function drawAllMarkers() {
		// Read the data from citybikes.kml
		GDownloadUrl('citybikes.kml', function(doc) {
			var xmlDoc = GXml.parse(doc);
			var markers = xmlDoc.documentElement.getElementsByTagName('Placemark');

			//Reset side_bar_html
			side_bar_html = '';
			
			side_bar_html += '<br><table width="100%">';
			
			for (var i = 0; i < markers.length; i++) {
			  // obtain the attribues of each marker
			  var coords = markers[i].getElementsByTagName('coordinates')[0].firstChild.nodeValue.split(',');
			  var lng = parseFloat(coords[0]);
			  var lat = parseFloat(coords[1]);
			  var point = new GLatLng(lat,lng);
			  bounds.extend(point);

			  var label = markers[i].getElementsByTagName('name')[0].firstChild.nodeValue;
			  var htmlNode = markers[i].getElementsByTagName('description')
			  var html = label;
			  if(htmlNode.length > 0) {
				html = htmlNode[0].firstChild.nodeValue;
			  }

			  // create the marker
			  var marker = createMarker(point,label,html);
			  map.addOverlay(marker);
			}

			
			showAll();
			
			// showAll and closing tag for side_bar_html
			side_bar_html += '<a href="javascript:showAll()">Show all<\/a><br>\n';
			side_bar_html += '</table>';

			// put the assembled side_bar_html contents into the results div
			document.getElementById('results').innerHTML = side_bar_html;
		  });
	}

	function drawClosestMarkers(addressPoint) {
		// Read the data from citybikes.kml
		
		GDownloadUrl('citybikes.kml', function(doc) {
			var xmlDoc = GXml.parse(doc);
			var markers = xmlDoc.documentElement.getElementsByTagName('Placemark');
			
			var sortedStationArray = new Array;
			
			var numberStations = null;
			
			var closestStation = 5000; //Need hard coded initial value so that the loop works

			//Reset side_bar_html
			side_bar_html = '';
			
			side_bar_html += '<br><table width="100%">';
			
			for (var j = 0; j < markers.length; j++) {
				var coords = markers[j].getElementsByTagName('coordinates')[0].firstChild.nodeValue.split(',');
				var lng = parseFloat(coords[0]);
				var lat = parseFloat(coords[1]);
				var point = new GLatLng(lat,lng);
				
				var stationDistance = point.distanceFrom(addressPoint);
				
				if(stationDistance < closestStation) {
					//~ alert("DEBUG| Added closer station");
					closestStation = stationDistance;
					sortedStationArray.unshift(markers[j]);
				} else {
					sortedStationArray.push(markers[j]);
				}
			}
				
				
				
			
			for (var i = 0; i < 10; i++) {	
							 
				// obtain the attribues of each marker
				var coords = sortedStationArray[i].getElementsByTagName('coordinates')[0].firstChild.nodeValue.split(',');
				var lng = parseFloat(coords[0]);
				var lat = parseFloat(coords[1]);
				var point = new GLatLng(lat,lng);
				bounds.extend(point);

				var label = sortedStationArray[i].getElementsByTagName('name')[0].firstChild.nodeValue;
				var htmlNode = sortedStationArray[i].getElementsByTagName('description')
				var html = label;
				if(htmlNode.length > 0) {
				html = htmlNode[0].firstChild.nodeValue;
				}
				
				//~ alert("DEBUG| distance: " + point.distanceFrom(addressPoint));
				
				var stationDistance = point.distanceFrom(addressPoint);
				
				//~ if(stationDistance <= maxDistance) {
					// create the marker
					var marker = createMarker(point,label,html, stationDistance);
					map.addOverlay(marker);
				//~ }
			}

			
			//~ showAll();
			
			// showAll and closing tag for side_bar_html
			//~ side_bar_html += '<a href="javascript:showAll()">Show all<\/a><br>\n';
			side_bar_html += '</table>';

			// put the assembled side_bar_html contents into the results div
			document.getElementById('results').innerHTML = side_bar_html;
		  });
	}
	
	 function showAll() {
		//Closes the previously set active marker.
		//~ activeMarker.closeInfoWindow();
		
		map.setZoom(map.getBoundsZoomLevel(bounds));
		map.setCenter(bounds.getCenter());
  }
			

	function clickMarker(i) {
		GEvent.trigger(gmarkers[i], 'click');
		map.setCenter(gmarkers[i].getLatLng(),14);
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
			side_bar_html += '<tr><td><font size="-1"><a href="javascript:clickMarker(' + (gmarkers.length-1) + ')">' + name + '</a></font></td><font size="-1"><td style="white-space: nowrap" align="right">' + parseInt(distance) + ' <em>m</em></td></font></tr>';
		} else {
			side_bar_html += '<tr><td><font size="-1"><a href="javascript:clickMarker(' + (gmarkers.length-1) + ')">' + name + '</a></font></td><font size="-1"><td style="white-space: nowrap" align="right"></td></font></tr>';
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
				  mapDraw(false, point, address);
				}
			  }
			);
		  }
	  } else {
		  mapDraw(true, null, null);
	  }
	}
	
	
} else {
  alert('Sorry, the Google Maps API is not compatible with this browser');
}
