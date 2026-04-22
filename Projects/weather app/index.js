class WeatherApp {
  #apiKey = "b509a7a2a47ae405e6a555bd08b13edb";
  #baseUrl = "https://api.openweathermap.org/data/2.5";
  #historyKey = "skycast_recent";
  #maxHistory = 5;

  async getWeather(city) {
    try {
      const response = await fetch(
        `${this.#baseUrl}/weather?q=${city}&appid=${this.#apiKey}&units=metric`
      );
      if (!response.ok) throw new Error("City not found");
      return await response.json();
    } catch (error) {
      this.handleError(error);
    }
  }

  async getForecast(city) {
    try {
      const response = await fetch(
        `${this.#baseUrl}/forecast?q=${city}&appid=${this.#apiKey}&units=metric`
      );
      if (!response.ok) throw new Error("Forecast unavailable");
      return await response.json();
    } catch (error) {
      this.handleError(error);
    }
  }

  handleError(error) {
    const errorEl = document.getElementById("error");
    const errorText = document.getElementById("errorText");
    errorText.textContent = error.message;
    errorEl.classList.remove("hidden");
    setTimeout(() => errorEl.classList.add("hidden"), 4000);
  }

  renderWeather(data) {
    document.getElementById("city").textContent = data.name + ", " + data.sys.country;
    document.getElementById("temp").textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById("desc").textContent = data.weather[0].description;
    document.getElementById("weatherDate").textContent = this.#formatDate(new Date());
    document.getElementById("humidity").textContent = `${data.main.humidity}%`;
    document.getElementById("wind").textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
    document.getElementById("feelsLike").textContent = `${Math.round(data.main.feels_like)}°C`;
    document.getElementById("visibility").textContent =
      data.visibility ? `${(data.visibility / 1000).toFixed(1)} km` : "N/A";

    const icon = data.weather[0].icon;
    const iconEl = document.getElementById("weatherIcon");
    iconEl.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    iconEl.alt = data.weather[0].description;

    this.#updateBackground(data.weather[0].main);

    const card = document.getElementById("weatherCard");
    card.classList.remove("hidden");
    card.classList.remove("fade-in");
    void card.offsetWidth;
    card.classList.add("fade-in");
  }

  renderForecast(data) {
    const strip = document.getElementById("forecastStrip");
    strip.innerHTML = "";

    const daily = this.#getDailyForecasts(data.list);

    daily.forEach((item, i) => {
      const div = document.createElement("div");
      div.className = "forecast-item";
      div.style.animationDelay = `${i * 60}ms`;

      const date = new Date(item.dt * 1000);
      const dayName = i === 0 ? "Today" : date.toLocaleDateString("en-US", { weekday: "short" });
      const icon = item.weather[0].icon;
      const high = Math.round(item.main.temp_max);
      const low = Math.round(item.main.temp_min);
      const desc = item.weather[0].main;

      div.innerHTML = `
        <span class="forecast-day">${dayName}</span>
        <img class="forecast-icon" src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}" />
        <span class="forecast-desc">${desc}</span>
        <div class="forecast-temps">
          <span class="forecast-high">${high}°</span>
          <span class="forecast-low">${low}°</span>
        </div>
      `;
      strip.appendChild(div);
    });

    const forecastCard = document.getElementById("forecastCard");
    forecastCard.classList.remove("hidden");
    forecastCard.classList.remove("fade-in");
    void forecastCard.offsetWidth;
    forecastCard.classList.add("fade-in");
  }

  #getDailyForecasts(list) {
    const seen = new Set();
    const daily = [];
    for (const item of list) {
      const date = new Date(item.dt * 1000).toDateString();
      if (!seen.has(date)) {
        seen.add(date);
        daily.push(item);
      }
      if (daily.length === 5) break;
    }
    return daily;
  }

  saveToHistory(city) {
    const history = this.loadHistory().filter(
      (c) => c.toLowerCase() !== city.toLowerCase()
    );
    history.unshift(city);
    localStorage.setItem(this.#historyKey, JSON.stringify(history.slice(0, this.#maxHistory)));
    this.renderHistory();
  }

  loadHistory() {
    try {
      return JSON.parse(localStorage.getItem(this.#historyKey)) || [];
    } catch {
      return [];
    }
  }

  renderHistory() {
    const container = document.getElementById("recentSearches");
    const history = this.loadHistory();
    container.innerHTML = "";

    if (history.length === 0) return;

    history.forEach((city) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip";
      chip.textContent = city;
      chip.addEventListener("click", () => app.search(city));
      container.appendChild(chip);
    });
  }

  showLoading() {
    document.getElementById("loading").classList.remove("hidden");
    document.getElementById("error").classList.add("hidden");
  }

  hideLoading() {
    document.getElementById("loading").classList.add("hidden");
  }

  #updateBackground(condition) {
    const bg = document.getElementById("bgGradient");
    const gradients = {
      Clear:        "linear-gradient(135deg, #1a1a2e 0%, #c97b2a 40%, #e8a838 80%, #1a1a2e 100%)",
      Clouds:       "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
      Rain:         "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
      Drizzle:      "linear-gradient(135deg, #1c3a4a 0%, #2c5f6e 50%, #1a3040 100%)",
      Thunderstorm: "linear-gradient(135deg, #0d0d0d 0%, #1a1a2e 40%, #2d1b4e 100%)",
      Snow:         "linear-gradient(135deg, #1a2a4a 0%, #2c4a7c 50%, #3a6fa8 100%)",
      Mist:         "linear-gradient(135deg, #1c1c2e 0%, #2d3561 50%, #1c2a3a 100%)",
      Fog:          "linear-gradient(135deg, #1c1c2e 0%, #2d3561 50%, #1c2a3a 100%)",
      Haze:         "linear-gradient(135deg, #1c1c2e 0%, #3a2d1c 50%, #2a1c0e 100%)",
      Smoke:        "linear-gradient(135deg, #111111 0%, #2d2d2d 50%, #1a1a1a 100%)",
      Dust:         "linear-gradient(135deg, #2a1a0e 0%, #4a3010 50%, #2a1a0e 100%)",
      Sand:         "linear-gradient(135deg, #2a1a0e 0%, #4a3010 50%, #2a1a0e 100%)",
      Tornado:      "linear-gradient(135deg, #0d0d0d 0%, #1a0f0f 50%, #2d1010 100%)",
    };
    bg.style.background = gradients[condition] ||
      "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)";
  }

  #formatDate(date) {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }
}

// ── App init ────────────────────────────────────────────────────────────────

const app = new WeatherApp();

app.search = async function (city) {
  if (!city.trim()) return;
  app.showLoading();

  const [weather, forecast] = await Promise.all([
    app.getWeather(city),
    app.getForecast(city),
  ]);

  app.hideLoading();

  if (weather) {
    app.renderWeather(weather);
    app.saveToHistory(weather.name);
  }
  if (forecast) {
    app.renderForecast(forecast);
  }
};

// Search triggers
document.getElementById("searchBtn").addEventListener("click", () => {
  const city = document.getElementById("searchInput").value.trim();
  app.search(city);
});

document.getElementById("searchInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const city = e.target.value.trim();
    app.search(city);
  }
});

// Boot
app.renderHistory();
app.search("London");
