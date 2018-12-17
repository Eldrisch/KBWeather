"use strict";
const chalk = require('chalk');
const webdriver = require("selenium-webdriver");

let driver = new webdriver.Builder()
	.forBrowser('firefox')
	.build();
let townArray = ['Londyn', 'Warszawa', 'Świnoujście', 'Tokio', 'Berlin', 'San Francisco', 'Zakopane', 'Moskwa', 'Zbąszyń'];

let citySearchLocationTest = () => {
	console.log(chalk.cyan('Test wyszukiwania miast rozpoczęty!'));
	driver.get('http://kbweather.kbaranowski.pl').then(function () {
		console.log(chalk.yellow('  Przeglądarka otwarta na kbweather.kbaranowski.pl:'));
	});
	try {
		for (let i = 0; i < townArray.length; i++) {

			driver.findElement(webdriver.By.id('search-bar')).sendKeys(`${townArray[i]}`);
			driver.findElement(webdriver.By.id('search-btn')).click();
			driver.sleep(1000).then(function () {
				console.log(chalk.magenta(`   ${i + 1}. Miasto ${townArray[i]} zostało wprowadzone do paska szukania i zatwierdzone:`));
			});
			driver.findElement(webdriver.By.id('description')).then(function () {
				console.log(chalk.grey('   -dane dla miasta wyświetlają się...'));
			}, function (err) {
				if (err instanceof webdriver.error.NoSuchElementError) {
					console.log(err);
					console.log(chalk.red('Zawartość nie wyświetla się! Test zakończony negatywnie, proszę sprawdzić połączenie internetowe lub ważność kodu Accuweather API'));
					driver.quit();
				} else {
					webdriver.promise.rejected(err);
				}
			});

			driver.navigate().refresh();
		}
	} finally {
		driver.quit().then(function () {
			console.log(chalk.greenBright('Test zakończony pozytywnie!'));

		});
	}
};
citySearchLocationTest();