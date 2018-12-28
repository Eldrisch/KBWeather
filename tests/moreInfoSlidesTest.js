"use strict";
const chalk = require('chalk');
const webdriver = require("selenium-webdriver");

let driver = new webdriver.Builder()
	.forBrowser('firefox')
	.build();
let townArray = ['Londyn', 'Warszawa', 'Świnoujście', 'Tokio', 'Berlin', 'San Francisco', 'Zakopane', 'Moskwa', 'Zbąszyń'];

let advancedInfoDisplayTest = () => {
	let daysArray = ['Dziś', 'Jutro', 'Pojutrze'];
	console.log(chalk.cyan('Test sprawdzający wyświetlanie danych rozpoczęty!'));
	driver.get('http://kbweather.kbaranowski.pl').then(function () {
		console.log(chalk.yellow('  Przeglądarka otwarta na kbweather.kbaranowski.pl:'));
	});
	try {
		driver.findElement(webdriver.By.id('search-bar')).sendKeys(`${townArray[0]}`);
		driver.findElement(webdriver.By.id('search-btn')).click().then(function () {
			console.log(chalk.gray('  -miasto wyszukane...'));
		});
		driver.sleep(1000);
		for (let i = 0; i < daysArray.length; i++) {
			driver.findElement(webdriver.By.id(`forecast-${i + 1}`)).click().then(function () {
				console.log(chalk.magenta(`    ${i + 1}. Kliknięto "${daysArray[i]}"`));
			});
			driver.findElement(webdriver.By.id(`detailed-description-${i + 1}`)).isDisplayed().then(function () {
				console.log(chalk.grey(`   -dane dla "${daysArray[i]}" wyświetlają się...`));
			}, function (err) {
				if (err instanceof webdriver.error.NoSuchElementError) {
					console.log(err);
					console.log(chalk.red('Zawartość nie wyświetla się! Proszę sprawdzić moduł widoków lub klucz API.'));
					driver.quit();
				} else {
					webdriver.promise.rejected(err);
				}
			});
			driver.sleep(1000);
		}
	} finally {
		driver.findElement(webdriver.By.id('forecast-3')).click().then(function () {
			console.log(chalk.magenta('    Powtórne kliknięcie panelu zamyka widok dodatkowy. '));
		}, function (err) {
			if (err instanceof webdriver.error.NoSuchElementError) {
				console.log(err);
				console.log(chalk.red('Zawartość nie chowa się po ponownym kliknięciu, proszę sprawdzić moduł widoków.'));
				driver.quit();
			} else {
				webdriver.promise.rejected(err);
			}
		});
		driver.sleep(1500);
		driver.quit().then(function () {
			console.log(chalk.greenBright('Test zakończony pozytywnie!'));

		});
	}
};
advancedInfoDisplayTest();