# Skycast — Weather App

A clean, responsive weather app built with vanilla HTML, CSS, and JavaScript. Features a dark glassmorphism design with animated gradients that shift based on current weather conditions.

## Live Demo

🌐 [View on Netlify](http://gorgeous-muffin-f8fbd8.netlify.app)

## Features

- **Current weather** — temperature, description, humidity, wind speed, feels like, visibility
- **5-day forecast** strip with daily high/low and icons
- **Recent searches** — last 5 cities saved in `localStorage` as clickable chips
- **Dynamic background** — gradient shifts based on weather condition (sunny → warm orange, stormy → dark grey, rain → deep teal, snow → cold blue, etc.)
- **Smooth animations** — fade-in entrance on weather cards and staggered forecast items
- **Fully responsive** — works on mobile and desktop
- **Error handling** — styled error message for invalid cities

## Tech Stack

- Vanilla JavaScript (ES2022 — private class fields)
- HTML5 / CSS3 (Glassmorphism, CSS Grid, custom properties)
- [OpenWeatherMap API](https://openweathermap.org/api) — current weather + 5-day forecast
- [Outfit](https://fonts.google.com/specimen/Outfit) via Google Fonts

## Project Structure

```text
weather app/
├── index.html   # Markup and structure
├── index.js     # WeatherApp class + event wiring
└── styles.css   # Glassmorphism design + animations
```

## Running Locally

No build step needed — just open `index.html` in your browser:

```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

Or serve with any static server:

```bash
npx serve .
```

## API

Powered by [OpenWeatherMap](https://openweathermap.org/api). The app uses two endpoints:

| Endpoint | Purpose |
| --- | --- |
| `/weather` | Current weather for a city |
| `/forecast` | 3-hour interval data for 5 days |

---

Built by [Ketan Karlekar](https://github.com/ketankarlekar)
