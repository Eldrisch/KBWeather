$(function () {
	let isMetric = true;
	let locationUrl = "";
	let currentConditionsUrl = "";
	let language = "pl-pl";
	let details = true;
	const apiKey = "2rbdDBOADHUwiK1FcPQ3ZAAmuaj0YlrR";

	let searchCityLocation = (inputText) => {
		let encodedText = encodeURIComponent(inputText);
		locationUrl = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${encodedText}&language=${language}`;
		$.ajax({
			type: "GET",
			url: locationUrl,
			dataType: "jsonp",
			cache: true,
			jsonpCallback: "callback",
			success: (data) => { cityLocationFound(data); }
		});
	};
	let cityLocationFound = (data) => {
		let locationKey = null;
		let mapLatitude = null;
		let mapLongitude = null;
		if (data.length == 1) {
			locationKey = data[0].Key;
			mapLatitude = data[0].GeoPosition.Latitude;
			mapLongitude = data[0].GeoPosition.Longitude;
			console.log(`One location found: ${data[0].LocalizedName} Key: ${locationKey} Latitude: ${mapLatitude} Longitude: ${mapLongitude}`);
		}
		else if (data.length == 0) {
			console.log("No locations found.");
		}
		else {
			locationKey = data[0].Key;
			mapLatitude = data[0].GeoPosition.Latitude;
			mapLongitude = data[0].GeoPosition.Longitude;
			console.log(`Multiple locations found (${data.length}). Selecting the first one: ${data[0].LocalizedName}, ${data[0].Country.ID}. Key: ${locationKey} Latitude: ${mapLatitude} Longitude: ${mapLongitude}`);
		}
		if (locationKey != null) {
			getCurrentConditions(locationKey);
			initMap(mapLatitude, mapLongitude);
		}
	};
	let initMap = (mapLatitude, mapLongitude) => {
		let map = new google.maps.Map(document.getElementById('map'), {
			center: { lat: mapLatitude, lng: mapLongitude },
			zoom: 11,
			mapTypeId: 'roadmap'
		});
	}
	let getCurrentConditions = (locationKey) => {
		currentConditionsUrl = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}&language=${language}&details=${details}`;
		$.ajax({
			type: 'GET',
			url: currentConditionsUrl,
			dataType: 'jsonp',
			cache: true,
			jsonpCallback: "callback",
			success: (data) => {
				let html = null;
				if(data && data.length > 0) {
					let conditions = data[0];
					let temp = isMetric ? conditions.Temperature.Metric : conditions.Temperature.Imperial;
					html = conditions.WeatherText + ", " + temp.Value + " " + temp.Unit;
				}
				else {
					html = "N/A";
				}
				$('#weather-min-temp').html(html);
				$("#weather-max-temp").html("<a href=" + currentConditionsUrl + ">" + currentConditionsUrl + "</a>");
			}
		});
	};
	$('#search-bar').keypress(function (e) {
		if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
			let inputText = $('#search-bar').val();
			searchCityLocation(inputText);
			return false;
		} else {
			return true;
		}
	});
	$('#search-btn').click(() => {
		let inputText = $('#search-bar').val();
		searchCityLocation(inputText);
	});
});
