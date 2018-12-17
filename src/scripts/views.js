$(function () {
	$('#main, #detailed-1, #detailed-2, #detailed-3, #multiple-locations').hide();
	$('#search-btn').on('click', function () {
		$('#multiple-locations').delay(1500).slideDown(1500, function () {
			$('#multiple-locations li').on('click', () => {
				$('#multiple-locations').delay(3000).slideUp(1500);
			});
		});
	});
});
let viewCounter = 0;
export default function mainView() {
	$('#error').empty();
	$('#header').slideUp(1500, function () {
		$(this).css('display', 'block');
	}).removeClass('header-start').addClass('header-shrink');

	$('#main').show(200, function () {
	
		let dynamicBackground = (iconNumber) => {
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

		if (viewCounter === 0) {
			detailedView();
			viewCounter += 1;
		} else {
			return;
		}

	});
}

