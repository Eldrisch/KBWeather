$(function () {
	$(this).scrollTop(0);
	$('#main, #detailed-1, #detailed-2, #detailed-3, #multiple-locations').hide();

});

let viewCounter = 0;
export default function mainView() {
	$('#error').empty();
	$('#header').slideUp(1500, function () {
		$(this).css('display', 'block');
	}).removeClass('header-start').addClass('header-shrink');

	$('#main').show(200, function () {

		$('#multiple-locations').delay(1500).slideDown(1500, function () {
			$('#multiple-locations li').on('click', () => {
				$('#multiple-locations').delay(7000).slideUp(1500);
			});
		});

		let dynamicBackground = (iconNumber) => {
			if (iconNumber < 3) {
				$('body').css('background-image', 'url("../images/sunny-background.jpg")');
				return;
			} else if (iconNumber >=3 && iconNumber < 5) {
				$('body').css('background-image', 'url("../images/partly-sunny-background.jpg")');
				return;
			} else if (iconNumber == 5) {
				$('body').css('background-image', 'url("../images/hazy-background.jpg")');
				return;
			} else if (iconNumber == 7) {
				$('body').css('background-image', 'url("../images/cloudy-background.jpg")');
				return;
			} else if (iconNumber >= 8 && iconNumber < 12) {
				$('body').css('background-image', 'url("../images/fog-background.jpg")');
				return;
			} else if ((iconNumber >= 12 && iconNumber < 14) || iconNumber == 18) {
				$('body').css('background-image', 'url("../images/rainy-background.jpg")');
				return;
			} else if (iconNumber == 14) {
				$('body').css('background-image', 'url("../images/sunny-rain-background.jpg")');
				return;
			} else if (iconNumber > 14 && iconNumber < 18) {
				$('body').css('background-image', 'url("../images/storm-background.jpg")');
				return;
			} else if (iconNumber > 18 && iconNumber < 22) {
				$('body').css('background-image', 'url("../images/snow-flurries-background.jpg")');
				return;
			} else if (iconNumber > 22 && iconNumber < 25) {
				$('body').css('background-image', 'url("../images/snowy-background.jpg")');
				return;
			} else if (iconNumber > 25 && iconNumber < 30) {
				$('body').css('background-image', 'url("../images/sleet-background.jpg")');
				return;
			} else {
				$('body').css('background-image', 'url("../images/header-background.jpg")');
				return;
			}
			
		};
		let detailedView = () => {
			$('#forecasts').on('click', '#forecast-1, #forecast-2, #forecast-3', function (e) {
				let clickedId = $(this).prop('id').slice(-1);
				let detailedInfo = `#detailed-${clickedId}`;
				let forecastId = `#forecast-${clickedId}`;
				let iconNumber = $('img', this).prop('src').slice(-6, -4);
				console.log(iconNumber);
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

