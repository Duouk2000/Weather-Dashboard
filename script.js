// API key for OpenWeatherMap API
const apiKey = "20be103c6242f46290b71482f79294de";

// Function to fetch weather data from OpenWeatherMap API
function getWeatherData(city, apiKey) {
  // Construct the API URL based on the city and API key
  const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  // Fetch data from the API and parse the JSON response
  return fetch(apiURL)
    .then(response => response.json());
}

// Function to format the current date
function formatDate(date) {
  return dayjs(date).format("(DD/MM/YYYY)");
}

// Function to update weather information in the HTML document
function updateWeatherInfo(data) {
  // Convert temperature from Kelvin to Celsius
  const tempC = data.main.temp - 273.15;

  // Update HTML elements with weather information
  const cityElement = document.getElementById("city");
  cityElement.innerText = data.name;
  document.getElementById("temperature").innerText = `Temp: ${tempC.toFixed(2)} °C`;
  document.getElementById("windSpeed").innerText = `Wind: ${data.wind.speed} KPH`;
  document.getElementById("humidity").innerText = `Humidity: ${data.main.humidity}%`;

  // Set the current date next to the city
  const currentDate = formatDate(new Date());

  // Get the weather icon code from the data
  const weatherIcon = data.weather[0].icon;

  // Create an <img> tag for the weather icon
  const iconImg = document.createElement("img");
  iconImg.src = `http://openweathermap.org/img/w/${weatherIcon}.png`;
  iconImg.alt = "Weather Icon";

  // Append the current date and weather icon to the "city" element
  cityElement.innerHTML += ` ${currentDate}`;
  cityElement.appendChild(iconImg);

  // Extract latitude and longitude from the response
  const lat = data.coord.lat;
  const lon = data.coord.lon;

  // Use latitude and longitude variables to make the 5 Day Weather Forecast API call
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  // Fetch data from the forecast API and parse the JSON response
  fetch(forecastURL)
    .then(response => response.json())
    .then(forecastData => {
      const forecastSection = document.getElementById("forecast");

      // Clear existing weather forecast data
      forecastSection.innerHTML = '';

      // Initialize the previous date variable
      let previousDate = '';

      // Loop through the forecast data starting from the 8th element
      for (let i = 8; i < forecastData.list.length; i++) {
        // Extract the date for each forecast entry
        const currentDate = dayjs(forecastData.list[i].dt_txt).format('DD/MM/YYYY');

        // Check if it's a new day
        if (currentDate !== previousDate) {
          // Extract specific information for each forecast entry
          const date = dayjs(forecastData.list[i].dt_txt).format('DD/MM/YYYY');
          const temperature = (forecastData.list[i].main.temp - 273.15).toFixed(2); // Convert from Kelvin to Celsius
          const windSpeed = forecastData.list[i].wind.speed;
          const humidity = forecastData.list[i].main.humidity;
          const weatherIcon = forecastData.list[i].weather[0].icon; // Get the forecast icon code

          // Create new HTML elements for each day
          const forecastDayContainer = document.createElement('div');
          forecastDayContainer.classList.add('col-md-2', 'mb-3', 'forecast-day');
          forecastDayContainer.style.cssText = 'background-color: #2D3E50; margin: 10px; color: white;';

          // Display date
          const dateInfo = document.createElement('p');
          dateInfo.textContent = `${date}`;
          forecastDayContainer.appendChild(dateInfo);

          // Create an <img> tag for the forecast icon
          const iconImg = document.createElement('img');
          iconImg.src = `http://openweathermap.org/img/w/${weatherIcon}.png`;
          iconImg.alt = "Forecast Weather Icon";
          forecastDayContainer.appendChild(iconImg);

          // Display other information
          const dayInfo = document.createElement('p');
          dayInfo.innerHTML = `Temp: ${temperature} °C<br>Wind: ${windSpeed} KPH<br>Humidity: ${humidity}%`;

          // Append the day information to the day container
          forecastDayContainer.appendChild(dayInfo);

          // Append the day container to the forecast section
          forecastSection.appendChild(forecastDayContainer);

          // Update the previousDate variable
          previousDate = currentDate;
        }
      }
    })
}

// Event listener for DOMContentLoaded event (page load) and form submission
document.addEventListener('DOMContentLoaded', function () {
  // Event listener for form submission
  document.getElementById('search-form').addEventListener('submit', function (event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Get the city input value from the form
    const cityInput = document.getElementById('search-input').value;

    // Clear existing weather data
    document.getElementById('forecast').innerHTML = '';
    document.getElementById('city').innerHTML = '';

    // Fetch weather data for the entered city and update the UI
    getWeatherData(cityInput, apiKey)
      .then(function (data) {
        if (data) {
          updateWeatherInfo(data);
          
          // Add the searched city to the search history
          addToSearchHistory(cityInput);
          
          // Clear the input field
          document.getElementById('search-input').value = '';
          
          // Generate buttons for each city in the updated search history
          generateSearchHistoryButtons(JSON.parse(localStorage.getItem('searchHistory')));
        }
      });
  });

  // Retrieve history data from localStorage on page load
  const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

  // Generate buttons for each city in the search history
  generateSearchHistoryButtons(searchHistory);
});

// Function to add a city to the search history in localStorage
function addToSearchHistory(city) {
  const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  if (!searchHistory.includes(city)) {
    searchHistory.push(city);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }
}

// Function to generate buttons for each city in the search history
function generateSearchHistoryButtons(searchHistory) {
  const historyContainer = document.getElementById('history');
  historyContainer.innerHTML = ''; // Clear existing content

  searchHistory.forEach(function (city) {
    // Create a button element for each city in the search history
    const historyButton = document.createElement('button');
    historyButton.innerText = city;
    historyButton.classList.add('list-group-item', 'list-group-item-action');

    // Add an event listener to each button to load data from localStorage
    historyButton.addEventListener('click', function () {
      // Fetch weather data for the selected city and update the UI
      getWeatherData(city, apiKey)
        .then(function (data) {
          if (data) {
            updateWeatherInfo(data);
          }
        });
    });

    // Append the button to the history container
    historyContainer.appendChild(historyButton);
  });
}