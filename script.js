const cityName = document.querySelector('#city-name');
const maxTemp = document.querySelector('#max_temp');
const season = document.querySelector('#season');
const weatherImg = document.getElementById('weatherImg');
const inputBox = document.getElementById('inputBox');
const forecastDiv = document.querySelector('.forecast');

let city = 'Mumbai';
const apiKey = 'API_KEY';

// change the value of city according to input value
function getValue() {
  if (inputBox.value) {
    city = inputBox.value;
    getdata();
  }
}

// reset the value of input box
function resetValue() {
  inputBox.value = '';
}

// getting data from api
function getdata() {
  url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  let weatherData = {};
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      weatherData = data;
      cityName.textContent = weatherData.name;
      season.textContent = weatherData.weather[0].description;
      maxTemp.textContent = `${weatherData.main.temp} °C`;
      weatherImg.src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`;

      let insert = false;

      /* Getting data for 7 days forecast */
      function daysForecast() {
        const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude=current,hourly,minutely,alerts&units=metric&appid=${apiKey}`;
        const forecast = document.getElementsByClassName('forecast');

        fetch(url)
          .then((response) => response.json())
          .then((dataf) => {
            // console.log(data);
            let forecastDay = '';

            //deleting previous inserted node in forecast div
            forecastDiv.textContent = '';
            dataf.daily.forEach((value, index) => {
              if (index > 0 && index < 7) {
                //converting time to date
                let dayname = new Date(value.dt * 1000).toLocaleDateString(
                  'en',
                  {
                    weekday: 'long',
                  }
                );

                let icon = value.weather[0].icon;
                let temp = value.temp.day.toFixed(0);

                //adding every new element to the dom
                forecastDay = `<div
                  class="flex flex-col items-center bg-white/30 w-40 h-40 rounded-xl drop-shadow-lg backdrop-filter backdrop-blur-xl space-y-3"
                >
                  <h1 class="text-xl text-gray-900 mt-5">${dayname}</h1>
                  <img src="https://openweathermap.org/img/wn/${icon}.png" alt="" />
                  <p class="text-md">${temp} °C</p>
                </div>`;

                forecast[0].insertAdjacentHTML('beforeend', forecastDay);
              }
            });
          });
      }

      daysForecast();
    });
}

// capturing the enter key press
document.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    getValue();
    resetValue();
  }
});

getdata();
