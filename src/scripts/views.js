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

		let detailedView = () => {
			$('#forecasts').on('click', '#forecast-1, #forecast-2, #forecast-3', function (e) {
				let clickedId = $(this).prop('id').slice(-1);
				let detailedInfo = `#detailed-${clickedId}`;
				let forecastId = `#forecast-${clickedId}`;
				let iconNumber = $('img', this).prop('src').slice(-5, -4);
				console.log(iconNumber);
				if ($(detailedInfo).css('display') == 'none') {
					$(detailedInfo).slideDown(500).siblings().slideUp(500);
					$(forecastId).addClass('active').siblings().removeClass('active');
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

