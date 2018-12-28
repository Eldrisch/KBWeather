$(function () {
	$('#main, #detailed-1, #detailed-2, #detailed-3, #multiple-locations').hide(); // ukrywa podstawowe divy
	$('#search-btn').on('click', function () { // funkcja, która wyświetla dane po uzyskaniu ich przez naciśnięcie przycisku "prognozuj"
		$('#multiple-locations').delay(1500).slideDown(1500, function () { // funkcja wyświetlająca wielokrotność miast i ukrywająca ją po wybraniu tego właściwego
			$('#multiple-locations li').on('click', () => {
				$('#multiple-locations').delay(3000).slideUp(1500);
			});
		});
	});
});
let viewCounter = 0; // wartość, która sprawdza czy element funkcji detailedView jest już wywołany, jeżeli nie, ta wartość wynosi 0, inaczej wynosi ona 1
export default function mainView() {
	$('#error').empty(); // usuwa wartość raportująca o błędzie, jeżeli wystąpił on wcześniej na stronie
	$('#header').slideUp(1500, function () { // funkcja przesuwająca pasek wyszukiwania do góry strony
		$(this).css('display', 'block');
	}).removeClass('header-start').addClass('header-shrink');

	$('#main').show(200, function () { // funkcja wyświetlające dane i widoki strony
		
		let dynamicBackground = (iconNumber) => { // funkcja, która zmienia tło w zalezności od występującej pogody
			if (iconNumber < 3) {
				$('body').attr('class', 'background-sunny');
				return;
			} else if (iconNumber >= 3 && iconNumber < 5) {
				$('body').attr('class', 'background-partly-sunny');
				return;
			} else if (iconNumber == 5) {
				$('body').attr('class', 'background-hazy');
				return;
			} else if (iconNumber == 6 || iconNumber == 7) {
				$('body').attr('class', 'background-cloudy');
				return;
			} else if (iconNumber >= 8 && iconNumber < 12 || iconNumber ==32) {
				$('body').attr('class', 'background-fog');
				return;
			} else if ((iconNumber >= 12 && iconNumber < 14) || iconNumber == 18) {
				$('body').attr('class', 'background-rainy');
				return;
			} else if (iconNumber == 14) {
				$('body').attr('class', 'background-sunny-rain');
				return;
			} else if (iconNumber > 14 && iconNumber < 18) {
				$('body').attr('class', 'background-storm');
				return;
			} else if (iconNumber > 18 && iconNumber < 22) {
				$('body').attr('class', 'background-snow-flurries');
				return;
			} else if (iconNumber >= 22 && iconNumber < 25) {
				$('body').attr('class', 'background-snowy');
				return;
			} else if (iconNumber > 25 && iconNumber < 30) {
				$('body').attr('class', 'background-sleet');
				return;
			} else if (iconNumber == 30) {
				$('body').attr('class', 'background-hot');
			} else if (iconNumber == 31) {
				$('body').attr('class', 'background-cold');
			} else {
				return;
			}

		};
		let detailedView = () => { 
			// funckja, która jest odpowiedzialan za wysuwanie paneli informacji szczegółowych oraz pozyskanie numeru ikony dla funkcji zmieniającej tło
			$('#forecasts').on('click', '#forecast-1, #forecast-2, #forecast-3', function (e) {
				let clickedId = $(this).prop('id').slice(-1);
				let detailedInfo = `#detailed-${clickedId}`;
				let forecastId = `#forecast-${clickedId}`;
				let iconNumber = $('img', this).prop('src').slice(-6, -4);
				if ($(detailedInfo).css('display') == 'none') {
					$(detailedInfo).slideDown(500).siblings().slideUp(500);
					$(forecastId).addClass('active').siblings().removeClass('active');
					dynamicBackground(iconNumber);
					e.stopPropagation();
					return;
				} else {
					$(detailedInfo).slideUp(500);
					$(forecastId).removeClass('active');
					e.stopPropagation();
					return;
				}
			});
		};

		if (viewCounter === 0) { // warunek odpowiedzialny za jednokrotne uruchomienie funkcji wyświetlającej panele widoków na sesję, usunięcie go spowoduje, błąd aplikacji
			detailedView();
			viewCounter += 1;
		} else {
			return;
		}

	});
}

