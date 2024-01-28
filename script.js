// API key for OpenWeatherMap API (replace with your own key)
var apiKey = "20be103c6242f46290b71482f79294de";

// Function to fetch weather data from OpenWeatherMap API
function getWeatherData(city, apiKey) {
  // Construct the API URL based on the city and API key
  var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  // Fetch data from the API and parse the JSON response
  return fetch(apiURL)
    .then(function (response) {
      return response.json();
    });
}

// Function to update weather information in the HTML document
function updateWeatherInfo(data) {
  // Convert temperature from Kelvin to Celsius
  var tempC = data.main.temp - 273.15;

  // Update HTML elements with weather information
  document.getElementById("city").innerText = data.name;
  document.getElementById("temperature").innerText = "Temp: " + tempC.toFixed(2) + " °C";
  document.getElementById("windSpeed").innerText = "Wind: " + data.wind.speed + " KPH";
  document.getElementById("humidity").innerText = "Humidity: " + data.main.humidity + "%";

  // Set the current date next to the city
  var currentDate = formatDate(new Date());
  document.getElementById("city").innerHTML += ` ${currentDate}`;

  // Extract latitude and longitude from the response
  const lat = data.coord.lat;
  const lon = data.coord.lon;

  // Now you can use lat and lon to make the 5 Day Weather Forecast API call
  var forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  // Use the forecastURL for further processing
  console.log(forecastURL);
}

// Function to format the current date
function formatDate(date) {
  return dayjs(date).format("(DD/MM/YY)");
}

// Event listener for DOMContentLoaded event (page load)
document.addEventListener('DOMContentLoaded', function () {
  // Event listener for form submission
  document.getElementById('search-form').addEventListener('submit', function (event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Get the city input value from the form
    var cityInput = document.getElementById('search-input').value;

    // Fetch weather data for the entered city and update the UI
    getWeatherData(cityInput, apiKey)
      .then(function (data) {
        if (data) {
          updateWeatherInfo(data);
        }
      });
  });
});