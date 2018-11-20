$(function () {
	$(this).scrollTop(0);
	$('#main').hide();
	$('#search-btn').on('click', () => {
		$('#detailed-1, #detailed-2, #detailed-3, #multiple-locations').hide();
		$('#header').slideUp(1500, function () {
			$(this).css('display', 'block');
		}).removeClass('header-start').addClass('header-shrink');
		$('#main').show(200, function () {
			$('#multiple-locations').delay(2000).slideDown(1500, function () {
				$(this).css('display', 'block');
				$('#multiple-locations li').on('click', () => {
					$('#multiple-locations').delay(2000).slideUp(1500);
				});
			});
			$('#forecasts').on('click', '#forecast-1, #forecast-2, #forecast-3', function (e) {
				let clickedId = $(this).prop('id').slice(-1);
				console.log(clickedId);
				let detailedInfo = `#detailed-${clickedId}`;
				let forecastId = `#forecast-${clickedId}`;
				if ($(detailedInfo).css('display') == 'none') {
					$(detailedInfo).slideDown(500).siblings().slideUp(500);
					$(forecastId).addClass('active').siblings().removeClass('active');
					e.preventPropagation();
				} else {
					$(detailedInfo).slideUp(500);
					$(forecastId).removeClass('active');
					e.preventPropagation();
				}
			});
		});
	});
});