$(function () {
	let isMetric = true;
	let locationUrl = "";
	let forecastsUrl = "";
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
			getForecasts(locationKey);
			initMap(mapLatitude, mapLongitude);
		}
	};
	let initMap = (mapLatitude, mapLongitude) => {
		let map = new google.maps.Map(document.getElementById('map'), {
			center: { lat: mapLatitude, lng: mapLongitude },
			zoom: 11,
			mapTypeId: 'terrain',
			disableDefaultUI: true,
			draggable: false,
			draggableCursor: 'null',
			gestureHandling: 'none'
		});
	};
	let getForecasts = (locationKey) => {
		forecastsUrl = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}&language=${language}&details=${details}&metric=${isMetric}`;
		$.ajax({
			type: 'GET',
			url: forecastsUrl,
			dataType: 'jsonp',
			cache: true,
			jsonpCallback: "callback",
			success: (data) => {
				let minTemp, maxTemp, dayRainfall, dayWindSpeed, forecastDescription;
				let days = [data.DailyForecasts[0], data.DailyForecasts[1], data.DailyForecasts[2]];
				let descritpion = ['Dziś', 'Jutro', 'Pojutrze'];
				let forecasts = ``;

				for (let i = 0; i < days.length; i++) {
					minTemp = `<li>Minimalna temperatura: ${days[i].Temperature.Minimum.Value}°${days[i].Temperature.Minimum.Unit}</li>`;
					maxTemp = `<li>Maksymalna temperatura: ${days[i].Temperature.Maximum.Value}°${days[i].Temperature.Maximum.Unit}</li>`;
					dayRainfall = `<li>Deszcz: ${days[i].Day.Rain.Value}${days[i].Day.Rain.Unit}</li>`;
					dayWindSpeed = `<li>Prędkość wiatru: ${days[i].Day.Wind.Speed.Value}${days[i].Day.Wind.Speed.Unit}</li>`;
					forecastDescription = `<li>${days[i].Day.IconPhrase}</li>`;

					forecasts += `<ul>${descritpion[i]}${forecastDescription}${maxTemp}${minTemp}${dayRainfall}${dayWindSpeed}<ul>`;
				}

				$('#forecasts').html(forecasts);

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
