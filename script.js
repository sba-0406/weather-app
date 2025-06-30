
const API_KEY = "c78d7cf5c3249416443377798e35d9a4";

const toggle = document.getElementById("themeToggle");

// Check and apply saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  toggle.checked = true;
}

toggle.addEventListener("change", () => {
  document.body.classList.toggle("dark");
  // Save preference
  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
});


async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const weatherDiv = document.getElementById("weatherResult");
  const errorMsg = document.getElementById("errorMsg");

  if (!city) {
    errorMsg.textContent = "Please enter a city name.";
    weatherDiv.classList.add("hidden");
    return;
  }

  try {
    errorMsg.textContent = "";
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    );
    if (!res.ok) throw new Error("City not found");

    const data = await res.json();

    document.getElementById("cityName").textContent = data.name;
    document.getElementById("description").textContent = data.weather[0].description;
    document.getElementById("temperature").textContent = `🌡️ Temperature: ${data.main.temp} °C`;
    document.getElementById("humidity").textContent = `💧 Humidity: ${data.main.humidity}%`;
    document.getElementById("wind").textContent = `🌬️ Wind: ${data.wind.speed} m/s`;
    document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    weatherDiv.classList.remove("hidden");
    getForecast(city);
  } catch (error) {
    errorMsg.textContent = error.message;
    weatherDiv.classList.add("hidden");
  }
}

async function getForecast(city) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
  );
  const data = await res.json();

  const forecastDiv = document.getElementById("forecastCards");
  forecastDiv.innerHTML = "";

  const daily = {};

  data.list.forEach(item => {
    const date = item.dt_txt.split(" ")[0];
    if (!daily[date]) daily[date] = item;
  });

  Object.values(daily).slice(0, 5).forEach(day => {
    const description = day.weather[0].description;
    const card = document.createElement("div");
    card.className = "forecast-card";
    card.setAttribute("data-tooltip", `Weather means: ${description}`);
    card.innerHTML = `
      <p><strong>${new Date(day.dt_txt).toDateString()}</strong></p>
      <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" />
      <p>${description}</p>
      <p>🌡️ ${day.main.temp} °C</p>
    `;
    forecastDiv.appendChild(card);
  });

  document.getElementById("forecast").classList.remove("hidden");
}
