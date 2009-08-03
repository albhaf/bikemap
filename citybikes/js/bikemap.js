// This Javascript is based on code provided by the
// Blackpool Community Church Javascript Team
// http://www.commchurch.freeserve.co.uk/   
// http://econym.googlepages.com/index.htm


if (GBrowserIsCompatible()) {
  // this variable will collect the html which will eventualkly be placed in the side_bar
  var side_bar_html = '';
  
  // arrays to hold copies of the markers used by the side_bar
  // because the function closure trick doesnt work there
  var gmarkers = [];
  
  // create the map
  var map = new GMap2(document.getElementById('map'));
  map.addControl(new GLargeMapControl());
  map.addControl(new GMapTypeControl());
  map.setCenter(new GLatLng(59.32452, 18.071136), 12);

  var bounds = new GLatLngBounds();
  
  //Create a dummy value for marker. It will later be used to determine which marker is active.
  var activeMarker = new GMarker(new GLatLng(59.32452, 18.071136));

  // A function to create the marker and set up the event window
  function createMarker(point,name,html) {
    var marker = new GMarker(point);
	var newOption = document.createElement('option');
	
	var selectOption = document.getElementById("stations");
	
    GEvent.addListener(marker, 'click', function() {
      marker.openInfoWindowHtml(html);
	  
	  //Sets activeMarker to be the "clicked" marker and enables it to be closed on request.
	  activeMarker = marker;
	  
    });
    // save the info we need to use later for the side_bar
    gmarkers.push(marker);
	
	newOption.text = name;
	newOption.value = gmarkers.length-1;
	
	try
  {
  selectOption.add(newOption,null); // standards compliant
  }
catch(ex)
  {
  selectOption.add(newOption); // IE only
  }	
	
    // add a line to the side_bar html
    //~ unnecessary
	//~ side_bar_html += '<a href="javascript:myclick(' + (gmarkers.length-1) + ')">' + name + '<\/a><br>\n';
    return marker;
  }
  
  // This function picks up the click and opens the corresponding info window
  function myclick(i) {
	GEvent.trigger(gmarkers[i], 'click');
    map.setCenter(gmarkers[i].getLatLng(),14);
  }

  function showAll() {
	//Closes the previously set active marker.
	activeMarker.closeInfoWindow();
	
    map.setZoom(map.getBoundsZoomLevel(bounds));
    map.setCenter(bounds.getCenter());
  }

  // Read the data from example.xml
  GDownloadUrl('citybikes.kml', function(doc) {
    var xmlDoc = GXml.parse(doc);
    var markers = xmlDoc.documentElement.getElementsByTagName('Placemark');

    
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

      if(i == Math.ceil(markers.length/2)-1) {
        //~ Currently not needed and only generates an error when it can't find col1.
		//~ document.getElementById('col1').innerHTML = side_bar_html;
        side_bar_html = '';
      }
    }

    showAll();

    side_bar_html += '<a href="javascript:showAll()">Show all<\/a><br>\n';

    // put the assembled side_bar_html contents into the side_bar div
    //~ Currently not needed and only generates an error when it can't find col2.
	//~ document.getElementById('col2').innerHTML = side_bar_html;
  });
} else {
  alert('Sorry, the Google Maps API is not compatible with this browser');
}



