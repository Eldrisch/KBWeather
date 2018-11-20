/* eslint-disable no-unused-vars */

$(function () {
	let isMetric = true;
	let locationUrl = "";
	let forecastsUrl = "";
	let language = "pl-pl";
	let details = true;
	const apiKey = "A5cicXqU66tVCblupsec6swIZmq8V51V";

	let searchCityLocation = (inputText) => {
		
		let encodedText = encodeURIComponent(inputText);
		locationUrl = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${encodedText}&language=${language}&details=${details}`;
		$.ajax({
			type: "GET",
			url: locationUrl,
			dataType: "jsonp",
			cache: false,
			jsonpCallback: "callback",
			success: (data) => { 
				cityLocationFound(data);
			},
			error: function (xhr) {
				alert('Request Status: ' + xhr.status + ' Status Text: ' + xhr.statusText + ' ' + xhr.responseText);
			}
		});
	};
	let cityLocationFound = (data) => {
		$('#multiple-locations').empty();
		let locationKey = null;
		let mapLatitude = null;
		let mapLongitude = null;
		let error = '';
		let multipleLocations = ``;
		let population = null;
		if (data.length == 1) {
			locationKey = data[0].Key;
			mapLatitude = data[0].GeoPosition.Latitude;
			mapLongitude = data[0].GeoPosition.Longitude;
			population = data[0].Details.Population;
			console.log(`One location found: ${data[0].LocalizedName} Key: ${locationKey} Latitude: ${mapLatitude} Longitude: ${mapLongitude}`);
			getForecasts(locationKey);
			initMap(mapLatitude, mapLongitude, population);
		}
		else if (data.length == 0) {
			console.log("No locations found.");
			error += '<p>Nie ma takiego miasta! Sprawdź czy poprawnie wpisałeś nazwę!</p>';
			$('#error').html(error);
		}
		else {
			locationKey = data[0].Key;
			mapLatitude = data[0].GeoPosition.Latitude;
			mapLongitude = data[0].GeoPosition.Longitude;
			population = data[0].Details.Population;
			getForecasts(locationKey);
			initMap(mapLatitude, mapLongitude, population);
			let locationsInfo = 'Hmmm... Wygląda na to, że Twoje miasto występuje na mapie świata więcej niż raz. Wybierz swoje z listy poniżej:';
			multipleLocations += `<h3>${locationsInfo}</h3>`;
			console.log(`Multiple locations found: (${data.length}).`);
			for (let i = 0; i < data.length; i++) {
				try {
					multipleLocations += `<li id="${i}">${data[i].LocalizedName}, powiat: ${data[i].SupplementalAdminAreas[0].LocalizedName}, gmina: ${data[i].SupplementalAdminAreas[1].LocalizedName}, ${data[i].Country.LocalizedName}</li>`;
				}
				catch (err) {
					try {
						console.log(err.message);
						multipleLocations += `<li id="${i}">${data[i].LocalizedName}, ${data[i].SupplementalAdminAreas[0].LocalizedName}, ${data[i].Country.LocalizedName}</li>`;
					}
					catch (err) {
						console.log(err.message);
						multipleLocations += `<li id="${i}">${data[i].LocalizedName}, ${data[i].AdministrativeArea.LocalizedName} ${data[i].Country.LocalizedName}</li>`;
					}
				}
			}
			
			$('#multiple-locations').html(multipleLocations);
			$('#multiple-locations > li').click(function () {
				let idNumber = $(this).prop('id');
				locationKey = data[idNumber].Key;
				mapLatitude = data[idNumber].GeoPosition.Latitude;
				mapLongitude = data[idNumber].GeoPosition.Longitude;
				population = data[idNumber].Details.Population;
				getForecasts(locationKey);
				initMap(mapLatitude, mapLongitude, population);
			});
			
		}
	};
	let initMap = (mapLatitude, mapLongitude, population) => {
		let autoZoom = null;
		if (population > 15000000) {
			autoZoom = 8;
			console.log(autoZoom);
			console.log(population);
		} else if (population > 1500000) {
			autoZoom = 9;
			console.log(autoZoom);
			console.log(population);
		} else if (population > 150000) {
			autoZoom = 10;
			console.log(autoZoom);
			console.log(population);
		} else if (population > 15000) {
			autoZoom = 11;
			console.log(autoZoom);
			console.log(population);
		} else if (population > 5000 ){
			autoZoom = 12;
			console.log(autoZoom);
			console.log(population);
		} else if (population > 500) {
			autoZoom = 13;
			console.log(autoZoom);
			console.log(population);
		} else {
			autoZoom = 14;
			console.log(autoZoom);
			console.log(population);
		}

		let map = new google.maps.Map(document.getElementById('map'), {
			center: { lat: mapLatitude, lng: mapLongitude },
			zoom: autoZoom,
			mapTypeId: 'roadmap',
			disableDefaultUI: true,
			draggable: false,
			draggableCursor: 'auto',
			gestureHandling: 'none',
			clickableIcons: false,
		});
	};
	let getForecasts = (locationKey) => {
		$('#forecasts, #details').empty();

		forecastsUrl = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}&language=${language}&details=${details}&metric=${isMetric}`;
		$.ajax({
			type: 'GET',
			url: forecastsUrl,
			dataType: 'jsonp',
			cache: false,
			jsonpCallback: "callback",
			success: (data) => {
				let minTemp, maxTemp, minmaxTemp, dayRainfall, daySnowfall, nightRainfall, nightSnowfall, dayWindSpeed, nightWindSpeed, forecastDescription, nightForecastDescription, dayRainProbability, nightRainProbability, realTemp, icon;
				let days = [data.DailyForecasts[0], data.DailyForecasts[1], data.DailyForecasts[2]];
				let descritpion = ['Dziś', 'Jutro', 'Pojutrze'];
				let forecasts = ``;
				let detailedForecasts = [];

				for (let i = 0; i < days.length; i++) {
					minTemp = `<li>Minimalna temperatura: ${days[i].Temperature.Minimum.Value}°${days[i].Temperature.Minimum.Unit}</li>`;
					maxTemp = `<li>Maksymalna temperatura: ${days[i].Temperature.Maximum.Value}°${days[i].Temperature.Maximum.Unit}</li>`;
					minmaxTemp = `${days[i].Temperature.Maximum.Value}°${days[i].Temperature.Maximum.Unit}<span class="night-temp">/${days[i].Temperature.Minimum.Value}°${days[i].Temperature.Minimum.Unit}<span>`;
					dayRainfall = `<li>Opady deszczu w dzień: ${days[i].Day.Rain.Value}${days[i].Day.Rain.Unit}</li>`;
					daySnowfall = `<li>Opady śniegu w dzień: ${days[i].Day.Snow.Value}${days[i].Day.Snow.Unit}</li>`;
					nightRainfall = `<li>Opady deszczu w nocy: ${days[i].Night.Rain.Value}${days[i].Night.Rain.Unit}</li>`;
					nightSnowfall = `<li>Opady śniegu w nocy:${days[i].Night.Snow.Value}${days[i].Night.Snow.Unit}</li>`;
					dayWindSpeed = `<li>Prędkość wiatru w dzień: ${days[i].Day.Wind.Speed.Value}${days[i].Day.Wind.Speed.Unit}</li>`;
					nightWindSpeed = `<li>Prędkość wiatru w nocy: ${days[i].Day.Wind.Speed.Value}${days[i].Day.Wind.Speed.Unit}</li>`;
					forecastDescription = `${days[i].Day.IconPhrase}`;
					nightForecastDescription = `<li>${days[i].Night.IconPhrase}</li>`;
					dayRainProbability = `<li>Prawdopodobieństwo deszczu: ${days[i].Day.RainProbability}%</li>`;
					nightRainProbability = `<li>Prawdopodobieństwo deszczu: ${days[i].Night.RainProbability}</li>`;
					realTemp = `Odczuwalna ${days[i].RealFeelTemperature.Maximum.Value}°<span class="night-temp">/${days[i].RealFeelTemperature.Minimum.Value}°${days[i].RealFeelTemperature.Minimum.Unit}</span>`;
					icon = `${days[i].Day.Icon}.png`;
					
					forecasts += `<div id="forecast-${i+1}"><h1>${descritpion[i]}</h1><br/><img class="forecast-icon" src="images/${icon}" width="75px" height="45px"/><p class="main-temp">${minmaxTemp}</p><br/><p>${realTemp}</p><p>${forecastDescription}</p></div>`;
					detailedForecasts.push(`<div class="detailed"><ul>${minTemp}${maxTemp}${dayRainProbability}${nightRainProbability}${dayRainfall}${nightRainfall}${daySnowfall}${nightSnowfall}${dayWindSpeed}${nightWindSpeed}</ul></div>`);
				}
				
				$('#forecasts').html(forecasts);
				$('#detailed-1').html(detailedForecasts[0]);
				$('#detailed-2').html(detailedForecasts[1]);
				$('#detailed-3').html(detailedForecasts[2]);
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
