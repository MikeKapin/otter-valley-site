document.addEventListener('DOMContentLoaded', () => {
  const loading = document.getElementById('weather-loading');
  const data = document.getElementById('weather-data');
  const fallback = document.getElementById('weather-fallback');

  if (!loading || !data || !fallback) return;

  // Straffordville, Ontario coordinates
  const lat = 42.62;
  const lon = -80.60;

  // Try Open-Meteo (no API key required)
  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10,weather_code&wind_speed_unit=kmh&timezone=America/Toronto`)
    .then((res) => res.json())
    .then((json) => {
      if (!json.current) throw new Error('No data');
      const c = json.current;
      const temp = Math.round(c.temperature_2m);
      const humidity = c.relative_humidity_2m;
      const wind = Math.round(c.wind_speed_10);
      const desc = weatherCodeToText(c.weather_code);

      document.getElementById('weather-temp').textContent = `${temp}\u00B0C`;
      document.getElementById('weather-desc').textContent = desc;
      document.getElementById('weather-wind').textContent = `Wind: ${wind} km/h`;
      document.getElementById('weather-humidity').textContent = `Humidity: ${humidity}%`;

      loading.style.display = 'none';
      data.style.display = 'block';
    })
    .catch(() => {
      loading.style.display = 'none';
      fallback.style.display = 'block';
    });
});

function weatherCodeToText(code) {
  const codes = {
    0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Foggy', 48: 'Rime fog', 51: 'Light drizzle', 53: 'Drizzle',
    55: 'Heavy drizzle', 61: 'Light rain', 63: 'Rain', 65: 'Heavy rain',
    71: 'Light snow', 73: 'Snow', 75: 'Heavy snow', 77: 'Snow grains',
    80: 'Light showers', 81: 'Showers', 82: 'Heavy showers',
    85: 'Light snow showers', 86: 'Snow showers',
    95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Severe thunderstorm',
  };
  return codes[code] || 'Unknown';
}
