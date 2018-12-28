# Strona Pogodowa dla DevPractice

Aplikacja pogodowa stworzona w ramach programu stażowego dla młodych programistów przez firmę DevPractice. Strona wyświetla się jako łatwo przystępny *One Page*. Zdecydowałem się na to rozwiązanie ze względu na łatwość w obsłudze, intuicyjność i stosunkowo mały rozmiar strony. Możemy łatwo zaimplementować kolejne zmiany, treść na stronie dynamicznie się generuje w krótkim czasie. Aplikacja jest również napisana prostym, przejrzystym kodem czystego JavaScriptu, przez co łatwo go wyeksportować do wybranego frameworku w dalszym procesie produkcji.

## Jak zacząć?

Wystarczy skopiowiać to repozytorium na swój komputer, wszystkie niezbędne pliki są tutaj umieszczone.

### Wymagania do poprawnego działania aplikacji

Aby strona pogodowa działała poprawnie, oprócz wstawienia plików na serwer, deweloper potrzebuje dwóch kodów API:
Accuweather API oraz GoogleMaps API.
Po załozeniu kont i wybraniu planu płatności w tych serwisach, musimy zastąpić klucze tymczesowe swoimi odpowiednio:

Dla *Accuweather API*:
weather-data.js:10
```
const apiKey = "Twój-Klucz-API"
```
Dla *GoogleMaps API*:
index.html:67
```
<script src="https://maps.googleapis.com/maps/api/js?key=TWÓJ-KLUCZ-API" async defer></script>
```
Aby aplikacja działała na serwerze zewnętrznym, należy przenieść wszystkie foldery znajdujące się w *KBWeather/src* do głównego katalogu *KBWeather*

### Instalacja środowiska dla dewelopera

Po skopiowaniu repozytorium wystarczy zainstalować wszystkie pluginy NODE zamieszczone w *package.json* za pomocą menedżera pakietów w folderze, w którym znajduje się ten plik:

NPM
```
npm install
```
Yarn:
```
yarn install
```

Po zakończonej instalacji wystarczy wpisać w konsoli polecenie dla gulp, które utworzy nam serwer z automatycznie odświeżającą się przeglądarką przy każdej zapisanej zmianie:
```
gulp
```

## Testowanie 

Do testowania zostało użyte *Selenium WebDriver*.
Narzędzie to testuje najważniejsze funkcje aplikacji w łatwy i przystępny sposób.

Aby uruchomić testy, wystarczy przejść w konsoli do folderu *KBWeather/tests* i wpisać *node/yarn + nazwaPlikuTestu*, np.:
```
node citySearchTest.js
```
Testy automatycznie otwierają przeglądarkę, wprowadzają dane i imitują interakcje użytkownika, co pozwala sprawdzić działanie aplikacji "na żywo".


Przykład raportów testu w konsoli:
```
A:\KBWeather\tests>node citySearchTest.js
Test wyszukiwania miast rozpoczęty!
  Przeglądarka otwarta na kbweather.kbaranowski.pl:
   1. Miasto Londyn zostało wprowadzone do paska szukania i zatwierdzone:
   -dane dla miasta wyświetlają się...
   2. Miasto Warszawa zostało wprowadzone do paska szukania i zatwierdzone:
   -dane dla miasta wyświetlają się...
   3. Miasto Świnoujście zostało wprowadzone do paska szukania i zatwierdzone:
   -dane dla miasta wyświetlają się...
   4. Miasto Tokio zostało wprowadzone do paska szukania i zatwierdzone:
   -dane dla miasta wyświetlają się...
   5. Miasto Berlin zostało wprowadzone do paska szukania i zatwierdzone:
   -dane dla miasta wyświetlają się...
   6. Miasto San Francisco zostało wprowadzone do paska szukania i zatwierdzone:
   -dane dla miasta wyświetlają się...
   7. Miasto Zakopane zostało wprowadzone do paska szukania i zatwierdzone:
   -dane dla miasta wyświetlają się...
   8. Miasto Moskwa zostało wprowadzone do paska szukania i zatwierdzone:
   -dane dla miasta wyświetlają się...
   9. Miasto Zbąszyń zostało wprowadzone do paska szukania i zatwierdzone:
   -dane dla miasta wyświetlają się...
Test zakończony pozytywnie!
```

