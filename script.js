const apiKey = "cce07aae3b406dacda45425b8da7c378";

// 🔍 Search by city
function getWeather() {
  const city = document.getElementById("city").value;

  if (!city) {
    alert("Enter a city name");
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  fetchWeather(url);
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");

  const btn = document.getElementById("themeBtn");

  if (document.body.classList.contains("dark")) {
    btn.innerText = "☀️ Light Mode";
  } else {
    btn.innerText = "🌙 Dark Mode";
  }
}

// 📍 Auto location
function getLocation() {
  const weatherResult = document.getElementById("weatherResult");

  if (navigator.geolocation) {
    weatherResult.innerHTML = "Getting location...";
    weatherResult.style.display = "block";

    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    alert("Geolocation not supported");
  }
}

function showPosition(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  fetchWeather(url);
}

function showError() {
  alert("Unable to get location");
}

// 🌐 Fetch weather + forecast
async function fetchWeather(url) {
  const weatherResult = document.getElementById("weatherResult");

  try {
    weatherResult.innerHTML = "Loading...";
    weatherResult.style.display = "block";

    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== "200") {
      weatherResult.innerHTML = "City not found!";
      return;
    }

    // 🌤️ Current weather
    const current = data.list[0];
    const iconCode = current.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    let html = `
      <h2>${data.city.name}</h2>
      <img src="${iconUrl}" class="main-icon">
      <p>🌡️ Temp: ${current.main.temp}°C</p>
      <p>${current.weather[0].main}</p>
      <p>💧 Humidity: ${current.main.humidity}%</p>

      <h3>5-Day Forecast</h3>
      <div class="forecast-container">
    `;

    // 📅 Filter 5 days
    const dailyData = data.list.filter(item =>
      item.dt_txt.includes("12:00:00")
    );

    // 📅 Forecast loop
    dailyData.forEach(day => {
      const date = new Date(day.dt_txt).toDateString();
      const temp = day.main.temp;
      const iconCode = day.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

      html += `
        <div class="forecast-item">
          <p>${date}</p>
          <img src="${iconUrl}">
          <p>${temp}°C</p>
        </div>
      `;
    });

    html += `</div>`;

    weatherResult.innerHTML = html;

  } catch (error) {
    console.log(error);
    weatherResult.innerHTML = "Error fetching data!";
  }
}

// ⌨️ Enter key
document.getElementById("city").addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    getWeather();
  }
});