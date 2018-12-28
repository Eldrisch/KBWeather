"use strict";
const chalk = require('chalk');
const webdriver = require("selenium-webdriver");

let driver = new webdriver.Builder()
	.forBrowser('firefox')
	.build();

let multipleLocationsDisplayTest = () => {
	console.log(chalk.cyan('Test wybierania prawidłowej powtarzającej się miejscowości rozpoczęty!'));
	driver.get('http://kbweather.kbaranowski.pl').then(function () {
		console.log(chalk.yellow('  Przeglądarka otwarta na kbweather.kbaranowski.pl:'));
	});
	try {
		driver.sleep(1000).then(function () {
			console.log(chalk.magenta('    Testowanie wielokrotnych miejscowości:'));
		});
		for (let i = 0; i < 11; i++) {
			driver.findElement(webdriver.By.id('search-bar')).sendKeys('Krępa');
			driver.findElement(webdriver.By.id('search-btn')).click();
			driver.sleep(1000);
			driver.findElement(webdriver.By.id(`${i}`)).click().then(function () {
				driver.findElement(webdriver.By.id(`${i}`)).isDisplayed().then(function () {
					driver.findElement(webdriver.By.id(`${i}`)).getText().then(function (text) { 
						console.log(chalk.gray(`    -miasto wybrane: ${text}`));
					});
				}, function (err) {
					if (err instanceof webdriver.error.NoSuchElementError) {
						console.log(err);
						console.log(chalk.red('Zawartość nie wyświetla się! Proszę sprawdzić moduł widoków lub klucz API.'));
						driver.quit();
					} else {
						webdriver.promise.rejected(err);
					}
				});
			}, function (err) {
				if (err instanceof webdriver.error.NoSuchElementError) {
					console.log(err);
					console.log(chalk.red('Zawartość nie wyświetla się! Proszę sprawdzić moduł widoków lub klucz API.'));
					driver.quit();
				} else {
					webdriver.promise.rejected(err);
				}
			});
			driver.navigate().refresh();
		}
	} finally {
		driver.sleep(1500);
		driver.quit().then(function () {
			console.log(chalk.greenBright('Test zakończony pozytywnie!'));

		});
	}
};
multipleLocationsDisplayTest();