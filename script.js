// https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}

var apiKey = "20be103c6242f46290b71482f79294de"
var city = "London"

var apiURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;



fetch(apiURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {

        var tempC = data.main.temp - 273.15;

      // console log temp
      console.log("Temperature: " + tempC.toFixed(2) + "(C)");
     // console log wind
      console.log("Wind Speed: " + data.wind.speed + " KPH");
      // console log humidity
      console.log("Humidity: " + data.main.humidity + "%");

    })