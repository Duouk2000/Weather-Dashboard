// API key for OpenWeatherMap API
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

// Function to format the current date
function formatDate(date) {
  return dayjs(date).format("(DD/MM/YYYY)");
}

// Function to update weather information in the HTML document
function updateWeatherInfo(data) {
  // Convert temperature from Kelvin to Celsius
  var tempC = data.main.temp - 273.15;

  // Update HTML elements with weather information
  var cityElement = document.getElementById("city");
  cityElement.innerText = data.name;
  document.getElementById("temperature").innerText = "Temp: " + tempC.toFixed(2) + " °C";
  document.getElementById("windSpeed").innerText = "Wind: " + data.wind.speed + " KPH";
  document.getElementById("humidity").innerText = "Humidity: " + data.main.humidity + "%";

  // Set the current date next to the city
  var currentDate = formatDate(new Date());

  // Get the weather icon code from the data
  var weatherIcon = data.weather[0].icon;

  // Create an <img> tag for the weather icon
  var iconImg = document.createElement("img");
  iconImg.src = `http://openweathermap.org/img/w/${weatherIcon}.png`;
  iconImg.alt = "Weather Icon";

  // Append the current date and weather icon to the "city" element
  cityElement.innerHTML += ` ${currentDate}`;
  cityElement.appendChild(iconImg);

  // Extract latitude and longitude from the response
  var lat = data.coord.lat;
  var lon = data.coord.lon;

  // Use latitude and longitude variables to make the 5 Day Weather Forecast API call
  var forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  // Fetch data from the forecast API and parse the JSON response
  fetch(forecastURL)
    .then(function(response) {
      return response.json();
    })
    .then(function(forecastData) {
      // Console Log the forecast data as JSON
      console.log("Forecast Data:", forecastData);
      var forecastSection = document.getElementById("forecast");
      var previousDate = '';

      // Loop through the forecast data starting from the 8th element
      for (let i = 8; i < forecastData.list.length; i++) {
        // Extract the date for each forecast entry
        var currentDate = dayjs(forecastData.list[i].dt_txt).format('DD/MM/YYYY');

        // Check if it's a new day
        if (currentDate !== previousDate) {
          // Extract specific information for each forecast entry
          var date = dayjs(forecastData.list[i].dt_txt).format('DD/MM/YYYY');
          var temperature = (forecastData.list[i].main.temp - 273.15).toFixed(2); // Convert from Kelvin to Celsius
          var fWindSpeed = (forecastData.list[i].wind.speed);
          var fHumidity = (forecastData.list[i].main.humidity);
          var weatherIcon = forecastData.list[i].weather[0].icon; // Get the forecast icon code
          // Create new HTML elements for each day
          var dayContainer = document.createElement('div');
          dayContainer.classList.add('col-md-2', 'mb-3', 'forecast-day'); // Customize the classes as needed
          // Set background color & margin using style property
          dayContainer.style.backgroundColor = '#2D3E50';
          dayContainer.style.margin = '10px';          
          // Display date
          var dateInfo = document.createElement('p');
          dateInfo.textContent = `${date}`;
          dayContainer.appendChild(dateInfo);
          // Create an <img> tag for the forecast icon
          var iconImg = document.createElement('img');
          iconImg.src = `http://openweathermap.org/img/w/${weatherIcon}.png`;
          iconImg.alt = "Forecast Weather Icon";
          dayContainer.appendChild(iconImg);
          // Display other information
          var dayInfo = document.createElement('p');
          dayInfo.innerHTML = `Temp: ${temperature} °C<br>Wind: ${fWindSpeed} KPH<br>Humidity: ${fHumidity}%`;
          // Append the day information to the day container
          dayContainer.appendChild(dayInfo);
          // Append the day container to the forecast section
          forecastSection.appendChild(dayContainer);
          // Set text colour to white
          dayContainer.style.color = 'white';
          // Update the previousDate variable
          previousDate = currentDate;
        }
      }
    })
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
          console.log("JSON Response:", data);
        }
      });
  });
});