/* eslint-disable no-unused-vars */
import mainView from './views.js';

$(function () {
	let isMetric = true;
	let locationUrl = "";
	let forecastsUrl = "";
	let language = "pl-pl";
	let details = true;
	const apiKey = "xeO8Hjb2NIOUahKyM82KyrUFqiK6TL74"; // klucz Accuweather API

	let searchCityLocation = (inputText) => { // funkcja, która pozyskuje klucz lokalizacji dla danego miasta
		$('#multiple-locations').empty(); // div dla wielokrotnych lokacji oczyszczany przed każdym wyszukaniem miasta
		let encodedText = encodeURIComponent(inputText); // kodowanie znaków specjalnych
		locationUrl = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${encodedText}&language=${language}&details=${details}`;
		$.ajax({
			type: "GET",
			url: locationUrl,
			dataType: "jsonp",
			cache: true,
			jsonpCallback: "callback",
			success: (data) => { // jeżeli połączenie zostanie uzyskane, dane zostają przekazane kolejnej funkcji
				cityLocationFound(data); 
			},
			error: function (xhr) { // jeżeli aplikacja nie uzyska danych, wyświetli się błąd w konsoli i pod paskiem wyszukiwania
				console.log('Request Status: ' + xhr.status + ' Status Text: ' + xhr.statusText + ' ' + xhr.responseText);
				$('error').html('<p>Nie udało połączyć się z bazą danych, sprawdź połączenie internetowe !!</p>');
			}
		});
	};
	let cityLocationFound = (data) => { 
		// funckja ta sprawdza czy miasto występuje na mapie, wyświetla mapę i wysyła klucz miasta do funkcji, która pozyskuje dane pogodowe
		let locationKey = null;
		let mapLatitude = null;
		let mapLongitude = null;
		let error = '';
		let multipleLocations = ``;
		let population = null;
		if (data.length == 1) { // jeżeli miasto występuje tylko raz na mapie, ten warunek zostaje wykonany
			locationKey = data[0].Key;
			mapLatitude = data[0].GeoPosition.Latitude;
			mapLongitude = data[0].GeoPosition.Longitude;
			population = data[0].Details.Population;
			getForecasts(locationKey);
			initMap(mapLatitude, mapLongitude, population);
		}
		else if (data.length == 0) { // jeżeli miasto nie występuje w ogóle, ten warunek zostaje wykonany
			error += '<p>Nie ma takiego miasta. Sprawdź czy poprawnie wpisałeś nazwę!</p>';
			$('#error').html(error);
		}
		else { // jeżeli miasto występuje więcej niż raz na mapie, ten warunek zostaje spełniony
			locationKey = data[0].Key;
			mapLatitude = data[0].GeoPosition.Latitude;
			mapLongitude = data[0].GeoPosition.Longitude;
			population = data[0].Details.Population;
			getForecasts(locationKey);
			initMap(mapLatitude, mapLongitude, population); 
			let locationsInfo = 'Hmmm... Wygląda na to, że Twoje miasto występuje na mapie świata więcej niż raz. Wybierz swoje z listy poniżej:';
			multipleLocations += `<h3>${locationsInfo}</h3>`;
			for (let i = 0; i < data.length; i++) {
				try {
					multipleLocations += `<li id="${i}">${data[i].LocalizedName}, powiat: ${data[i].SupplementalAdminAreas[0].LocalizedName}, gmina: ${data[i].SupplementalAdminAreas[1].LocalizedName}, ${data[i].Country.LocalizedName}</li>`;
				}
				catch (err) {
					try {
						multipleLocations += `<li id="${i}">${data[i].LocalizedName}, ${data[i].SupplementalAdminAreas[0].LocalizedName}, ${data[i].Country.LocalizedName}</li>`;
					}
					catch (err) {
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
		// funkcja, która pozyskuje współrzędne geograficzne wybranego miasta oraz liczbę populacji dla automatycznego przybliżenia miasta
		let autoZoom = null;
		// warunki, które wyznaczają wartość przybliżenia dla miasta na podstawie populacji
		if (population > 15000000) {
			autoZoom = 8;
		} else if (population > 1500000) {
			autoZoom = 9;
		} else if (population > 150000) {
			autoZoom = 10;
		} else if (population > 15000) {
			autoZoom = 11;
		} else if (population > 5000 ){
			autoZoom = 12;
		} else if (population > 500) {
			autoZoom = 13;
		} else {
			autoZoom = 14;
		}
		// zainicjowanie mapy
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
		// funkcja, która pozyskuje dane pogodowe oraz generuje zawartość na stronie
		forecastsUrl = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}&language=${language}&details=${details}&metric=${isMetric}`;
		$.ajax({
			type: 'GET',
			url: forecastsUrl,
			dataType: 'jsonp',
			cache: true,
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
					realTemp = `Odczuwalna ${days[i].RealFeelTemperature.Maximum.Value}°<span class="night-temp-real">/${days[i].RealFeelTemperature.Minimum.Value}°${days[i].RealFeelTemperature.Minimum.Unit}</span>`;
					if (days[i].Day.Icon < 10) {
						icon = `0${days[i].Day.Icon}.png`;
					} else {
						icon = `${days[i].Day.Icon}.png`;
					}
					forecasts += `<div id="forecast-${i+1}"><h1 id="description">${descritpion[i]}</h1><br/><img class="forecast-icon" src="images/${icon}" width="60px" height="45px"/><p class="main-temp">${minmaxTemp}</p><br/><p>${realTemp}</p><p>${forecastDescription}</p></div>`;
					detailedForecasts.push(`<div id="detailed-description-${i+1}"class="detailed"><ul>${minTemp}${maxTemp}${dayRainProbability}${nightRainProbability}${dayRainfall}${nightRainfall}${daySnowfall}${nightSnowfall}${dayWindSpeed}${nightWindSpeed}</ul></div>`);
				}
				
				$('#forecasts').html(forecasts);
				$('#detailed-1').html(detailedForecasts[0]);
				$('#detailed-2').html(detailedForecasts[1]);
				$('#detailed-3').html(detailedForecasts[2]);
			}
		});
		// inicjacja funkcji odpowiedzialnej za widoki
		mainView();
	};
	$('#search-btn').click(() => { // funkcja która jest odpowiedzialna za działanie przycisku "prognozuj"
		$('#detailed-1, #detailed-2, #detailed-3').hide();
		let inputText = $('#search-bar').val();
		searchCityLocation(inputText);
	});
	$('#search-bar').keypress(function (e) { // funkcja, która jest odpowiedzialna za działanie przycisku enter zamiast przycisku "prognozuj"
		if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
			$('#search-btn').click();
			return false;
		} else {
			return true;
		}
	});
	
});