Jeżeli test znajdzie błąd, poinformuje nas o tym wyświetlając komunikat:
```
A:\KBWeather\tests>node citySearchTest.js
Test wyszukiwania miast rozpoczęty!
  Przeglądarka otwarta na kbweather.kbaranowski.pl:
   1. Miasto Londyn zostało wprowadzone do paska szukania i zatwierdzone:
{ NoSuchElementError: Unable to locate element: *[id="description"]
    at Object.throwDecodedError (A:\KBWeather\node_modules\selenium-webdriver\lib\error.js:514:15)
    at parseHttpResponse (A:\KBWeather\node_modules\selenium-webdriver\lib\http.js:519:13)
    at doSend.then.response (A:\KBWeather\node_modules\selenium-webdriver\lib\http.js:441:30)
    at <anonymous>
    at process._tickCallback (internal/process/next_tick.js:188:7)
From: Task: WebDriver.findElement(By(css selector, *[id="description"]))
    at thenableWebDriverProxy.schedule (A:\KBWeather\node_modules\selenium-webdriver\lib\webdriver.js:807:17)
    at thenableWebDriverProxy.findElement (A:\KBWeather\node_modules\selenium-webdriver\lib\webdriver.js:1014:17)
    at citySearchLocationTest (A:\KBWeather\tests\citySearchTest.js:23:11)
    at Object.<anonymous> (A:\KBWeather\tests\citySearchTest.js:44:1)
    at Module._compile (module.js:652:30)
    at Object.Module._extensions..js (module.js:663:10)
    at Module.load (module.js:565:32)
    at tryModuleLoad (module.js:505:12)
    at Function.Module._load (module.js:497:3)
    at Function.Module.runMain (module.js:693:10)
  name: 'NoSuchElementError',
  remoteStacktrace: 'WebDriverError@chrome://marionette/content/error.js:178:5\nNoSuchElementError@chrome://marionette/content/error.js:388:5\nelement.find/</<@chrome://marionette/content/element.js:339:16\n' }
Zawartość nie wyświetla się! Test zakończony negatywnie, proszę sprawdzić połączenie internetowe lub ważność kodu Accuweather API
```
### Zawartość testów

W katalogu *tests* znajdują się trzy testy:
* **citySearchTest.js** - sprawdza, czy pasek wyszukiwania wysyła wprowadzoną wartość to zapytania AJAX i główna zawartość przypisana do niej zostaje wyświetlona. Zawartość ta, to główny widok trzydniowej prognozy pogody.
* **moreInfoSlidesTest.js** - sprawdza, czy widok zaawansowanych informacji wyświetla się,
* **multipleLocationsTest.js** - sprawdza, czy widok lokacji powtarzających się, wyświetla się prawidłowo.

Jeżeli test zakończy się niepowodzeniem, wyświetla się błąd, który informuje nas o braku tego elementu. Należy wtedy sprawdzić połączenie internetowe, ważność kodu Accuweather API lub pliki w folderze *KBWeather/scripts*. 

Oprócz plików testowych, w folderze znajduje się też *KBWeather Tests.side*, czyli plik z nagranymi testami w *SeleniumIDE*.
Jest to plugin przeglądarkowy, który pozwala nam na szybkie sprawdzenie funkcjonalności strony bez klonowania całego repozytorium. Aby użyć tego pluginu, wystarczy wyszukać *SeleniumIDE* w menedżerze wtyczek danej przeglądarki, zainstalować ją, a następnie wczytać plik.

## Użyte do stworzenia aplikacji:

* JavaScript
* JQuery
* HTML
* CSS

## Autor

* **Kacper Baranowski** - [Eldrisch](https://github.com/Eldrisch)


## License

Ten projekt jest chroniony licencją MIT - zobacz plik [LICENSE.md](LICENSE.md)
